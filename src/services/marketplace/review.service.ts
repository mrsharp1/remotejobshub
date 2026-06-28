import { supabase } from '@/lib/supabase'
import { Review, SellerRating, Profile } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const reviewService = {
  async createReview(reviewData: {
    order_id: string
    listing_id: string
    seller_id: string
    buyer_id: string
    rating: number
    title: string
    review: string
    would_recommend: boolean
  }): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single()

      if (error) throw error

      // Notify Seller
      await notificationService.createNotification({
        user_id: reviewData.seller_id,
        title: 'New Review Received ⭐',
        message: `A buyer left a ${reviewData.rating}-star review on your listing.`,
        type: 'system',
        reference_type: 'order',
        reference_id: reviewData.order_id,
      })

      // Notify Buyer
      await notificationService.createNotification({
        user_id: reviewData.buyer_id,
        title: 'Review Published 🎉',
        message: `Your review has been successfully posted. Thank you for your feedback!`,
        type: 'system',
        reference_type: 'order',
        reference_id: reviewData.order_id,
      })

      return data as Review
    } catch (err) {
      console.error('Error in createReview:', err)
      throw err
    }
  },

  async updateReview(
    id: string,
    updateData: {
      rating?: number
      title?: string
      review?: string
      would_recommend?: boolean
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error in updateReview:', err)
      throw err
    }
  },

  async replyToReview(id: string, sellerReply: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          seller_reply: sellerReply,
          seller_reply_date: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error in replyToReview:', err)
      throw err
    }
  },

  async hideReview(id: string, adminHidden: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ admin_hidden: adminHidden })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error in hideReview:', err)
      throw err
    }
  },

  async deleteReview(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Error in deleteReview:', err)
      throw err
    }
  },

  async getListingReviews(listingId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, buyer_profile:profiles!reviews_buyer_id_fkey(*)')
        .eq('listing_id', listingId)
        .eq('admin_hidden', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Review[]
    } catch (err) {
      console.error('Error in getListingReviews:', err)
      return []
    }
  },

  async getSellerReviews(sellerId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(
          '*, buyer_profile:profiles!reviews_buyer_id_fkey(*), listing:listings(*)'
        )
        .eq('seller_id', sellerId)
        .eq('admin_hidden', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Review[]
    } catch (err) {
      console.error('Error in getSellerReviews:', err)
      return []
    }
  },

  async getSellerRating(sellerId: string): Promise<SellerRating> {
    try {
      // 1. Fetch all reviews for this seller
      const { data: reviews = [] } = await supabase
        .from('reviews')
        .select('rating, buyer_id')
        .eq('seller_id', sellerId)
        .eq('admin_hidden', false)

      const reviewList = reviews || []
      const totalReviews = reviewList.length

      // 2. Fetch completed orders count
      const { data: orders = [] } = await supabase
        .from('orders')
        .select('id, buyer_id')
        .eq('seller_id', sellerId)
        .eq('status', 'completed')

      const completedOrders = orders ? orders.length : 0

      // 3. Fetch Seller verification badge parameter
      const { data: profile } = await supabase
        .from('profiles')
        .select('verified')
        .eq('id', sellerId)
        .single()

      const isVerified = profile?.verified || false

      // Calculate averages and ratios
      const averageRating =
        totalReviews > 0
          ? Number(
              (
                reviewList.reduce((acc, r) => acc + r.rating, 0) / totalReviews
              ).toFixed(1)
            )
          : 5.0

      const fiveStarCount = reviewList.filter((r) => r.rating === 5).length
      const fiveStarPercentage =
        totalReviews > 0
          ? Math.round((fiveStarCount / totalReviews) * 100)
          : 100

      // Calculate repeat buyers
      const buyerCounts: Record<string, number> = {}
      if (orders) {
        orders.forEach((o) => {
          buyerCounts[o.buyer_id] = (buyerCounts[o.buyer_id] || 0) + 1
        })
      }
      const repeatBuyers = Object.values(buyerCounts).filter(
        (c) => c > 1
      ).length

      // Calculate Trust Score (0-100)
      const baseTrust = (averageRating / 5) * 60 // Max 60 points from ratings
      const verifiedBonus = isVerified ? 20 : 0 // 20 points for verification
      const salesBonus = Math.min(completedOrders * 2, 20) // Max 20 points from completed orders count
      const trustScore = Math.round(baseTrust + verifiedBonus + salesBonus)

      return {
        average_rating: averageRating,
        total_reviews: totalReviews,
        five_star_percentage: fiveStarPercentage,
        repeat_buyers: repeatBuyers,
        response_rate: 98, // simulate
        completed_orders: completedOrders,
        is_verified_seller: isVerified,
        trust_score: Math.min(trustScore, 100),
      }
    } catch (err) {
      console.error('Error in getSellerRating:', err)
      return {
        average_rating: 5.0,
        total_reviews: 0,
        five_star_percentage: 100,
        repeat_buyers: 0,
        response_rate: 100,
        completed_orders: 0,
        is_verified_seller: false,
        trust_score: 80,
      }
    }
  },

  async getTopRatedSellers(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'seller')
        .limit(10)

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error in getTopRatedSellers:', err)
      return []
    }
  },
}
