import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// Types for sections
interface EventSectionFile {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface EventSectionInput {
  id?: string;
  title?: string;
  titleEn?: string;
  content?: string;
  contentEn?: string;
  backgroundColor?: string;
  displayOrder: number;
  files?: EventSectionFile[];
}

// Helper function to generate unique slug for events
async function generateUniqueEventSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.event.findUnique({
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

// GET /api/events - List all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSections = searchParams.get('includeSections') === 'true';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const events = await prisma.event.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: includeSections ? {
        sections: {
          orderBy: { displayOrder: 'asc' },
          include: {
            files: true,
          },
        },
      } : undefined,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
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
    const { title, titleEn, type, shortDescription, shortDescriptionEn, detailedDescription, detailedDescriptionEn, imageUrl, eventDate, dateText, dateTextEn, location, locationEn, displayOrder, sections, isActive } = body;

    // Validation
    if (!title || !type || !shortDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique slug from title
    const slug = await generateUniqueEventSlug(title);

    const event = await prisma.event.create({
      data: {
        title,
        titleEn: titleEn || null,
        slug,
        type,
        shortDescription,
        shortDescriptionEn: shortDescriptionEn || null,
        detailedDescription: detailedDescription || null,
        detailedDescriptionEn: detailedDescriptionEn || null,
        imageUrl: imageUrl || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        dateText: dateText || null,
        dateTextEn: dateTextEn || null,
        location: location || null,
        locationEn: locationEn || null,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
        sections: sections && sections.length > 0 ? {
          create: sections.map((section: EventSectionInput) => ({
            title: section.title || null,
            titleEn: section.titleEn || null,
            content: section.content || null,
            contentEn: section.contentEn || null,
            backgroundColor: section.backgroundColor || null,
            displayOrder: section.displayOrder || 0,
            files: section.files && section.files.length > 0 ? {
              create: section.files.map((file: EventSectionFile) => ({
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

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT /api/events - Update an event
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
    const { id, title, titleEn, type, shortDescription, shortDescriptionEn, detailedDescription, detailedDescriptionEn, imageUrl, eventDate, dateText, dateTextEn, location, locationEn, displayOrder, sections, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Generate new slug if title changed
    let slug: string | undefined;
    if (title) {
      slug = await generateUniqueEventSlug(title, id);
    }

    // Handle sections update if provided
    if (sections !== undefined) {
      // Get existing sections to determine what to delete
      const existingSections = await prisma.eventSection.findMany({
        where: { eventId: id },
        select: { id: true },
      });

      const existingSectionIds = existingSections.map(s => s.id);
      const incomingSectionIds = sections
        .filter((s: EventSectionInput) => s.id)
        .map((s: EventSectionInput) => s.id);

      // Delete sections that are no longer in the list
      const sectionsToDelete = existingSectionIds.filter(
        (existingId: string) => !incomingSectionIds.includes(existingId)
      );

      if (sectionsToDelete.length > 0) {
        await prisma.eventSection.deleteMany({
          where: { id: { in: sectionsToDelete } },
        });
      }

      // Update or create sections
      for (const section of sections as EventSectionInput[]) {
        if (section.id) {
          // Update existing section
          // First, get existing files
          const existingFiles = await prisma.eventSectionFile.findMany({
            where: { sectionId: section.id },
            select: { id: true },
          });

          const existingFileIds = existingFiles.map(f => f.id);
          const incomingFileIds = (section.files || [])
            .filter((f: EventSectionFile) => f.id)
            .map((f: EventSectionFile) => f.id);

          // Delete files that are no longer in the list
          const filesToDelete = existingFileIds.filter(
            (existingId: string) => !incomingFileIds.includes(existingId)
          );

          if (filesToDelete.length > 0) {
            await prisma.eventSectionFile.deleteMany({
              where: { id: { in: filesToDelete } },
            });
          }

          // Update section
          await prisma.eventSection.update({
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
          const newFiles = (section.files || []).filter((f: EventSectionFile) => !f.id);
          if (newFiles.length > 0) {
            await prisma.eventSectionFile.createMany({
              data: newFiles.map((file: EventSectionFile) => ({
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
          await prisma.eventSection.create({
            data: {
              eventId: id,
              title: section.title || null,
              titleEn: section.titleEn || null,
              content: section.content || null,
              contentEn: section.contentEn || null,
              backgroundColor: section.backgroundColor || null,
              displayOrder: section.displayOrder || 0,
              files: section.files && section.files.length > 0 ? {
                create: section.files.map((file: EventSectionFile) => ({
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

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(titleEn !== undefined && { titleEn }),
        ...(slug && { slug }),
        ...(type && { type }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(shortDescriptionEn !== undefined && { shortDescriptionEn }),
        ...(detailedDescription !== undefined && { detailedDescription }),
        ...(detailedDescriptionEn !== undefined && { detailedDescriptionEn }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(eventDate !== undefined && { eventDate: eventDate ? new Date(eventDate) : null }),
        ...(dateText !== undefined && { dateText: dateText || null }),
        ...(dateTextEn !== undefined && { dateTextEn: dateTextEn || null }),
        ...(location !== undefined && { location: location || null }),
        ...(locationEn !== undefined && { locationEn: locationEn || null }),
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

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events - Delete an event
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
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
