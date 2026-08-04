# Missing Tables Extracted from Types

## automation_audit_logs (AutomationAuditLog)
```ts
id: string
  job_id: string
  job_name: string
  status: 'success' | 'failed'
  log_message?: string | null
  executed_by?: string | null
  created_at: string
  admin_profile?: Profile
```

## automation_jobs (AutomationJob)
```ts
id: string
  name: string
  description?: string | null
  last_run?: string | null
  next_run?: string | null
  status: 'idle' | 'running' | 'success' | 'failed'
  created_at: string
  updated_at: string
```

## blocked_devices (BlockedDevice)
```ts
id: string
  device_fingerprint: string
  reason?: string | null
  blocked_by?: string | null
  created_at: string
```

## broadcasts (Broadcast)
```ts
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
```

## cms_audit_log
(No interface found for CmsAuditLog)

## cms_careers
(No interface found for CmsCareer)

## cms_events
(No interface found for CmsEvent)

## cms_policies
(No interface found for CmsPolicy)

## cms_revisions
(No interface found for CmsRevision)

## cms_success_stories
(No interface found for CmsSuccessStory)

## cms_testimonials
(No interface found for CmsTestimonial)

## cms_timeline_milestones
(No interface found for CmsTimelineMilestone)

## conversation_participants (ConversationParticipant)
```ts
id: string
  conversation_id: string
  user_id: string
  unread_count: number
  is_archived: boolean
  is_starred: boolean
  is_blocked: boolean
  last_read_at?: string | null
  profile?: Profile
```

## conversations (Conversation)
```ts
id: string
  listing_id?: string | null
  last_message_text?: string | null
  last_message_sent_at?: string | null
  created_at: string
  updated_at: string
  listing?: Listing
  participants?: ConversationParticipant[]
  messages?: Message[]
```

## coupon_redemptions (CouponRedemption)
```ts
id: string
  coupon_id: string
  buyer_id: string
  order_id?: string | null
  discount_applied: number
  created_at: string
  coupon?: Coupon
  buyer?: Profile
```

## coupons (Coupon)
```ts
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
```

## dispute_evidence (DisputeEvidence)
```ts
id: string
  dispute_id: string
  submitted_by: string
  description: string
  file_url?: string | null
  created_at: string
  submitted_by_profile?: Profile
```

## dispute_messages (DisputeMessage)
```ts
id: string
  dispute_id: string
  sender_id: string
  message_text: string
  created_at: string
  sender?: Profile
```

## disputes (Dispute)
```ts
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
```

## fraud_flags (FraudFlag)
```ts
id: string
  user_id: string
  reason: string
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed'
  created_at: string
  updated_at: string
  profile?: Profile
```

## homepage_stats
(No interface found for HomepageStat)

## listing_views (ListingView)
```ts
id: string
  user_id: string
  listing_id: string
  viewed_at: string
  listing?: Listing
```

## login_history (LoginHistory)
```ts
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
```

## message_attachments (MessageAttachment)
```ts
id: string
  message_id: string
  file_url: string
  file_name?: string | null
  file_type?: string | null
  created_at: string
```

## messages (Message)
```ts
id: string
  conversation_id: string
  sender_id: string
  message_text: string
  created_at: string
  is_read: boolean
  sender?: Profile
  attachments?: MessageAttachment[]
```

## notification_preferences
(No interface found for NotificationPreference)

## order_messages (OrderMessage)
```ts
id: string
  order_id: string
  sender_id: string
  message_text: string
  created_at: string
  sender?: Profile
```

## profiles (Profile)
```ts
id: string
  full_name: string | null
  email: string
  phone: string | null
  country: string | null
  address?: string | null
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
```

## promotions (Promotion)
```ts
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
```

## referral_rewards (ReferralReward)
```ts
id: string
  referral_id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  referral?: Referral
```

## referrals (Referral)
```ts
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
```

## reviews (Review)
```ts
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
```

## risk_scores (RiskScore)
```ts
id: string
  user_id: string
  score: number
  factors: string[]
  updated_at: string
  profile?: Profile
```

## saved_searches
(No interface found for SavedSearche)

## suspicious_activities
(No interface found for SuspiciousActivitie)

## withdrawal_requests (WithdrawalRequest)
```ts
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
```

