import React from 'react'

import { ShieldCheck, Lock, Globe, Clock, Zap, Star } from 'lucide-react'
import type { Listing, SellerRating } from '@/types'

interface ListingHeroProps {
  listing: Listing
  sellerRating?: SellerRating | null
}

export const ListingHero: React.FC<ListingHeroProps> = ({ listing, sellerRating }) => {
  const weeklyRevenue = (Number(listing.monthly_income || 0) / 4).toLocaleString()
  const monthlyRevenue = Number(listing.monthly_income || 0).toLocaleString()
  const price = Number(listing.price).toLocaleString()
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          KYC Level 3 Verified
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <Lock className="h-3.5 w-3.5" />
          Escrow Protected
        </span>
        {listing.seller?.seller_verified && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Star className="h-3.5 w-3.5" />
            Top Seller
          </span>
        )}
      </div>

      <div className="space-y-2 min-w-0">
        <h1 className="font-heading text-3xl font-black leading-tight text-white md:text-5xl lg:text-6xl break-words" style={{ overflowWrap: 'anywhere' }}>
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
          <span className="flex items-center gap-1.5 break-words min-w-0">
            <Globe className="h-4 w-4 shrink-0 text-indigo-400" />
            <span className="truncate">{listing.country}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 break-words min-w-0">
            <span className="font-bold text-slate-300 truncate">{listing.platform}</span> <span className="shrink-0">Asset</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 shrink-0">
            <Clock className="h-4 w-4 text-emerald-400" />
            Listed {new Date(listing.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-sm min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">Asking Price</p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white truncate" title={`₦${price}`}>₦{price}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-sm min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">Monthly Rev</p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 truncate" title={`₦${monthlyRevenue}`}>₦{monthlyRevenue}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-white/5 bg-slate-900/50 p-4 backdrop-blur-sm min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">Wk Run Rate</p>
          <p className="font-mono text-xl sm:text-2xl font-bold text-indigo-400 truncate" title={`₦${weeklyRevenue}`}>₦{weeklyRevenue}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 backdrop-blur-sm min-w-0 flex flex-col justify-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-300 truncate">Trust Score</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xl sm:text-2xl font-bold text-indigo-400">
              {sellerRating ? ((sellerRating.average_rating / 5) * 100).toFixed(0) : 98}%
            </p>
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 fill-indigo-400 text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
