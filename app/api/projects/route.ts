import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// Types for sections
interface ProjectSectionFile {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface ProjectSectionInput {
  id?: string;
  title?: string;
  titleEn?: string;
  content?: string;
  contentEn?: string;
  backgroundColor?: string;
  displayOrder: number;
  files?: ProjectSectionFile[];
}

// Helper function to generate unique slug for projects
async function generateUniqueProjectSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    });
    
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSections = searchParams.get('includeSections') === 'true';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const projects = await prisma.project.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: includeSections ? {
        sections: {
          orderBy: { displayOrder: 'asc' },
          include: {
            files: true,
          },
        },
      } : undefined,
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      titleEn, 
      shortDescription, 
      shortDescriptionEn, 
      detailedDescription, 
      detailedDescriptionEn, 
      imageUrl,
      status, 
      startDate, 
      endDate, 
      displayOrder, 
      sections,
      isActive 
    } = body;

    // Validation
    if (!title || !shortDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get max displayOrder if not provided
    let order = displayOrder;
    if (order === undefined) {
      const maxOrder = await prisma.project.findFirst({
        orderBy: { displayOrder: 'desc' },
        select: { displayOrder: true },
      });
      order = (maxOrder?.displayOrder ?? -1) + 1;
    }

    // Generate unique slug from title
    const slug = await generateUniqueProjectSlug(title);

    const project = await prisma.project.create({
      data: {
        title,
        titleEn: titleEn || null,
        slug,
        shortDescription,
        shortDescriptionEn: shortDescriptionEn || null,
        detailedDescription: detailedDescription || null,
        detailedDescriptionEn: detailedDescriptionEn || null,
        imageUrl: imageUrl || null,
        status: status || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        displayOrder: order,
        isActive: isActive !== undefined ? isActive : true,
        sections: sections && sections.length > 0 ? {
          create: sections.map((section: ProjectSectionInput) => ({
            title: section.title || null,
            titleEn: section.titleEn || null,
            content: section.content || null,
            contentEn: section.contentEn || null,
            backgroundColor: section.backgroundColor || null,
            displayOrder: section.displayOrder || 0,
            files: section.files && section.files.length > 0 ? {
              create: section.files.map((file: ProjectSectionFile) => ({
                fileName: file.fileName,
                fileUrl: file.fileUrl,
                fileSize: file.fileSize,
                mimeType: file.mimeType,
              })),
            } : undefined,
          })),
        } : undefined,
      },
      include: {
        sections: {
          orderBy: { displayOrder: 'asc' },
          include: { files: true },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects - Update a project
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id, 
      title, 
      titleEn, 
      shortDescription, 
      shortDescriptionEn, 
      detailedDescription, 
      detailedDescriptionEn, 
      imageUrl,
      status, 
      startDate, 
      endDate, 
      displayOrder, 
      sections,
      isActive 
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Generate new slug if title changed
    let slug: string | undefined;
    if (title) {
      slug = await generateUniqueProjectSlug(title, id);
    }

    // Handle sections update if provided
    if (sections !== undefined) {
      // Get existing sections to determine what to delete
      const existingSections = await prisma.projectSection.findMany({
        where: { projectId: id },
        select: { id: true },
      });

      const existingSectionIds = existingSections.map(s => s.id);
      const incomingSectionIds = sections
        .filter((s: ProjectSectionInput) => s.id)
        .map((s: ProjectSectionInput) => s.id);

      // Delete sections that are no longer in the list
      const sectionsToDelete = existingSectionIds.filter(
        (existingId: string) => !incomingSectionIds.includes(existingId)
      );

      if (sectionsToDelete.length > 0) {
        await prisma.projectSection.deleteMany({
          where: { id: { in: sectionsToDelete } },
        });
      }

      // Update or create sections
      for (const section of sections as ProjectSectionInput[]) {
        if (section.id) {
          // Update existing section
          // First, get existing files
          const existingFiles = await prisma.projectSectionFile.findMany({
            where: { sectionId: section.id },
            select: { id: true },
          });

          const existingFileIds = existingFiles.map(f => f.id);
          const incomingFileIds = (section.files || [])
            .filter((f: ProjectSectionFile) => f.id)
            .map((f: ProjectSectionFile) => f.id);

          // Delete files that are no longer in the list
          const filesToDelete = existingFileIds.filter(
            (existingId: string) => !incomingFileIds.includes(existingId)
          );

          if (filesToDelete.length > 0) {
            await prisma.projectSectionFile.deleteMany({
              where: { id: { in: filesToDelete } },
            });
          }

          // Update section
          await prisma.projectSection.update({
            where: { id: section.id },
            data: {
              title: section.title || null,
              titleEn: section.titleEn || null,
              content: section.content || null,
              contentEn: section.contentEn || null,
              backgroundColor: section.backgroundColor || null,
              displayOrder: section.displayOrder || 0,
            },
          });

          // Create new files
          const newFiles = (section.files || []).filter((f: ProjectSectionFile) => !f.id);
          if (newFiles.length > 0) {
            await prisma.projectSectionFile.createMany({
              data: newFiles.map((file: ProjectSectionFile) => ({
                sectionId: section.id!,
                fileName: file.fileName,
                fileUrl: file.fileUrl,
                fileSize: file.fileSize,
                mimeType: file.mimeType,
              })),
            });
          }
        } else {
          // Create new section
          await prisma.projectSection.create({
            data: {
              projectId: id,
              title: section.title || null,
              titleEn: section.titleEn || null,
              content: section.content || null,
              contentEn: section.contentEn || null,
              backgroundColor: section.backgroundColor || null,
              displayOrder: section.displayOrder || 0,
              files: section.files && section.files.length > 0 ? {
                create: section.files.map((file: ProjectSectionFile) => ({
                  fileName: file.fileName,
                  fileUrl: file.fileUrl,
                  fileSize: file.fileSize,
                  mimeType: file.mimeType,
                })),
              } : undefined,
            },
          });
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(titleEn !== undefined && { titleEn }),
        ...(slug && { slug }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(shortDescriptionEn !== undefined && { shortDescriptionEn }),
        ...(detailedDescription !== undefined && { detailedDescription }),
        ...(detailedDescriptionEn !== undefined && { detailedDescriptionEn }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(status !== undefined && { status }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        sections: {
          orderBy: { displayOrder: 'asc' },
          include: { files: true },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
