import { supabase } from '@/lib/supabase'
import {
  Broadcast,
  NotificationPreferences,
  SellerRevenueAgreement,
} from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const broadcastService = {
  async getBroadcasts(): Promise<Broadcast[]> {
    // The broadcasts table is obsolete in Phase 4W canonical notification architecture.
    return []
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
    scheduledAt?: string | null,
    category?: string | null,
    priority?: 'critical' | 'important' | 'informational' | 'promotional' | null
  ): Promise<Broadcast> {
    try {
      console.log('ADMIN BROADCAST STARTED')
      console.log(`Audience: ${audienceFilter}`)

      // 1. Resolve audience profiles
      let query = supabase.from('profiles').select('id')

      if (audienceFilter === 'sellers') {
        query = query.eq('role', 'seller')
      } else if (audienceFilter === 'verified_sellers') {
        query = query.eq('role', 'seller').eq('seller_verified', true)
      } else if (audienceFilter === 'buyers') {
        query = query.eq('role', 'buyer')
      }

      const { data: profiles, error: profileError } = await query
      if (profileError) {
        console.error('Supabase profile query error:', profileError)
        throw profileError
      }

      console.log(`Resolved seller count: ${profiles?.length || 0}`)
      console.log(`Resolved seller IDs:`, profiles?.map(p => p.id))

      // 2. Dispatch targeted in-app notifications
      if (profiles && profiles.length > 0) {
        for (const p of profiles) {
          // Check user notification preferences first
          const prefs = await this.getNotificationPreferences(p.id)
          if (prefs && !prefs.announcements_enabled) {
            console.log(`Skipping notification for seller: ${p.id} (announcements disabled)`)
            continue
          }

          const notificationPayload = {
            user_id: p.id,
            title: title,
            message: message.slice(0, 150) + (message.length > 150 ? '...' : ''),
            type: 'system',
            category: category || 'announcements',
            priority: priority || 'informational',
            target_url: linkUrl,
            reference_type: 'broadcast',
            reference_id: null,
          }

          console.log(`Notification payload:`, notificationPayload)
          console.log(`Attempting notification insert for seller: ${p.id}`)

          try {
            await notificationService.createNotification(notificationPayload)
            console.log(`Supabase insert result: SUCCESS for seller: ${p.id}`)
          } catch (insertError: any) {
            console.log(`Supabase insert result: ERROR for seller: ${p.id}`)
            console.error('EXACT Supabase error:', {
              message: insertError?.message,
              code: insertError?.code,
              details: insertError?.details,
              hint: insertError?.hint
            })
            throw insertError
          }
        }
      }

      // 3. Return dummy broadcast log to satisfy frontend state (since broadcasts table is obsolete)
      return {
        id: 'legacy-broadcast',
        title,
        message,
        audience_filter: audienceFilter,
        image_url: imageUrl,
        link_url: linkUrl,
        scheduled_at: scheduledAt || null,
        sent_count: profiles?.length || 0,
        delivered_count: profiles?.length || 0,
        read_count: 0,
        created_at: new Date().toISOString()
      } as Broadcast
    } catch (err: any) {
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
