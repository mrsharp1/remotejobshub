import { supabase } from '@/lib/supabase'

export interface VideoGuide {
  id: string
  title: string
  description: string | null
  storage_path: string
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export const videoGuideService = {
  // Public - get only the published guide
  async getPublishedGuide(): Promise<VideoGuide | null> {
    try {
      const { data, error } = await supabase
        .from('video_guides')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (err) {
      console.error('Error fetching published video guide:', err)
      return null
    }
  },

  // Admin - get the current guide (whether published or draft)
  async getGuideAdmin(): Promise<VideoGuide | null> {
    try {
      const { data, error } = await supabase
        .from('video_guides')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (err) {
      console.error('Error fetching admin video guide:', err)
      return null
    }
  },

  // Admin - upload new guide
  async uploadGuide(
    file: File,
    title: string,
    description: string,
    adminId: string
  ): Promise<VideoGuide> {
    try {
      // 1. Upload to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `guides/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('video-guides')
        .upload(filePath, file, { upsert: false })

      if (uploadError) throw uploadError

      // 2. Fetch any existing guide to delete it later
      const existingGuide = await this.getGuideAdmin()

      // 3. Create db record
      const { data, error: dbError } = await supabase
        .from('video_guides')
        .insert({
          title,
          description,
          storage_path: filePath,
          is_published: false,
          created_by: adminId,
        })
        .select()
        .single()

      if (dbError) {
        // Rollback storage if db fails
        await supabase.storage.from('video-guides').remove([filePath])
        throw dbError
      }

      // 4. Delete old guide safely
      if (existingGuide) {
        await this.deleteGuide(existingGuide.id, existingGuide.storage_path)
      }

      return data
    } catch (err) {
      console.error('Error uploading video guide:', err)
      throw err
    }
  },

  // Admin - update metadata/publish status
  async updateGuide(
    id: string,
    updates: Partial<{ title: string; description: string; is_published: boolean }>
  ): Promise<VideoGuide> {
    try {
      const { data, error } = await supabase
        .from('video_guides')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error updating video guide:', err)
      throw err
    }
  },

  // Admin - delete guide entirely
  async deleteGuide(id: string, storagePath: string): Promise<void> {
    try {
      // Delete from db
      const { error: dbError } = await supabase
        .from('video_guides')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('video-guides')
        .remove([storagePath])

      if (storageError) {
        console.warn('Failed to delete video from storage (orphaned):', storageError)
      }
    } catch (err) {
      console.error('Error deleting video guide:', err)
      throw err
    }
  },

  // Helper to get public URL
  getPublicUrl(path: string): string {
    const { data } = supabase.storage.from('video-guides').getPublicUrl(path)
    return data.publicUrl
  },
}
