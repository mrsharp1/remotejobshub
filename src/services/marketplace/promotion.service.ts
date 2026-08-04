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

      if (error) throw error
      return data as Promotion
    } catch (err) {
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

      if (error) throw error
      return data as Coupon
    } catch (err) {
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
        .eq('active', true)
        .maybeSingle()

      if (error) throw error
      if (!coupon) throw new Error('Invalid or inactive coupon code.')

      // 2. Check dates
      const now = new Date()
      if (
        now < new Date(coupon.start_date) ||
        now > new Date(coupon.end_date)
      ) {
        throw new Error('Coupon has expired or is not yet active.')
      }

      // 3. Check remaining uses limits
      if (coupon.usage_limit !== null && coupon.remaining_uses <= 0) {
        throw new Error('Coupon usage limit reached.')
      }

      // 4. Verify user hasn't already redeemed it
      const { data: previous } = await supabase
        .from('coupon_redemptions')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('buyer_id', buyerId)
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

  async applyDiscount(
    couponId: string,
    buyerId: string,
    orderId: string | null,
    discountApplied: number
  ): Promise<void> {
    try {
      // 1. Insert redemption log
      const { error: insErr } = await supabase
        .from('coupon_redemptions')
        .insert([
          {
            coupon_id: couponId,
            buyer_id: buyerId,
            order_id: orderId,
            discount_applied: discountApplied,
          },
        ])

      if (insErr) throw insErr

      // 2. Decrement remaining uses limit
      const { data: coupon } = await supabase
        .from('coupons')
        .select('remaining_uses, usage_limit')
        .eq('id', couponId)
        .single()

      if (coupon && coupon.usage_limit !== null) {
        await supabase
          .from('coupons')
          .update({
            remaining_uses: Math.max(0, coupon.remaining_uses - 1),
            updated_at: new Date().toISOString(),
          })
          .eq('id', couponId)
      }
    } catch (err) {
      console.error('Error applying coupon discount:', err)
      throw err
    }
  },

  async getRedemptions(buyerId: string): Promise<CouponRedemption[]> {
    try {
      const { data, error } = await supabase
        .from('coupon_redemptions')
        .select('*, coupon:coupon_id(*)')
        .eq('buyer_id', buyerId)
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
        .select('*, coupon:coupon_id(*), buyer:buyer_id(*)')
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
        .update({ active: false })
        .lt('end_date', now)

      // Deactivate promotions
      await supabase
        .from('promotions')
        .update({ active: false })
        .lt('end_date', now)
    } catch (err) {
      console.error('Error in automatic expiration routine:', err)
    }
  },
}
