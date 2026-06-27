import { UserRole } from '@/constants/roles'
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  avatarUrl?: string
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
export interface Listing {
  id: string
  sellerId: string
  title: string
  description: string
  category: string
  price: number
  location?: string
  isRemote: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
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
  listingId: string
  reviewerId: string
  rating: number
  comment?: string
  createdAt: string
}