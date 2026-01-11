import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const runtime = 'nodejs';

// POST /api/upload - Upload an image to local storage
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'partner' | 'event' | 'resource'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type based on upload type
    let allowedTypes: string[];
    let maxSize: number;

    if (type === 'resource') {
      // Allow documents for resources
      allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed'
      ];
      maxSize = 10 * 1024 * 1024; // 10MB for documents
    } else {
      // Only images for other types
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      maxSize = 5 * 1024 * 1024; // 5MB for images
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: type === 'resource' ? 'Invalid file type. Allowed: images, PDF, Word, Excel, PowerPoint, text, ZIP.' : 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Determine upload directory based on type
    let uploadDir: string;
    let publicUrl: string;

    switch (type) {
      case 'partner':
        uploadDir = join(process.cwd(), 'public', 'uploads', 'partners');
        publicUrl = `/uploads/partners/${filename}`;
        break;
      case 'project':
        uploadDir = join(process.cwd(), 'public', 'uploads', 'projects');
        publicUrl = `/uploads/projects/${filename}`;
        break;
      case 'event':
        uploadDir = join(process.cwd(), 'public', 'uploads', 'events');
        publicUrl = `/uploads/events/${filename}`;
        break;
      case 'resource':
        uploadDir = join(process.cwd(), 'public', 'uploads', 'resources');
        publicUrl = `/uploads/resources/${filename}`;
        break;
      default:
        uploadDir = join(process.cwd(), 'public', 'uploads', 'general');
        publicUrl = `/uploads/general/${filename}`;
    }

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

