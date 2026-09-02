import { supabase } from '@/lib/supabase'
import { Listing } from '@/types'
export const listingService = {
  async createListing(
    listingData: Omit<
      Listing,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'views'
      | 'favorites_count'
      | 'is_featured'
      | 'approval_status'
      | 'status'
    > & { status?: string },
    images?: string[],
    tags?: string[]
  ): Promise<Listing> {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .insert([
          {
            ...listingData,
            status: listingData.status || 'draft',
            approval_status: 'pending',
            views: 0,
            favorites_count: 0,
            is_featured: false,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('LISTING INSERT ERROR:', error)
        alert(JSON.stringify(error, null, 2))
        throw error
      }

      if (images && images.length > 0) {
        const imageData = images.map((url, idx) => ({
          listing_id: listing.id,
          image_url: url,
          display_order: idx,
        }))
        const { error: imgError } = await supabase
          .from('listing_images')
          .insert(imageData)
        if (imgError) throw imgError
      }

      if (tags && tags.length > 0) {
        const tagData = tags.map((t) => ({
          listing_id: listing.id,
          tag: t,
        }))
        const { error: tagError } = await supabase
          .from('listing_tags')
          .insert(tagData)
        if (tagError) throw tagError
      }

      return listing as Listing
    } catch (err) {
      console.error('Error in createListing:', err)
      throw err
    }
  },

  async updateListing(
    id: string,
    listingData: Partial<Listing>,
    images?: string[],
    tags?: string[]
  ): Promise<Listing> {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .update(listingData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      if (images !== undefined) {
        const { error: imgDelError } = await supabase
          .from('listing_images')
          .delete()
          .eq('listing_id', id)
        if (imgDelError) throw imgDelError

        if (images.length > 0) {
          const imageData = images.map((url, idx) => ({
            listing_id: id,
            image_url: url,
            display_order: idx,
          }))
          const { error: imgError } = await supabase
            .from('listing_images')
            .insert(imageData)
          if (imgError) throw imgError
        }
      }

      if (tags !== undefined) {
        const { error: tagDelError } = await supabase
          .from('listing_tags')
          .delete()
          .eq('listing_id', id)
        if (tagDelError) throw tagDelError

        if (tags.length > 0) {
          const tagData = tags.map((t) => ({
            listing_id: id,
            tag: t,
          }))
          const { error: tagError } = await supabase
            .from('listing_tags')
            .insert(tagData)
          if (tagError) throw tagError
        }
      }

      return listing as Listing
    } catch (err) {
      console.error('Error in updateListing:', err)
      throw err
    }
  },

  async deleteListing(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Error in deleteListing:', err)
      throw err
    }
  },

  async getListing(id: string): Promise<Listing | null> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(
          'id, seller_id, title, platform, country, account_age, monthly_income, price, description, reason_for_sale, status, approval_status, views, favorites_count, is_featured, created_at, updated_at, original_email_included, recovery_email_included, phone_included, identity_verified, approved_at, approved_by, images:listing_images(*), tags:listing_tags(*), seller:profiles!listings_seller_id_fkey(*)'
        )
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error in getListing:', error.message)
        return null
      }
      return data as unknown as Listing
    } catch (err) {
      console.error('Error in getListing:', err)
      return null
    }
  },

  async getListings(filters?: {
    platform?: string
    country?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<Listing[]> {
    try {
      let query = supabase
        .from('listings')
        .select(
          'id, seller_id, title, platform, country, account_age, monthly_income, price, description, reason_for_sale, status, approval_status, views, favorites_count, is_featured, created_at, updated_at, original_email_included, recovery_email_included, phone_included, identity_verified, approved_at, approved_by, images:listing_images(*), tags:listing_tags(*), seller:profiles!listings_seller_id_fkey(*)'
        )
        .eq('approval_status', 'approved')
        .eq('status', 'published')

      if (filters?.platform) {
        query = query.eq('platform', filters.platform)
      }
      if (filters?.country) {
        query = query.eq('country', filters.country)
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      })
      if (error) throw error
      return (data || []) as unknown as Listing[]
    } catch (err) {
      console.error('Error in getListings:', err)
      return []
    }
  },

  async getSellerListings(sellerId: string): Promise<Listing[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, images:listing_images(*), tags:listing_tags(*)')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Listing[]
    } catch (err) {
      console.error('Error in getSellerListings:', err)
      return []
    }
  },

  async toggleFavorite(userId: string, listingId: string): Promise<boolean> {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('listing_id', listingId)
        .maybeSingle()

      if (checkError) throw checkError

      if (existing) {
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId)
        if (deleteError) throw deleteError

        // Safely decrement local favorites count
        const { data: listing } = await supabase
          .from('listings')
          .select('favorites_count')
          .eq('id', listingId)
          .single()

        if (listing) {
          await supabase
            .from('listings')
            .update({
              favorites_count: Math.max(0, (listing.favorites_count || 0) - 1),
            })
            .eq('id', listingId)
        }

        return false
      } else {
        const { error: insertError } = await supabase
          .from('favorites')
          .insert([{ user_id: userId, listing_id: listingId }])
        if (insertError) throw insertError

        // Safely increment local favorites count
        const { data: listing } = await supabase
          .from('listings')
          .select('favorites_count')
          .eq('id', listingId)
          .single()

        if (listing) {
          await supabase
            .from('listings')
            .update({
              favorites_count: (listing.favorites_count || 0) + 1,
            })
            .eq('id', listingId)
        }

        return true
      }
    } catch (err) {
      console.error('Error in toggleFavorite:', err)
      throw err
    }
  },

  async incrementViews(id: string): Promise<void> {
    try {
      const { data: listing } = await supabase
        .from('listings')
        .select('views')
        .eq('id', id)
        .single()

      if (listing) {
        await supabase
          .from('listings')
          .update({ views: (listing.views || 0) + 1 })
          .eq('id', id)
      }
    } catch (err) {
      console.error('Error in incrementViews:', err)
    }
  },

  async approveListing(id: string, adminId: string): Promise<void> {
    const { error } = await supabase
      .from('listings')
      .update({
        approval_status: 'approved',
        status: 'published',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('APPROVE LISTING ERROR:', error)
      alert(JSON.stringify(error, null, 2))
      throw error
    }
  },

  // New method: rejectListing
  async rejectListing(
    id: string,
    notes: string,
    adminId: string
  ): Promise<void> {
    try {
      // Log notes for audit purposes; could be stored in a notes column/table later
      console.log('Reject notes:', notes);
      const { error } = await supabase
        .from('listings')
        .update({
          approval_status: 'rejected',
          status: 'draft',
          approved_by: adminId,
          // notes: notes, // column not present in schema currently
        })
        .eq('id', id);
      if (error) throw error;
      // TODO: Notify seller about rejection (e.g., via notifications table)
    } catch (err) {
      console.error('Error in rejectListing:', err);
      throw err;
    }
  },

  async requestListingChanges(
    id: string,
    notes: string,
    adminId: string
  ): Promise<void> {
    try {
      console.log('Request notes:', notes);
      const { error } = await supabase
        .from('listings')
        .update({
          approval_status: 'pending',
          status: 'draft',
          approved_by: adminId,
          // notes: notes,
        })
        .eq('id', id);
      if (error) throw error;
      // Notify seller about requested changes
    } catch (err) {
      console.error('Error in requestListingChanges:', err);
      throw err;
    }
  },

  async featureListing(
    id: string,
    isFeatured: boolean,
    featuredUntil?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          is_featured: isFeatured,
          featured_until: featuredUntil || null,
        })
        .eq('id', id);
      if (error) throw error;
      // Notify seller
    } catch (err) {
      console.error('Error in featureListing:', err);
      throw err;
    }
  },

  async archiveListing(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          status: 'archived',
        })
        .eq('id', id);
      if (error) throw error;
      // Notify seller
    } catch (err) {
      console.error('Error in archiveListing:', err);
      throw err;
    }
  },

}
