import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /resources/[slug]/download - Redirect to file download
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const fileIndex = searchParams.get('file');

    // Find resource by slug
    const resource = await prisma.resource.findUnique({
      where: { slug },
      include: {
        files: true,
      },
    });

    if (!resource) {
      return NextResponse.redirect(new URL('/resources', request.url));
    }

    // If file index is specified, redirect to that specific file
    if (fileIndex !== null) {
      const index = parseInt(fileIndex, 10);
      if (!isNaN(index) && index >= 0 && index < resource.files.length) {
        const file = resource.files[index];
        return NextResponse.redirect(file.fileUrl);
      }
    }

    // If only one file or no index specified, redirect to first file
    if (resource.files.length >= 1) {
      return NextResponse.redirect(resource.files[0].fileUrl);
    }

    // If no files but has URL, redirect to URL
    if (resource.url) {
      return NextResponse.redirect(resource.url);
    }

    // Fallback to resources page
    return NextResponse.redirect(new URL('/resources', request.url));
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.redirect(new URL('/resources', request.url));
  }
}
