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

  console.log('========================================')
  console.log('SELLER PROFILE REVIEW TRACE')
  console.log('========================================')
  console.log('reviews prop exists:', !!reviews)
  console.log('reviews.length:', reviews?.length)
  console.log('reviews:', reviews)
  console.log('review IDs:', reviews?.map(r => r.id))
  console.log('review ratings:', reviews?.map(r => r.rating))
  console.log('review titles:', reviews?.map(r => r.title))
  console.log('render condition:', reviews.length > 0)
  console.log('========================================')

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
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">Completed Sales</p>
          <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-white truncate">{ratingCount + 5}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">Avg Rating</p>
          <div className="mt-1 flex items-center gap-1 font-mono text-lg sm:text-xl font-bold text-white truncate">
            {displayRating.toFixed(0)}% <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">Response Time</p>
          <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-white truncate">{"< 1 Hour"}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">Success Rate</p>
          <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-white truncate">100%</p>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            <MessageCircle className="h-4 w-4 shrink-0" /> Recent Reviews
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="rounded-2xl border border-white/5 bg-slate-950/50 p-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 shrink-0 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                {review.title && (
                   <h5 className="mt-3 text-sm font-bold text-slate-200 break-words" style={{ overflowWrap: 'anywhere' }}>{review.title}</h5>
                )}
                <p className={`text-sm italic text-slate-300 break-words ${!review.title ? 'mt-2' : 'mt-1'}`} style={{ overflowWrap: 'anywhere' }}>"{review.review}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
