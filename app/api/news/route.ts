import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// Helper function to generate unique slug for news
async function generateUniqueNewsSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.news.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// GET /api/news - List all news items or get single by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const slug = searchParams.get('slug');

    // If slug is provided, return single news item
    if (slug) {
      const newsItem = await prisma.news.findUnique({
        where: { slug },
        include: {
          event: { select: { id: true, slug: true, title: true } },
          project: { select: { id: true, slug: true, title: true } },
          resource: { select: { id: true, slug: true, title: true } },
        },
      });

      if (!newsItem) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
      }

      return NextResponse.json(newsItem);
    }

    const news = await prisma.news.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { displayOrder: 'asc' },
      include: {
        event: {
          select: { id: true, slug: true, title: true }
        },
        project: {
          select: { id: true, slug: true, title: true }
        },
        resource: {
          select: { id: true, slug: true, title: true }
        }
      }
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST /api/news - Create a new news item
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
      excerpt, 
      excerptEn,
      content, 
      contentEn,
      linkType, 
      linkUrl, 
      eventId, 
      projectId, 
      resourceId,
      displayOrder,
      isActive,
      publishedAt
    } = body;

    // Validation
    if (!title || !linkType) {
      return NextResponse.json(
        { error: 'Titlul și tipul link-ului sunt obligatorii' },
        { status: 400 }
      );
    }

    // Validate linkType
    const validLinkTypes = ['internal', 'event', 'project', 'resource', 'external'];
    if (!validLinkTypes.includes(linkType)) {
      return NextResponse.json(
        { error: 'Tip de link invalid' },
        { status: 400 }
      );
    }

    // Validate that required link is provided based on type
    if (linkType === 'event' && !eventId) {
      return NextResponse.json(
        { error: 'Selectați un eveniment' },
        { status: 400 }
      );
    }
    if (linkType === 'project' && !projectId) {
      return NextResponse.json(
        { error: 'Selectați un proiect' },
        { status: 400 }
      );
    }
    if (linkType === 'resource' && !resourceId) {
      return NextResponse.json(
        { error: 'Selectați o resursă' },
        { status: 400 }
      );
    }
    if (linkType === 'external' && !linkUrl) {
      return NextResponse.json(
        { error: 'Introduceți URL-ul extern' },
        { status: 400 }
      );
    }

    // Generate unique slug for internal news
    const slug = linkType === 'internal' ? await generateUniqueNewsSlug(title) : null;

    const newsItem = await prisma.news.create({
      data: {
        title,
        titleEn: titleEn || null,
        slug,
        excerpt: excerpt || null,
        excerptEn: excerptEn || null,
        content: content || null,
        contentEn: contentEn || null,
        linkType,
        linkUrl: linkUrl || null,
        eventId: linkType === 'event' ? eventId : null,
        projectId: linkType === 'project' ? projectId : null,
        resourceId: linkType === 'resource' ? resourceId : null,
        displayOrder: displayOrder ?? 0,
        isActive: isActive ?? true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
      include: {
        event: { select: { id: true, slug: true, title: true } },
        project: { select: { id: true, slug: true, title: true } },
        resource: { select: { id: true, slug: true, title: true } }
      }
    });

    return NextResponse.json(newsItem, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

// PUT /api/news - Update a news item
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
      excerpt, 
      excerptEn,
      content, 
      contentEn,
      linkType, 
      linkUrl, 
      eventId, 
      projectId, 
      resourceId,
      displayOrder,
      isActive,
      publishedAt
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }

    // Get current news item to check if we need to update slug
    const currentNews = await prisma.news.findUnique({ where: { id } });
    if (!currentNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (title !== undefined) updateData.title = title;
    if (titleEn !== undefined) updateData.titleEn = titleEn;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (excerptEn !== undefined) updateData.excerptEn = excerptEn;
    if (content !== undefined) updateData.content = content;
    if (contentEn !== undefined) updateData.contentEn = contentEn;
    if (linkType !== undefined) updateData.linkType = linkType;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (publishedAt !== undefined) updateData.publishedAt = new Date(publishedAt);

    // Update link references based on linkType
    if (linkType !== undefined) {
      updateData.eventId = linkType === 'event' ? eventId : null;
      updateData.projectId = linkType === 'project' ? projectId : null;
      updateData.resourceId = linkType === 'resource' ? resourceId : null;
    }

    // Handle slug updates
    const effectiveLinkType = linkType ?? currentNews.linkType;
    const effectiveTitle = title ?? currentNews.title;
    
    // Generate slug if switching to internal or if title changed for internal news
    if (effectiveLinkType === 'internal') {
      // Only regenerate if title changed or switching to internal
      if (title !== undefined || (linkType === 'internal' && currentNews.linkType !== 'internal')) {
        updateData.slug = await generateUniqueNewsSlug(effectiveTitle, id);
      }
    } else {
      // Clear slug for non-internal news
      updateData.slug = null;
    }

    const newsItem = await prisma.news.update({
      where: { id },
      data: updateData,
      include: {
        event: { select: { id: true, slug: true, title: true } },
        project: { select: { id: true, slug: true, title: true } },
        resource: { select: { id: true, slug: true, title: true } }
      }
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE /api/news - Delete a news item
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
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}

// PATCH /api/news - Update display order (for drag & drop reordering)
export async function PATCH(request: NextRequest) {
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
    const { items } = body; // Array of { id, displayOrder }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item: { id: string; displayOrder: number }) =>
        prisma.news.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating news order:', error);
    return NextResponse.json(
      { error: 'Failed to update news order' },
      { status: 500 }
    );
  }
}
