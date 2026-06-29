import { supabase } from '@/lib/supabase'
import {
  Broadcast,
  NotificationPreferences,
  SellerRevenueAgreement,
} from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const broadcastService = {
  async getBroadcasts(): Promise<Broadcast[]> {
    try {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Broadcast[]
    } catch (err) {
      console.error('Error in getBroadcasts:', err)
      return []
    }
  },

  async createBroadcast(
    title: string,
    message: string,
    audienceFilter:
      | 'everyone'
      | 'buyers'
      | 'sellers'
      | 'verified_sellers'
      | 'no_purchase'
      | 'active_orders'
      | 'completed_orders',
    imageUrl?: string | null,
    linkUrl?: string | null,
    scheduledAt?: string | null
  ): Promise<Broadcast> {
    try {
      // 1. Insert broadcast logs
      const { data: b, error } = await supabase
        .from('broadcasts')
        .insert([
          {
            title,
            message,
            audience_filter: audienceFilter,
            image_url: imageUrl,
            link_url: linkUrl,
            scheduled_at: scheduledAt,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // 2. Resolve audience profiles
      let query = supabase.from('profiles').select('id')

      if (audienceFilter === 'sellers') {
        query = query.eq('role', 'seller')
      } else if (audienceFilter === 'verified_sellers') {
        query = query.eq('role', 'seller').eq('seller_verified', true)
      } else if (audienceFilter === 'buyers') {
        query = query.eq('role', 'buyer')
      }

      const { data: profiles } = await query

      // 3. Dispatch targeted in-app notifications
      if (profiles && profiles.length > 0) {
        let sent = 0
        for (const p of profiles) {
          // Check user notification preferences first
          const prefs = await this.getNotificationPreferences(p.id)
          if (prefs && !prefs.announcements_enabled) continue

          await notificationService.createNotification({
            user_id: p.id,
            title: `📣 Announcement: ${title}`,
            message:
              message.slice(0, 100) + (message.length > 100 ? '...' : ''),
            type: 'system',
            reference_type: 'order', // placeholder
            reference_id: b.id,
          })
          sent++
        }

        // Update send statistics count
        await supabase
          .from('broadcasts')
          .update({ sent_count: sent, delivered_count: sent })
          .eq('id', b.id)
      }

      return b as Broadcast
    } catch (err) {
      console.error('Error in createBroadcast:', err)
      throw err
    }
  },

  async getNotificationPreferences(
    userId: string
  ): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data as NotificationPreferences
    } catch (err) {
      console.error('Error in getNotificationPreferences:', err)
      return null
    }
  },

  async updateNotificationPreferences(
    userId: string,
    prefs: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .update({
          ...prefs,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (error) throw error
    } catch (err) {
      console.error('Error in updateNotificationPreferences:', err)
      throw err
    }
  },

  async getSellerAgreement(
    userId: string
  ): Promise<SellerRevenueAgreement | null> {
    try {
      const { data, error } = await supabase
        .from('seller_revenue_agreements')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data as SellerRevenueAgreement
    } catch (err) {
      console.error('Error in getSellerAgreement:', err)
      return null
    }
  },

  async createSellerAgreement(
    userId: string,
    plan: 'OptionA' | 'OptionB'
  ): Promise<SellerRevenueAgreement> {
    try {
      const percentage = plan === 'OptionA' ? 30.0 : 20.0
      const bonusEligible = plan === 'OptionB'

      const { data, error } = await supabase
        .from('seller_revenue_agreements')
        .insert([
          {
            user_id: userId,
            revenue_plan: plan,
            percentage,
            bonus_eligible: bonusEligible,
            agreement_version: '1.0',
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data as SellerRevenueAgreement
    } catch (err) {
      console.error('Error in createSellerAgreement:', err)
      throw err
    }
  },
}
