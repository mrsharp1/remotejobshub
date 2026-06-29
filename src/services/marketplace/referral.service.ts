import { supabase } from '@/lib/supabase'
import { Referral, ReferralReward } from '@/types'
import { walletService } from '@/services/marketplace/wallet.service'
import { notificationService } from '@/services/marketplace/notification.service'

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

  async recordReferral(
    referrerId: string,
    referredId: string,
    referralCode: string
  ): Promise<Referral> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert([
          {
            referrer_id: referrerId,
            referred_id: referredId,
            referral_code: referralCode.toUpperCase(),
            status: 'pending',
            reward_amount: 1000.0, // ₦1,000 / $10
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data as Referral
    } catch (err) {
      console.error('Error in recordReferral:', err)
      throw err
    }
  },

  async recordSuccessfulPurchase(referredId: string): Promise<void> {
    try {
      // 1. Check if referral exists in pending status
      const { data: ref, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referred_id', referredId)
        .eq('status', 'pending')
        .maybeSingle()

      if (error) throw error
      if (!ref) return // No pending referral found

      // 2. Transition referral to qualified
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          status: 'qualified',
          first_purchase_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', ref.id)

      if (updateError) throw updateError

      // 3. Create referral reward log
      const { data: reward, error: rewardError } = await supabase
        .from('referral_rewards')
        .insert([
          {
            referral_id: ref.id,
            amount: ref.reward_amount,
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (rewardError) throw rewardError

      // 4. Automatically approve and credit referrer's wallet
      await this.approveReward(reward.id)
    } catch (err) {
      console.error('Error in recordSuccessfulPurchase:', err)
    }
  },

  async approveReward(rewardId: string): Promise<void> {
    try {
      // Fetch reward
      const { data: reward, error } = await supabase
        .from('referral_rewards')
        .select('*, referral:referrals(*)')
        .eq('id', rewardId)
        .single()

      if (error) throw error
      if (reward.status !== 'pending') return

      // Select targets
      const referral = reward.referral as unknown as Referral
      const referrerId = referral.referrer_id

      // Credit wallet
      const wallets = await walletService.getUserWallets(referrerId)
      if (wallets && wallets.length > 0) {
        const wallet = wallets[0]
        await walletService.adjustBalance(
          wallet.id,
          Number(reward.amount),
          `Referral Affiliate Reward: Qualified Sign-up Conversion`
        )
      }

      // Update reward status to approved
      await supabase
        .from('referral_rewards')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', rewardId)

      // Update referral status to paid
      await supabase
        .from('referrals')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', referral.id)

      // Dispatch notifications
      await notificationService.createNotification({
        user_id: referrerId,
        title: '🎉 Referral Bonus Credited!',
        message: `Your referral bonus of ₦${Number(reward.amount).toLocaleString()} has been credited to your available wallet balance.`,
        type: 'system',
        reference_type: 'order',
        reference_id: referral.id,
      })
    } catch (err) {
      console.error('Error in approveReward:', err)
      throw err
    }
  },

  async rejectReward(rewardId: string): Promise<void> {
    try {
      const { data: reward, error } = await supabase
        .from('referral_rewards')
        .select('*, referral:referrals(*)')
        .eq('id', rewardId)
        .single()

      if (error) throw error

      const referral = reward.referral as unknown as Referral

      // Update status
      await supabase
        .from('referral_rewards')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', rewardId)

      await supabase
        .from('referrals')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', referral.id)
    } catch (err) {
      console.error('Error in rejectReward:', err)
      throw err
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

  async getReferralRewards(userId: string): Promise<ReferralReward[]> {
    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*, referral:referrals(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).filter(
        (r: any) => r.referral?.referrer_id === userId
      ) as ReferralReward[]
    } catch (err) {
      console.error('Error in getReferralRewards:', err)
      return []
    }
  },

  async getAllReferralRewards(): Promise<ReferralReward[]> {
    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*, referral:referrals(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as ReferralReward[]
    } catch (err) {
      console.error('Error in getAllReferralRewards:', err)
      return []
    }
  },
}
