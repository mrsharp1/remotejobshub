import { supabase } from '@/lib/supabase'

export interface CMSRevision {
  id: string
  entity_type: string
  entity_id: string
  snapshot: any
  restored_from: string | null
  created_at: string
}

export interface CMSAuditLog {
  id: string
  entity_table: string
  entity_id: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'MODERATE'
  previous_value: any
  new_value: any
  user_id: string
  created_at: string
}

export interface CMSPolicy {
  id: string
  slug: string
  title: string
  content: string
  status: 'draft' | 'published' | 'archived'
  version: string
  published_at: string | null
}

export interface CMSTestimonial {
  id: string
  author_name: string
  author_role: string | null
  author_avatar_url: string | null
  content: string
  rating: number
  video_url: string | null
  is_verified_buyer: boolean
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  sort_order: number
}

export interface CMSSuccessStory {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image_url: string | null
  video_url: string | null
  seller_name: string
  country: string | null
  income_generated: number | null
  timeline_months: number | null
  tags: string[]
  is_featured: boolean
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
}

export interface HomepageStat {
  id: string
  label: string
  manual_value: string | null
  auto_metric_key: string | null
  mode: 'manual' | 'auto'
  icon_name: string | null
  sort_order: number
  is_visible: boolean
}

export const cmsProService = {
  // === Audit Logging ===
  logAction: async (
    entity_table: string, 
    entity_id: string, 
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'MODERATE', 
    previous_value?: any, 
    new_value?: any
  ): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase.from('cms_audit_log').insert({
      entity_table,
      entity_id,
      action,
      previous_value: previous_value || null,
      new_value: new_value || null,
      user_id: session.user.id
    })
    
    if (error) console.error('Failed to write to audit log:', error)
  },

  // === Revisions ===
  createRevision: async (entity_type: string, entity_id: string, snapshot: any): Promise<void> => {
    const { error } = await supabase.from('cms_revisions').insert({ entity_type, entity_id, snapshot })
    if (error) throw error
  },

  getRevisions: async (entity_type: string, entity_id: string): Promise<CMSRevision[]> => {
    const { data, error } = await supabase
      .from('cms_revisions')
      .select('*')
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  // === Policies ===
  getPolicies: async (): Promise<CMSPolicy[]> => {
    const { data, error } = await supabase.from('cms_policies').select('*').order('title')
    if (error) throw error
    return data || []
  },
  
  getPolicyBySlug: async (slug: string): Promise<CMSPolicy | null> => {
    const { data, error } = await supabase.from('cms_policies').select('*').eq('slug', slug).eq('status', 'published').maybeSingle()
    if (error) throw error
    return data
  },

  // === Testimonials ===
  getTestimonials: async (onlyPublished = false): Promise<CMSTestimonial[]> => {
    let query = supabase.from('cms_testimonials').select('*').order('sort_order', { ascending: true })
    if (onlyPublished) query = query.eq('status', 'published')
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // === Success Stories ===
  getSuccessStories: async (onlyPublished = false): Promise<CMSSuccessStory[]> => {
    let query = supabase.from('cms_success_stories').select('*').order('created_at', { ascending: false })
    if (onlyPublished) query = query.eq('status', 'published')
    
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  // === Homepage Stats ===
  getHomepageStats: async (): Promise<HomepageStat[]> => {
    const { data, error } = await supabase.from('homepage_stats').select('*').order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  // === NEW MOCK ENDPOINTS FOR IMPLEMENTATION 052 ===
  // These return mock data until the backend schema is updated to support these exact granular fields.
  
  getHomepageVideos: async (): Promise<any[]> => {
    return [
      {
        id: 'vid_1',
        title: 'The Escrow Process Explained',
        description: 'Watch how we secure your funds.',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', // demo mp4
        thumbnail_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800',
        author_name: 'Michael Chen',
        author_role: 'Agency Owner',
        is_featured: true,
        sort_order: 1,
      },
      {
        id: 'vid_2',
        title: 'Skip the Grind',
        description: 'Hear from a successful freelancer.',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
        author_name: 'Sarah Jenkins',
        author_role: 'Freelancer',
        is_featured: true,
        sort_order: 2,
      },
      {
        id: 'vid_3',
        title: 'Secure Account Transfer',
        description: 'Our guaranteed 24-hour transfer.',
        video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail_url: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=800',
        author_name: 'David Okafor',
        author_role: 'Consultant',
        is_featured: true,
        sort_order: 3,
      }
    ]
  },

  getHomepageReviews: async (): Promise<any[]> => {
    return [
      {
        id: 'rev_1',
        customer_name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        country: 'US',
        rating: 5,
        is_verified_buyer: true,
        review_text: 'The AI Scam Detection flagged an issue before I even made payment. Saved me thousands. Best marketplace hands down.',
        purchase_date: '2026-06-15',
        platform_purchased: 'Upwork',
        helpful_count: 124,
        is_featured: true,
      },
      {
        id: 'rev_2',
        customer_name: 'Elena Rostova',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        country: 'GB',
        rating: 5,
        is_verified_buyer: true,
        review_text: 'Bought a Level 2 Fiverr account. Transferred flawlessly through their escrow vault. I started earning on day 3.',
        purchase_date: '2026-06-20',
        platform_purchased: 'Fiverr',
        helpful_count: 89,
        is_featured: true,
      },
      {
        id: 'rev_3',
        customer_name: 'Marcus Thorne',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        country: 'CA',
        rating: 5,
        is_verified_buyer: true,
        review_text: 'The Jumio KYC gave me massive peace of mind. Seller was totally legit. Highly recommend Remote Jobs Hub.',
        purchase_date: '2026-07-01',
        platform_purchased: 'Freelancer',
        helpful_count: 210,
        is_featured: true,
      }
    ]
  }
}

