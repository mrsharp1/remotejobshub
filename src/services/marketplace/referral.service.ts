import { supabase } from '@/lib/supabase'
import { Referral, ReferralSettings } from '@/types'

export const referralService = {
  async validateReferralCode(code: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', code.toUpperCase())
        .maybeSingle()

      if (error) throw error
      return data ? data.id : null
    } catch (err) {
      console.error('Error in validateReferralCode:', err)
      return null
    }
  },

  async processRegistrationReferral(
    referredId: string,
    referralCode: string
  ): Promise<void> {
    try {
      if (!referralCode || !referralCode.trim()) return

      const { error } = await supabase.rpc('rpc_register_user_with_referral', {
        p_referred_id: referredId,
        p_referral_code: referralCode.trim(),
      })

      if (error) {
        console.error('RPC Error in processRegistrationReferral:', error)
      }
    } catch (err) {
      console.error('Error in processRegistrationReferral:', err)
    }
  },

  async getReferrals(referrerId: string): Promise<Referral[]> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*, referred:referred_id(*)')
        .eq('referrer_id', referrerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Referral[]
    } catch (err) {
      console.error('Error in getReferrals:', err)
      return []
    }
  },

  async getAllReferrals(): Promise<Referral[]> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*, referrer:referrer_id(*), referred:referred_id(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Referral[]
    } catch (err) {
      console.error('Error in getAllReferrals:', err)
      return []
    }
  },

  async getAdminSettings(): Promise<ReferralSettings> {
    const defaultSettings: ReferralSettings = {
      reward_amount: 1000,
      minimum_purchase_amount: 5000,
      is_enabled: true
    }
    
    try {
      const { data, error } = await supabase
        .from('referral_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error) throw error
      
      if (data) {
        return {
          reward_amount: data.reward_amount,
          minimum_purchase_amount: data.minimum_purchase_amount ?? 5000,
          is_enabled: data.is_enabled ?? true
        }
      }
      return defaultSettings
    } catch (err) {
      console.error('Error fetching admin referral settings:', err)
      return defaultSettings
    }
  },

  async updateAdminSettings(amount: number): Promise<void> {
    try {
      const { data, error: selectError } = await supabase
        .from('referral_settings')
        .select('id')
        .limit(1)
        .maybeSingle()

      if (selectError) throw selectError

      if (data) {
        const { error, data: updatedData } = await supabase
          .from('referral_settings')
          .update({ reward_amount: amount, updated_at: new Date().toISOString() })
          .eq('id', data.id)
          .select()
        if (error) throw error
        if (!updatedData || updatedData.length === 0) throw new Error("Permission denied. Could not save settings.")
      } else {
        const { error } = await supabase
          .from('referral_settings')
          .insert([{ reward_amount: amount }])
        if (error) throw error
      }
    } catch (err) {
      console.error('Error updating admin referral settings:', err)
      throw err
    }
  }
}
