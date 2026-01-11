import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client with service role key for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Storage bucket name for uploads
export const STORAGE_BUCKET = 'uploads';

// Upload file to Supabase Storage
export async function uploadToStorage(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'general'
): Promise<{ url: string; error: string | null }> {
  try {
    const filePath = `${folder}/${Date.now()}-${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { url: '', error: error.message };
    }

    // Get public URL
    const { data: publicUrl } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return { url: publicUrl.publicUrl, error: null };
  } catch (err) {
    console.error('Upload error:', err);
    return { url: '', error: 'Failed to upload file' };
  }
}

// Delete file from Supabase Storage
export async function deleteFromStorage(fileUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/storage/v1/object/public/');
    if (pathParts.length < 2) return false;
    
    const bucketAndPath = pathParts[1];
    const filePath = bucketAndPath.replace(`${STORAGE_BUCKET}/`, '');

    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
}
