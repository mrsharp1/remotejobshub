import { UserRole } from '@/constants/roles'
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  avatarUrl?: string
}
export interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  country: string | null
  avatar_url: string | null
  role: 'buyer' | 'seller' | 'admin'
  status: 'active' | 'suspended' | 'pending' | 'deleted'
  created_at: string
  updated_at: string
  bio: string | null
  company_name: string | null
  company_website: string | null
  seller_verified: boolean
  seller_since: string | null
  subscription_plan: string
}
export interface Seller {
  id: string
  userId: string
  companyName: string
  website?: string
  bio?: string
  isVerified: boolean
  createdAt: string
}
export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed'
  provider: 'paystack'
  reference: string
  createdAt: string
}

export interface Review {
  id: string
  listing_id: string
  reviewerId: string
  rating: number
  comment?: string
  createdAt: string
}

export interface Listing {
  id: string
  seller_id: string
  title: string
  platform: string
  country: string
  account_age?: string | null
  monthly_income?: number | null
  price: number
  description?: string | null
  reason_for_sale?: string | null
  status: 'draft' | 'submitted' | 'published' | 'sold' | 'archived'
  approval_status: 'pending' | 'approved' | 'rejected'
  views: number
  favorites_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
  original_email_included: boolean
  recovery_email_included: boolean
  phone_included: boolean
  identity_verified: boolean
  review_notes?: string | null
  approved_by?: string | null
  approved_at?: string | null
  featured_until?: string | null
  images?: ListingImage[]
  tags?: ListingTag[]
  seller?: Profile
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface ListingTag {
  id: string
  listing_id: string
  tag: string
}

export interface Favorite {
  user_id: string
  listing_id: string
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string
  status:
    | 'pending'
    | 'payment_pending'
    | 'payment_received'
    | 'seller_processing'
    | 'buyer_review'
    | 'completed'
    | 'cancelled'
    | 'disputed'
  amount: number
  currency: string
  created_at: string
  updated_at: string
  buyer?: Profile
  seller?: Profile
  listing?: Listing
}

export interface OrderTimeline {
  id: string
  order_id: string
  status: string
  notes?: string | null
  created_at: string
}

export interface OrderMessage {
  id: string
  order_id: string
  sender_id: string
  message_text: string
  created_at: string
  sender?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'order' | 'payment' | 'listing' | 'system'
  reference_type?: string | null
  reference_id?: string | null
  is_read: boolean
  created_at: string
  updated_at: string
}
