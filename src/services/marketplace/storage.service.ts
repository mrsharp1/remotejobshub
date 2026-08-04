import { supabase } from '@/lib/supabase'

export const storageService = {
  /**
   * Upload user document/images to Supabase storage buckets
   */
  async uploadFile(
    bucket: 'listings' | 'kyc-documents' | 'avatars' | 'testimonials-videos' | 'testimonials-thumbnails',
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

      if (error) throw error

      // 2. Fetch and return public access URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
      return publicUrlData.publicUrl
    } catch (err) {
      console.error(`Storage upload failed for bucket "${bucket}":`, err)
      throw err
    }
  },

  /**
   * Delete file from target bucket
   */
  async deleteFile(
    bucket: 'listings' | 'kyc-documents' | 'avatars' | 'testimonials-videos' | 'testimonials-thumbnails',
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
}
export default storageService
