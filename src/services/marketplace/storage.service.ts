import { supabase } from '@/lib/supabase'

export const storageService = {
  /**
   * Upload user document/images to Supabase storage buckets
   */
  async uploadFile(
    bucket:
      | 'listings'
      | 'kyc-documents'
      | 'avatars'
      | 'testimonials-videos'
      | 'testimonials-thumbnails',
    path: string,
    file: File
  ): Promise<string> {
    try {
      // 1. Upload file object to target bucket
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) {
        console.error(
          `[StorageService] Upload failed. Bucket: "${bucket}", Path: "${path}"\nError:`,
          error
        )
        throw new Error(error.message || 'Unknown storage error')
      }

      // 2. Fetch and return public access URL (or path for private buckets)
      if (bucket === 'kyc-documents') {
        // For private buckets, we return the path so the UI can generate a signed URL later
        return data.path
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
      return publicUrlData.publicUrl
    } catch (err: any) {
      console.error(
        `[StorageService] Exception during upload for bucket "${bucket}", path "${path}":`,
        err
      )
      throw err
    }
  },

  /**
   * Delete file from target bucket
   */
  async deleteFile(
    bucket:
      | 'listings'
      | 'kyc-documents'
      | 'avatars'
      | 'testimonials-videos'
      | 'testimonials-thumbnails',
    path: string
  ): Promise<void> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path])
      if (error) throw error
    } catch (err) {
      console.error(
        `Storage delete failed for path "${path}" in bucket "${bucket}":`,
        err
      )
      throw err
    }
  },

  /**
   * Get a temporary signed URL for a private file
   */
  async getSignedUrl(
    bucket: 'kyc-documents',
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    
    if (error) {
      console.error(`Failed to generate signed URL for ${path}`, error)
      throw error
    }
    return data.signedUrl
  },
}
export default storageService
