import { supabase } from '@/lib/supabase'
import { Promotion, Coupon, CouponRedemption } from '@/types'

export const promotionService = {
  async getPromotions(): Promise<Promotion[]> {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Promotion[]
    } catch (err) {
      console.error('Error fetching promotions:', err)
      return []
    }
  },
  async purchasePromotion(listingId: string, days: number): Promise<void> {
    try {
      const idempotencyKey = `PROM-${listingId}-${Date.now()}`

      const { data, error } = await supabase.rpc('rpc_purchase_promotion', {
        p_listing_id: listingId,
        p_days: days,
        p_idempotency_key: idempotencyKey,
      })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error('Error purchasing promotion:', err)
      throw err
    }
  },

  async createPromotion(
    promo: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Promotion> {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([promo])
        .select()
        .single()

      if (error) {
        console.error('EXACT PROMOTION ERROR:', JSON.stringify(error, null, 2))
        throw error
      }
      return data as Promotion
    } catch (err: any) {
      console.error('Error creating promotion:', err)
      throw err
    }
  },

  async updatePromotion(id: string, fields: Partial<Promotion>): Promise<void> {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error updating promotion:', err)
      throw err
    }
  },

  async deletePromotion(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting promotion:', err)
      throw err
    }
  },

  async getCoupons(): Promise<Coupon[]> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Coupon[]
    } catch (err) {
      console.error('Error fetching coupons:', err)
      return []
    }
  },

  async createCoupon(
    coupon: Omit<Coupon, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Coupon> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([coupon])
        .select()
        .single()

      if (error) {
        console.error('EXACT COUPON ERROR:', JSON.stringify(error, null, 2))
        if (error.code === '23505') {
          throw new Error('A coupon with this code already exists.')
        }
        throw error
      }
      return data as Coupon
    } catch (err: any) {
      console.error('Error creating coupon:', err)
      throw err
    }
  },

  async deleteCoupon(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting coupon:', err)
      throw err
    }
  },

  async validateCoupon(code: string, buyerId: string): Promise<Coupon> {
    try {
      // 1. Fetch active coupon
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle()

      if (error) throw error
      if (!coupon) throw new Error('Invalid or inactive coupon code.')

      if (coupon.discount_type !== 'fixed') {
        throw new Error('This coupon is reserved for future order-level checkout and cannot be added as wallet credit.')
      }

      // 2. Check dates
      const now = new Date()
      if (now > new Date(coupon.expires_at)) {
        throw new Error('Coupon has expired.')
      }

      // 3. Check remaining uses limits
      if (coupon.usage_limit !== null && coupon.usage_count <= 0) {
        throw new Error('Coupon usage limit reached.')
      }

      // 4. Verify user hasn't already redeemed it
      const { data: previous } = await supabase
        .from('coupon_redemptions')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', buyerId)
        .maybeSingle()

      if (previous) {
        throw new Error('You have already redeemed this coupon code.')
      }

      return coupon as Coupon
    } catch (err) {
      console.error('Error validating coupon:', err)
      throw err
    }
  },

  async redeemCouponToWallet(code: string): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('rpc_redeem_coupon_to_wallet', {
        p_coupon_code: code,
      })
      if (error) throw error
      if (!data.success) {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error('Error redeeming coupon:', err)
      throw err
    }
  },

  async getRedemptions(buyerId: string): Promise<CouponRedemption[]> {
    try {
      const { data, error } = await supabase
        .from('coupon_redemptions')
        .select('*, coupon:coupon_id(*)')
        .eq('user_id', buyerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as CouponRedemption[]
    } catch (err) {
      console.error('Error fetching buyer coupon redemptions:', err)
      return []
    }
  },

  async getAllRedemptions(): Promise<CouponRedemption[]> {
    try {
      const { data, error } = await supabase
        .from('coupon_redemptions')
        .select('*, coupon:coupon_id(*), buyer:user_id(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as CouponRedemption[]
    } catch (err) {
      console.error('Error fetching all coupon redemptions:', err)
      return []
    }
  },

  async deactivateExpiredPromotions(): Promise<void> {
    try {
      const now = new Date().toISOString()
      // Deactivate coupons
      await supabase
        .from('coupons')
        .update({ is_active: false })
        .lt('expires_at', now)

      // Deactivate promotions
      await supabase
        .from('promotions')
        .update({ is_active: false })
        .lt('expires_at', now)
    } catch (err) {
      console.error('Error in automatic expiration routine:', err)
    }
  },
}
