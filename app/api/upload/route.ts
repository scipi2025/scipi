import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { uploadToStorage } from '@/lib/supabase';

export const runtime = 'nodejs';

// POST /api/upload - Upload a file to Supabase Storage
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
    const type = formData.get('type') as string; // 'partner' | 'event' | 'resource' | 'project'

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const safeFilename = `${timestamp}-${randomString}.${extension}`;

    // Determine folder based on type
    const folder = type || 'general';

    // Upload to Supabase Storage
    const { url, error } = await uploadToStorage(buffer, safeFilename, file.type, folder);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      url,
      filename: safeFilename,
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
