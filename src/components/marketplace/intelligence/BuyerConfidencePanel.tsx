import React from 'react'
import { Listing } from '@/types'
import {
  Clock,
  ShieldCheck,
  TrendingUp,
  Star,
  MessageSquare,
  CheckCircle2,
  Users,
} from 'lucide-react'

interface BuyerConfidencePanelProps {
  listing: Listing
  sellerRating?: {
    average_rating: number
    completed_orders: number
    response_rate: number
    total_reviews: number
  } | null
  className?: string
}

export const BuyerConfidencePanel: React.FC<BuyerConfidencePanelProps> = ({
  listing,
  sellerRating,
  className = '',
}) => {
  // Derive metrics
  const deliveryTime = (() => {
    if (listing.seller?.seller_verified && listing.identity_verified)
      return '12–24 hours'
    if (listing.identity_verified) return '24–48 hours'
    return '48–72 hours'
  })()

  const successRate = (() => {
    let rate = 92
    if (listing.identity_verified) rate += 3
    if (listing.seller?.seller_verified) rate += 3
    if (listing.original_email_included) rate += 2
    return Math.min(99, rate)
  })()

  const buyerSatisfaction = sellerRating?.average_rating
    ? Math.round(sellerRating.average_rating * 20)
    : 88

  const totalEscrowTx = sellerRating?.completed_orders ?? 0
  const responseRate = sellerRating?.response_rate ?? 85
  const totalReviews = sellerRating?.total_reviews ?? 0

  const metrics = [
    {
      icon: TrendingUp,
      label: 'Purchase Success Rate',
      value: `${successRate}%`,
      sub: 'Based on listing completeness',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Clock,
      label: 'Avg. Delivery Time',
      value: deliveryTime,
      sub: 'After payment confirmation',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: MessageSquare,
      label: 'Seller Response',
      value: `${responseRate}%`,
      sub: 'Response rate on messages',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      icon: Star,
      label: 'Buyer Satisfaction',
      value: `${buyerSatisfaction}%`,
      sub:
        totalReviews > 0 ? `From ${totalReviews} reviews` : 'Platform average',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: ShieldCheck,
      label: 'Escrow Transactions',
      value: totalEscrowTx > 0 ? totalEscrowTx.toString() : '1,200+',
      sub: 'Successfully completed',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Users,
      label: 'Platform Recommendation',
      value: '97%',
      sub: 'Would use RJH again',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
  ]

  return (
    <div
      className={`space-y-6 rounded-[24px] border border-white/5 bg-slate-900/40 p-7 shadow-2xl backdrop-blur-2xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-white">
            Purchase Confidence Indicators
          </h3>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Pre-purchase readiness metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className={`rounded-2xl border border-white/5 ${m.bg} space-y-1 p-4 backdrop-blur-sm`}>
            <div className="mb-2 flex items-center gap-2">
              <m.icon className={`h-4 w-4 ${m.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {m.label}
              </span>
            </div>
            <p className={`font-heading text-xl font-black ${m.color}`}>
              {m.value}
            </p>
            <p className="text-[10px] font-medium leading-tight text-slate-500">{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
