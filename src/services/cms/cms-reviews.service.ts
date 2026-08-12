import { supabase } from '@/lib/supabase'

export interface CMSWrittenReview {
  id: string
  customerName: string
  country: string
  platformPurchased: string
  rating: number
  title: string
  body: string
  avatar: string
  verified: boolean
  isFeatured: boolean
  showOnHomepage: boolean
  showOnMarketplace: boolean
  showOnCommunity: boolean
  showOnAbout: boolean
  showOnSellerProfile: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CMSVideoTestimonial {
  id: string
  videoUrl: string
  thumbnail: string
  customerName: string
  country: string
  rating: number
  summary: string
  duration: string
  displayOrder: number
  isFeatured: boolean
  showOnHomepage: boolean
  showOnMarketplace: boolean
  showOnCommunity: boolean
  showOnAbout: boolean
  showOnSellerProfile: boolean
  createdAt?: string
  updatedAt?: string
}

// Helper to map camelCase models to snake_case DB format
const mapToWrittenDB = (review: Partial<CMSWrittenReview>) => {
  const dbData: any = {}
  if (review.id !== undefined) dbData.id = review.id
  if (review.customerName !== undefined) dbData.customer_name = review.customerName
  if (review.country !== undefined) dbData.country = review.country
  if (review.platformPurchased !== undefined) dbData.platform_purchased = review.platformPurchased
  if (review.rating !== undefined) dbData.rating = review.rating
  if (review.title !== undefined) dbData.title = review.title
  if (review.body !== undefined) dbData.body = review.body
  if (review.avatar !== undefined) dbData.avatar = review.avatar
  if (review.verified !== undefined) dbData.verified = review.verified
  if (review.isFeatured !== undefined) dbData.is_featured = review.isFeatured
  if (review.showOnHomepage !== undefined) dbData.show_on_homepage = review.showOnHomepage
  if (review.showOnMarketplace !== undefined) dbData.show_on_marketplace = review.showOnMarketplace
  if (review.showOnCommunity !== undefined) dbData.show_on_community = review.showOnCommunity
  if (review.showOnAbout !== undefined) dbData.show_on_about = review.showOnAbout
  if (review.showOnSellerProfile !== undefined) dbData.show_on_seller_profile = review.showOnSellerProfile
  return dbData
}

const mapFromWrittenDB = (data: any): CMSWrittenReview => ({
  id: data.id,
  customerName: data.customer_name,
  country: data.country,
  platformPurchased: data.platform_purchased,
  rating: data.rating,
  title: data.title,
  body: data.body,
  avatar: data.avatar,
  verified: data.verified,
  isFeatured: data.is_featured,
  showOnHomepage: data.show_on_homepage,
  showOnMarketplace: data.show_on_marketplace,
  showOnCommunity: data.show_on_community,
  showOnAbout: data.show_on_about,
  showOnSellerProfile: data.show_on_seller_profile,
  createdAt: data.created_at,
  updatedAt: data.updated_at
})

const mapToVideoDB = (video: Partial<CMSVideoTestimonial>) => {
  const dbData: any = {}
  if (video.id !== undefined) dbData.id = video.id
  if (video.videoUrl !== undefined) dbData.video_url = video.videoUrl
  if (video.thumbnail !== undefined) dbData.thumbnail = video.thumbnail
  if (video.customerName !== undefined) dbData.customer_name = video.customerName
  if (video.country !== undefined) dbData.country = video.country
  if (video.rating !== undefined) dbData.rating = video.rating
  if (video.summary !== undefined) dbData.summary = video.summary
  if (video.duration !== undefined) dbData.duration = video.duration
  if (video.displayOrder !== undefined) dbData.display_order = video.displayOrder
  if (video.isFeatured !== undefined) dbData.is_featured = video.isFeatured
  if (video.showOnHomepage !== undefined) dbData.show_on_homepage = video.showOnHomepage
  if (video.showOnMarketplace !== undefined) dbData.show_on_marketplace = video.showOnMarketplace
  if (video.showOnCommunity !== undefined) dbData.show_on_community = video.showOnCommunity
  if (video.showOnAbout !== undefined) dbData.show_on_about = video.showOnAbout
  if (video.showOnSellerProfile !== undefined) dbData.show_on_seller_profile = video.showOnSellerProfile
  return dbData
}

const mapFromVideoDB = (data: any): CMSVideoTestimonial => ({
  id: data.id,
  videoUrl: data.video_url,
  thumbnail: data.thumbnail,
  customerName: data.customer_name,
  country: data.country,
  rating: data.rating,
  summary: data.summary,
  duration: data.duration,
  displayOrder: data.display_order,
  isFeatured: data.is_featured,
  showOnHomepage: data.show_on_homepage,
  showOnMarketplace: data.show_on_marketplace,
  showOnCommunity: data.show_on_community,
  showOnAbout: data.show_on_about,
  showOnSellerProfile: data.show_on_seller_profile,
  createdAt: data.created_at,
  updatedAt: data.updated_at
})

export const cmsReviewsService = {
  // Written Reviews
  async getWrittenReviews(): Promise<CMSWrittenReview[]> {
    const { data, error } = await supabase
      .from('cms_written_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error('Error fetching written reviews:', error)
      return []
    }
    
    return data.map(mapFromWrittenDB)
  },

  async createWrittenReview(review: Omit<CMSWrittenReview, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('cms_written_reviews')
      .insert([mapToWrittenDB(review)])
      .select()
      .single()
      
    if (error) throw error
    return mapFromWrittenDB(data)
  },

  async updateWrittenReview(id: string, review: Partial<CMSWrittenReview>) {
    const { data, error } = await supabase
      .from('cms_written_reviews')
      .update(mapToWrittenDB(review))
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw error
    return mapFromWrittenDB(data)
  },

  async deleteWrittenReview(id: string) {
    const { error } = await supabase
      .from('cms_written_reviews')
      .delete()
      .eq('id', id)
      
    if (error) throw error
  },

  // Video Testimonials
  async getVideoTestimonials(): Promise<CMSVideoTestimonial[]> {
    const { data, error } = await supabase
      .from('cms_video_testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      
    if (error) {
      console.error('Error fetching video testimonials:', error)
      return []
    }
    
    return data.map(mapFromVideoDB)
  },

  async createVideoTestimonial(video: Omit<CMSVideoTestimonial, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('cms_video_testimonials')
      .insert([mapToVideoDB(video)])
      .select()
      .single()
      
    if (error) throw error
    return mapFromVideoDB(data)
  },

  async updateVideoTestimonial(id: string, video: Partial<CMSVideoTestimonial>) {
    const { data, error } = await supabase
      .from('cms_video_testimonials')
      .update(mapToVideoDB(video))
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw error
    return mapFromVideoDB(data)
  },

  async deleteVideoTestimonial(id: string) {
    const { error } = await supabase
      .from('cms_video_testimonials')
      .delete()
      .eq('id', id)
      
    if (error) throw error
  }
}
