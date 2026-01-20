import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/files/[slug] - Get file download info by resource slug
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
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // If file index is specified, redirect to that specific file
    if (fileIndex !== null) {
      const index = parseInt(fileIndex, 10);
      if (isNaN(index) || index < 0 || index >= resource.files.length) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      
      const file = resource.files[index];
      return NextResponse.redirect(file.fileUrl);
    }

    // If only one file, redirect directly
    if (resource.files.length === 1) {
      return NextResponse.redirect(resource.files[0].fileUrl);
    }

    // If multiple files, return file list
    if (resource.files.length > 1) {
      return NextResponse.json({
        resource: {
          title: resource.title,
          slug: resource.slug,
          description: resource.description,
        },
        files: resource.files.map((file, index) => ({
          name: file.fileName,
          url: `/api/files/${slug}?file=${index}`,
          directUrl: file.fileUrl,
          size: file.fileSize,
          mimeType: file.mimeType,
        })),
      });
    }

    // If no files but has URL
    if (resource.url) {
      return NextResponse.redirect(resource.url);
    }

    return NextResponse.json(
      { error: 'No files available for this resource' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}
