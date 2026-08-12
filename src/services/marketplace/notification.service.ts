import { supabase } from '@/lib/supabase'
import { Notification } from '@/types'

export const notificationService = {
  async createNotification(data: {
    user_id: string
    title: string
    message: string
    type: string
    category?: string | null
    priority?: 'critical' | 'important' | 'informational' | 'promotional' | null
    target_url?: string | null
    link?: string | null
    metadata?: Record<string, any> | null
    reference_type?: string | null
    reference_id?: string | null
  }): Promise<Notification> {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: data.user_id,
            title: data.title,
            message: data.message,
            type: data.type,
            category: data.category || null,
            priority: data.priority || null,
            target_url: data.target_url || data.link || null,
            link: data.link || data.target_url || null,
            metadata: data.metadata || null,
            reference_type: data.reference_type || null,
            reference_id: data.reference_id || null,
            is_read: false,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return notification as Notification
    } catch (err) {
      console.error('Error in createNotification:', err)
      throw err
    }
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Notification[]
    } catch (err) {
      console.error('Error in getNotifications:', err)
      return []
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error
    } catch (err) {
      console.error('Error in markAsRead:', err)
      throw err
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
    } catch (err) {
      console.error('Error in markAllAsRead:', err)
      throw err
    }
  },

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
    } catch (err) {
      console.error('Error in deleteNotification:', err)
      throw err
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
      return count || 0
    } catch (err) {
      console.error('Error in getUnreadCount:', err)
      return 0
    }
  },
}
export default notificationService
