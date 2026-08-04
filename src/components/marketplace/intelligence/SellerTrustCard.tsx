import React from 'react'
import { SellerRating } from '@/types'
import { Profile } from '@/types'
import {
  ShieldCheck,
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  MessageSquare,
  CheckCircle2,
  Repeat2,
} from 'lucide-react'

interface SellerTrustCardProps {
  seller: Profile | undefined
  rating?: SellerRating | null
  className?: string
}

function getTrustLabel(score: number): { label: string; color: string } {
  if (score >= 90)
    return {
      label: 'Elite Seller',
      color: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
    }
  if (score >= 75)
    return {
      label: 'Top Seller',
      color: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
    }
  if (score >= 60)
    return {
      label: 'Trusted Seller',
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    }
  return {
    label: 'New Seller',
    color: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  }
}

export const SellerTrustCard: React.FC<SellerTrustCardProps> = ({
  seller,
  rating,
  className = '',
}) => {
  const trustScore = rating?.trust_score ?? 0
  const trustLabel = getTrustLabel(trustScore)
  const completedSales = rating?.completed_orders ?? 0
  const avgRating = rating?.average_rating ?? 0
  const totalReviews = rating?.total_reviews ?? 0
  const responseRate = rating?.response_rate ?? 0
  const repeatBuyers = rating?.repeat_buyers ?? 0
  const fiveStarPct = rating?.five_star_percentage ?? 0

  const isVerified = seller?.seller_verified ?? false
  const sellerSince = seller?.seller_since
    ? new Date(seller.seller_since).getFullYear()
    : seller?.created_at
      ? new Date(seller.created_at).getFullYear()
      : null

  const stats = [
    {
      icon: TrendingUp,
      label: 'Completed Sales',
      value: completedSales > 0 ? completedSales.toString() : 'New',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Star,
      label: 'Avg. Rating',
      value: avgRating > 0 ? `${avgRating.toFixed(1)} / 5.0` : 'No reviews',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: MessageSquare,
      label: 'Response Rate',
      value: responseRate > 0 ? `${responseRate}%` : 'N/A',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Repeat2,
      label: 'Repeat Buyers',
      value: repeatBuyers > 0 ? repeatBuyers.toString() : '0',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10',
    },
  ]

  return (
    <div
      className={`space-y-6 rounded-[24px] border border-white/5 bg-slate-900/40 p-7 shadow-2xl backdrop-blur-2xl ${className}`}
    >
      {/* Seller Identity */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-xl font-black text-indigo-400 shadow-xl ring-2 ring-indigo-500/20">
            {seller?.avatar_url ? (
              <img
                src={seller.avatar_url}
                alt={seller.full_name || 'Seller'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{seller?.full_name?.charAt(0) ?? 'S'}</span>
            )}
          </div>
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-900 bg-emerald-500 shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate font-heading text-lg font-bold text-white">
            {seller?.full_name ?? 'Anonymous Seller'}
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${trustLabel.color}`}
            >
              <Award className="h-3 w-3" />
              {trustLabel.label}
            </span>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                KYC Verified
              </span>
            )}
            {seller?.subscription_plan === 'enterprise' && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                💎 Premium
              </span>
            )}
            {seller?.subscription_plan === 'pro' && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                ⭐ Gold
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trust Score Bar */}
      {trustScore > 0 && (
        <div className="space-y-2 rounded-xl border border-white/5 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Trust Score
            </span>
            <span className="font-heading text-lg font-black text-indigo-400">
              {trustScore}/100
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
              style={{ width: `${trustScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border border-white/5 ${s.bg} p-4 backdrop-blur-sm`}>
            <div className="mb-2 flex items-center gap-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {s.label}
              </span>
            </div>
            <p className={`font-heading text-lg font-black tracking-tight ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="space-y-3 border-t border-white/10 pt-5">
        {sellerSince && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span>Selling since</span>
            </div>
            <span className="font-bold text-slate-200">{sellerSince}</span>
          </div>
        )}
        {totalReviews > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Star className="h-4 w-4" />
              <span>5-star reviews</span>
            </div>
            <span className="font-bold text-slate-200">
              {fiveStarPct}%
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="h-4 w-4" />
            <span>Account type</span>
          </div>
          <span className="font-bold capitalize text-slate-200">
            {seller?.subscription_plan ?? 'Free'} Plan
          </span>
        </div>
      </div>

      {/* Seller Bio */}
      {seller?.bio && (
        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 shadow-inner">
          <p className="text-sm italic leading-relaxed text-slate-400">
            "{seller.bio}"
          </p>
        </div>
      )}
    </div>
  )
}
