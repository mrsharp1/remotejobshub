import { supabase } from '@/lib/supabase'
import { conversationService } from './conversation.service'

export const adminService = {
  async getUsers(searchQuery?: string, roleFilter?: string, sortBy?: string): Promise<any[]> {
    try {
      let query = supabase.from('profiles').select('*')

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,country.ilike.%${searchQuery}%`)
      }

      if (roleFilter && roleFilter !== 'all') {
        if (roleFilter === 'verified_seller') {
          query = query.eq('role', 'seller').eq('is_verified_seller', true)
        } else if (roleFilter === 'online') {
          query = query.eq('online', true)
        } else if (roleFilter === 'offline') {
          query = query.eq('online', false)
        } else {
          query = query.eq('role', roleFilter)
        }
      }

      if (sortBy) {
        if (sortBy === 'newest') query = query.order('created_at', { ascending: false })
        if (sortBy === 'oldest') query = query.order('created_at', { ascending: true })
        if (sortBy === 'alphabetical') query = query.order('full_name', { ascending: true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching users for admin directory:', err)
      return []
    }
  },

  async messageUser(adminId: string, userId: string): Promise<any> {
    return conversationService.createConversation('support', null, adminId, userId)
  },

  async broadcast(_message: string): Promise<void> {
    // stub
  },

  async assignConversation(_conversationId: string, _adminId: string): Promise<void> {
    // stub
  },

  async lockConversation(_conversationId: string): Promise<void> {
    // stub
  }
}
