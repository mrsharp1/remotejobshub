import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, CheckCircle2, ChevronDown, Filter } from 'lucide-react'
import { Review, SellerRating } from '@/types'
import { springs } from '@/lib/framer-physics'

interface ListingReviewsProps {
  reviews: Review[]
  sellerRating?: SellerRating | null
}

type SortOption = 'newest' | 'highest' | 'lowest' | 'helpful'

export const ListingReviews: React.FC<ListingReviewsProps> = ({
  reviews,
  sellerRating,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const sortedReviews = useMemo(() => {
    let sorted = [...reviews]
    if (sortBy === 'newest') {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } else if (sortBy === 'highest') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'lowest') {
      sorted.sort((a, b) => a.rating - b.rating)
    }
    // "helpful" could be sorted if we had helpful votes on the review object
    return sorted
  }, [reviews, sortBy])

  const visibleReviews = isExpanded ? sortedReviews : sortedReviews.slice(0, 3)

  if (reviews.length === 0) return null

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-heading text-2xl font-black text-white">
            Buyer Reviews
          </h3>
          {sellerRating && (
            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(sellerRating.average_rating)
                        ? 'fill-current'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-200">
                {sellerRating.average_rating} out of 5
              </span>
              <span className="text-slate-500">
                ({sellerRating.total_reviews} reviews)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-sm font-bold text-slate-300 outline-none"
            >
              <option value="newest" className="bg-slate-900">Newest First</option>
              <option value="highest" className="bg-slate-900">Highest Rated</option>
              <option value="lowest" className="bg-slate-900">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <AnimatePresence initial={false}>
          {visibleReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={springs.gentle}
              className="overflow-hidden"
            >
              <div className="space-y-3 rounded-2xl border border-white/5 bg-slate-800/30 p-5 backdrop-blur-sm transition-colors hover:bg-slate-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                      {rev.buyer_profile?.full_name?.charAt(0) || 'B'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">
                          {rev.buyer_profile?.full_name || 'Verified Buyer'}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(rev.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < rev.rating ? 'fill-current' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-white">{rev.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    "{rev.review}"
                  </p>
                </div>

                {rev.seller_reply && (
                  <div className="ml-4 mt-4 space-y-1 rounded-xl border-l-2 border-indigo-500/50 bg-indigo-500/5 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      Response from Seller
                    </span>
                    <p className="text-sm italic leading-relaxed text-slate-300">
                      "{rev.seller_reply}"
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Helpful
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedReviews.length > 3 && (
        <div className="flex justify-center pt-4 border-t border-white/5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700 active:scale-95"
          >
            {isExpanded ? 'Show Less' : `View All ${reviews.length} Reviews`}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      )}
    </div>
  )
}
