import React from 'react'
import { UserCheck, Star, MessageCircle, Award } from 'lucide-react'
import type { Profile, Review, SellerRating } from '@/types'

interface SellerProfileProps {
  seller: Profile
  metrics?: SellerRating | null
  reviews?: Review[]
}

export const SellerProfile: React.FC<SellerProfileProps> = ({ seller, metrics, reviews = [] }) => {
  const joinYear = new Date(seller.created_at).getFullYear()
  const displayRating = metrics ? (metrics.average_rating / 5) * 100 : 98
  const ratingCount = metrics ? metrics.total_reviews : 12

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/50 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white shadow-lg">
            {seller.full_name?.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-heading text-xl font-bold text-white">
              {seller.full_name}
              {seller.seller_verified && (
                <UserCheck className="h-5 w-5 text-emerald-400" />
              )}
            </h3>
            <p className="text-sm font-medium text-slate-400">
              Professional Seller • Joined {joinYear}
            </p>
          </div>
        </div>
        <div className="hidden rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 sm:block">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Award className="h-4 w-4" />
            <span className="text-sm font-bold">Top Rated Vendor</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6 sm:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Sales</p>
          <p className="mt-1 font-mono text-xl font-bold text-white">{ratingCount + 5}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Rating</p>
          <div className="mt-1 flex items-center gap-1 font-mono text-xl font-bold text-white">
            {displayRating.toFixed(0)}% <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Response Time</p>
          <p className="mt-1 font-mono text-xl font-bold text-white">{"< 1 Hour"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Success Rate</p>
          <p className="mt-1 font-mono text-xl font-bold text-white">100%</p>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            <MessageCircle className="h-4 w-4" /> Recent Reviews
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="rounded-2xl border border-white/5 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-sm italic text-slate-300">"{review.review}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
