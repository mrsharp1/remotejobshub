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
export interface Order {
  id: string
  buyerId: string
  listingId: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
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
  images?: ListingImage[]
  tags?: ListingTag[]
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
