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
  referral_code?: string | null
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

export interface Dispute {
  id: string
  order_id: string
  opened_by: string
  admin_id?: string | null
  reason: string
  status:
    | 'pending'
    | 'under_review'
    | 'resolved_buyer'
    | 'resolved_seller'
    | 'closed'
    | 'rejected'
  resolution_notes?: string | null
  created_at: string
  updated_at: string
  order?: Order
  opened_by_profile?: Profile
  admin?: Profile
  messages?: DisputeMessage[]
  evidence?: DisputeEvidence[]
}

export interface DisputeMessage {
  id: string
  dispute_id: string
  sender_id: string
  message_text: string
  created_at: string
  sender?: Profile
}

export interface DisputeEvidence {
  id: string
  dispute_id: string
  submitted_by: string
  description: string
  file_url?: string | null
  created_at: string
  submitted_by_profile?: Profile
}

export interface Payment {
  id: string
  order_id: string
  buyer_id: string
  seller_id: string
  paystack_reference: string
  payment_status: 'pending' | 'success' | 'failed' | 'released' | 'refunded'
  payment_method?: string | null
  amount: number
  currency: string
  gateway_response?: Record<string, unknown> | null
  paid_at?: string | null
  released_at?: string | null
  refunded_at?: string | null
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
  order?: Order
  buyer?: Profile
  seller?: Profile
}

export interface Review {
  id: string
  order_id: string
  listing_id: string
  seller_id: string
  buyer_id: string
  rating: number
  title: string
  review: string
  would_recommend: boolean
  seller_reply?: string | null
  seller_reply_date?: string | null
  admin_hidden: boolean
  created_at: string
  updated_at: string
  buyer_profile?: Profile
  seller_profile?: Profile
  listing?: Listing
}

export interface ReviewSummary {
  average_rating: number
  total_reviews: number
  star_distribution: Record<number, number>
}

export interface SellerRating {
  average_rating: number
  total_reviews: number
  five_star_percentage: number
  repeat_buyers: number
  response_rate: number
  completed_orders: number
  is_verified_seller: boolean
  trust_score: number
}

export interface Conversation {
  id: string
  listing_id?: string | null
  last_message_text?: string | null
  last_message_sent_at?: string | null
  created_at: string
  updated_at: string
  listing?: Listing
  participants?: ConversationParticipant[]
  messages?: Message[]
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  unread_count: number
  is_archived: boolean
  is_starred: boolean
  is_blocked: boolean
  last_read_at?: string | null
  profile?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message_text: string
  created_at: string
  is_read: boolean
  sender?: Profile
  attachments?: MessageAttachment[]
}

export interface MessageAttachment {
  id: string
  message_id: string
  file_url: string
  file_name?: string | null
  file_type?: string | null
  created_at: string
}

export interface Wallet {
  id: string
  user_id: string
  available_balance: number
  pending_balance: number
  escrow_balance: number
  bonus_credits: number
  referral_earnings: number
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface WalletTransaction {
  id: string
  wallet_id: string
  amount: number
  type:
    | 'deposit'
    | 'withdrawal'
    | 'escrow_hold'
    | 'escrow_release'
    | 'bonus'
    | 'referral'
    | 'debit'
    | 'credit'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description?: string | null
  reference_id?: string | null
  created_at: string
}

export interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  bank_name: string
  account_number: string
  account_name: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string | null
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Broadcast {
  id: string
  title: string
  message: string
  audience_filter:
    | 'everyone'
    | 'buyers'
    | 'sellers'
    | 'verified_sellers'
    | 'no_purchase'
    | 'active_orders'
    | 'completed_orders'
  image_url?: string | null
  link_url?: string | null
  scheduled_at?: string | null
  sent_count: number
  delivered_count: number
  read_count: number
  created_at: string
}

export interface NotificationPreferences {
  id: string
  user_id: string
  orders_enabled: boolean
  payments_enabled: boolean
  messages_enabled: boolean
  promotions_enabled: boolean
  updates_enabled: boolean
  announcements_enabled: boolean
  updated_at: string
}

export interface SellerRevenueAgreement {
  id: string
  user_id: string
  revenue_plan: 'OptionA' | 'OptionB'
  percentage: number
  bonus_eligible: boolean
  accepted_at: string
  agreement_version: string
  profile?: Profile
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  referral_code: string
  status: 'pending' | 'qualified' | 'paid' | 'cancelled'
  reward_amount: number
  first_purchase_date?: string | null
  created_at: string
  updated_at: string
  referrer?: Profile
  referred?: Profile
}

export interface ReferralReward {
  id: string
  referral_id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  referral?: Referral
}

export interface SellerVerification {
  id: string
  user_id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  document_type:
    'government_id' | 'passport' | 'drivers_license' | 'national_id'
  selfie_url: string
  proof_of_address_url: string
  notes?: string | null
  created_at: string
  updated_at: string
  profile?: Profile
  documents?: VerificationDocument[]
  audit_logs?: VerificationAuditLog[]
}

export interface VerificationDocument {
  id: string
  verification_id: string
  file_url: string
  file_type: string
  created_at: string
}

export interface VerificationAuditLog {
  id: string
  verification_id: string
  admin_id?: string | null
  action: 'submit' | 'review' | 'approve' | 'reject' | 'resubmit'
  notes?: string | null
  created_at: string
  admin_profile?: Profile
}

export interface Promotion {
  id: string
  user_id?: string | null
  title: string
  description?: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  campaign_type: 'seasonal' | 'seller_boost' | 'flash_sale'
  start_date: string
  end_date: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed' | 'first_purchase' | 'referral'
  discount_value: number
  usage_limit?: number | null
  remaining_uses?: number | null
  start_date: string
  end_date: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface CouponRedemption {
  id: string
  coupon_id: string
  buyer_id: string
  order_id?: string | null
  discount_applied: number
  created_at: string
  coupon?: Coupon
  buyer?: Profile
}

export interface PromotionalBanner {
  id: string
  title: string
  image_url: string
  link_url?: string | null
  active: boolean
  created_at: string
}

export interface FraudFlag {
  id: string
  user_id: string
  reason: string
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed'
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface RiskScore {
  id: string
  user_id: string
  score: number
  factors: string[]
  updated_at: string
  profile?: Profile
}

export interface LoginHistory {
  id: string
  user_id: string
  ip_address?: string | null
  device_fingerprint?: string | null
  browser?: string | null
  os?: string | null
  country?: string | null
  risk_level?: string | null
  created_at: string
  profile?: Profile
}

export interface SuspiciousActivity {
  id: string
  user_id: string
  activity_type: string
  description?: string | null
  ip_address?: string | null
  created_at: string
  profile?: Profile
}

export interface BlockedDevice {
  id: string
  device_fingerprint: string
  reason?: string | null
  blocked_by?: string | null
  created_at: string
}

export interface ListingView {
  id: string
  user_id: string
  listing_id: string
  viewed_at: string
  listing?: Listing
}

export interface SavedSearch {
  id: string
  user_id: string
  query: string
  filters?: Record<string, unknown> | null
  created_at: string
}

export interface AIInsight {
  id: string
  title: string
  description: string
  metric_value: string
  metric_change: string
}

export interface AutomationJob {
  id: string
  name: string
  description?: string | null
  last_run?: string | null
  next_run?: string | null
  status: 'idle' | 'running' | 'success' | 'failed'
  created_at: string
  updated_at: string
}

export interface AutomationAuditLog {
  id: string
  job_id: string
  job_name: string
  status: 'success' | 'failed'
  log_message?: string | null
  executed_by?: string | null
  created_at: string
  admin_profile?: Profile
}
