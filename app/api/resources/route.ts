import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// Helper function to generate unique slug for resources
async function generateUniqueResourceSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.resource.findUnique({
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

// GET /api/resources - List all resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (type) where.type = type;
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        files: true, // Include attached files
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource
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
    const { title, description, url, files, type, isActive } = body;

    // Validation
    if (!title || !description || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // At least one of url or files must be provided
    if (!url && (!files || files.length === 0)) {
      return NextResponse.json(
        { error: 'Either URL or at least one file must be provided' },
        { status: 400 }
      );
    }

    // Generate unique slug from title
    const slug = await generateUniqueResourceSlug(title);

    const resource = await prisma.resource.create({
      data: {
        title,
        slug,
        description,
        url: url || null,
        type,
        isActive: isActive !== undefined ? isActive : true,
        files: files && files.length > 0 ? {
          create: files.map((file: any) => ({
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
          }))
        } : undefined,
      },
      include: {
        files: true,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

// PUT /api/resources - Update a resource
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
    const { id, title, description, url, files, filesToDelete, type, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    // Delete specified files if any
    if (filesToDelete && filesToDelete.length > 0) {
      await prisma.resourceFile.deleteMany({
        where: {
          id: { in: filesToDelete },
          resourceId: id,
        },
      });
    }

    // Generate new slug if title changed
    let slug: string | undefined;
    if (title) {
      slug = await generateUniqueResourceSlug(title, id);
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(url !== undefined && { url }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
        ...(files && files.length > 0 && {
          files: {
            create: files.map((file: any) => ({
              fileName: file.fileName,
              fileUrl: file.fileUrl,
              fileSize: file.fileSize,
              mimeType: file.mimeType,
            }))
          }
        }),
      },
      include: {
        files: true,
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources - Delete a resource
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
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}

