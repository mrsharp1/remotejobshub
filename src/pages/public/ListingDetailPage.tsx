import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { listingService } from '@/services/marketplace/listing.service'
import { recommendationService } from '@/services/marketplace/recommendation.service'
import { reviewService } from '@/services/marketplace/review.service'
import { conversationService } from '@/features/messaging/services'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

import { LoadingSkeleton } from '@/components/listing/LoadingSkeleton'
import { EmptyState } from '@/components/listing/EmptyState'
import { ListingHero } from '@/components/listing/ListingHero'
import { Gallery } from '@/components/listing/Gallery'
import { RevenueAnalytics } from '@/components/listing/RevenueAnalytics'
import { TrustCenter } from '@/components/listing/TrustCenter'
import { SellerProfile } from '@/components/listing/SellerProfile'
import { PurchaseTimeline } from '@/components/listing/PurchaseTimeline'
import { FAQ } from '@/components/listing/FAQ'
import { SimilarListings } from '@/components/listing/SimilarListings'
import { StickyPurchaseCard } from '@/components/listing/StickyPurchaseCard'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addListing } = useRecentlyViewedStore()

  const [favorites, setFavorites] = useState<string[]>([])
  const [isCopied, setIsCopied] = useState(false)

  const {
    data: listing,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['listing-detail', id],
    queryFn: () => {
      if (!id) throw new Error('No ID provided')
      return listingService.getListing(id)
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (listing?.id) {
      listingService.incrementViews(listing.id)
      addListing(listing)
      if (user?.id) {
        recommendationService.recordListingView(user.id, listing.id)
      }
    }
  }, [listing, user?.id, addListing])

  const { data: similarList = [] } = useQuery({
    queryKey: ['similar-listings', id],
    queryFn: () => (id ? recommendationService.getSimilarListings(id) : []),
    enabled: !!id,
  })

  useEffect(() => {
    if (!user?.id) return
    const getFavorites = async () => {
      try {
        const { data } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id)
        if (data) {
          setFavorites(data.map((f) => f.listing_id))
        }
      } catch (err) {
        console.error('Failed to load favorites:', err)
      }
    }
    getFavorites()
  }, [user?.id])

  const { data: sellerRating } = useQuery({
    queryKey: ['seller-rating-metrics', listing?.seller_id],
    queryFn: () => {
      if (!listing?.seller_id) return null
      return reviewService.getSellerRating(listing.seller_id)
    },
    enabled: !!listing?.seller_id,
  })

  const { data: sellerReviews = [] } = useQuery({
    queryKey: ['seller-reviews-list', listing?.seller_id],
    queryFn: () => {
      if (!listing?.seller_id) return []
      return reviewService.getSellerReviews(listing.seller_id)
    },
    enabled: !!listing?.seller_id,
  })

  useEffect(() => {
    console.log('========================================')
    console.log('PUBLIC TRANSACTIONAL REVIEW TRACE')
    console.log('========================================')
    console.log('listing.id:', listing?.id)
    console.log('listing.seller_id:', listing?.seller_id)
    console.log('sellerReviews.length:', sellerReviews.length)
    console.log('sellerReviews:', sellerReviews)
    console.log('========================================')
  }, [listing?.id, listing?.seller_id, sellerReviews])

  const handleToggleFavorite = async () => {
    if (!listing?.id) return
    if (!user?.id) {
      alert('Please log in to add listings to your favorites.')
      return
    }
    try {
      const isFav = await listingService.toggleFavorite(user.id, listing.id)
      setFavorites((prev) =>
        isFav ? [...prev, listing.id] : prev.filter((fid) => fid !== listing.id)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleFavoriteItem = async (listingId: string) => {
    if (!user?.id) {
      alert('Please log in to add listings to your favorites.')
      return
    }
    try {
      const isFav = await listingService.toggleFavorite(user.id, listingId)
      setFavorites((prev) =>
        isFav ? [...prev, listingId] : prev.filter((fid) => fid !== listingId)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleBuyClick = () => {
    if (!user?.id) {
      navigate(`/login?redirect=/checkout/${listing?.id}`)
      return
    }
    navigate(`/checkout/${listing?.id}`)
  }
  const handleContactSeller = async () => {
    if (!listing) return
    if (!user?.id) {
      navigate('/login')
      return
    }
    if (user.id === listing.seller_id) {
      alert('You cannot start a conversation with yourself.')
      return
    }
    try {
      const conversation = await conversationService.createConversation(
        'listing',
        listing.id,
        user.id,
        listing.seller_id
      )
      navigate('/dashboard/messages', { state: { activeConversationId: conversation.id } })
    } catch {
      alert('Failed to initialize conversation')
    }
  }

  const isFavorited = listing ? favorites.includes(listing.id) : false

  const images = useMemo(() => {
    return listing?.images?.map((i) => i.image_url) || []
  }, [listing?.images])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError || !listing) {
    return <EmptyState onRetry={() => refetch()} />
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-8 pb-40">
        <div className="mb-8 flex items-center border-b border-white/5 pb-4">
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Main Content Column */}
          <div className="space-y-12 lg:col-span-8">
            <ListingHero listing={listing} sellerRating={sellerRating} />

            <Gallery images={images} title={listing.title} />

            <RevenueAnalytics listing={listing} />

            {/* Why This Account */}
            {listing.description &&
              (() => {
                const parseDescription = (rawText: string) => {
                  if (
                    !rawText.includes('=== ACCOUNT METRICS ===') &&
                    !rawText.includes('=== DESCRIPTION ===')
                  ) {
                    return { metrics: null, description: rawText }
                  }
                  const parts = rawText.split('=== DESCRIPTION ===')
                  const metricsRaw = parts[0]
                    .replace('=== ACCOUNT METRICS ===', '')
                    .trim()
                  const descRaw = parts[1] ? parts[1].trim() : ''

                  const metricsLines = metricsRaw.split('\n').filter(Boolean)
                  const metrics = metricsLines.map((line) => {
                    const [key, ...value] = line.split(':')
                    return { key: key.trim(), value: value.join(':').trim() }
                  })
                  return {
                    metrics,
                    description:
                      descRaw || metricsRaw /* Fallback if format is weird */,
                  }
                }

                const { metrics, description } = parseDescription(
                  listing.description
                )
                const displayReason = listing.reason_for_sale

                return (
                  <div className="space-y-6 overflow-hidden rounded-[24px] border border-white/5 bg-slate-900/30 p-5 backdrop-blur-xl sm:p-8">
                    <h2 className="break-words font-heading text-xl font-bold text-white">
                      Why This Account?
                    </h2>

                    {metrics && metrics.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                          Account Metrics
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {metrics.map((m, i) => (
                            <div
                              key={i}
                              className="min-w-0 rounded-lg bg-white/5 p-3"
                            >
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {m.key}
                              </span>
                              <span
                                className="block truncate text-sm font-medium text-slate-200"
                                title={m.value}
                              >
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        Description
                      </h3>
                      <div
                        className="prose prose-invert max-w-none whitespace-pre-line break-words text-sm leading-relaxed text-slate-300"
                        style={{ overflowWrap: 'anywhere' }}
                      >
                        {description}
                      </div>
                    </div>

                    {displayReason && (
                      <div className="space-y-2 border-t border-white/5 pt-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                          Reason for Sale
                        </h4>
                        <p
                          className="break-words text-sm leading-relaxed text-slate-300"
                          style={{ overflowWrap: 'anywhere' }}
                        >
                          {displayReason}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })()}

            <TrustCenter />

            {listing.seller && (
              <SellerProfile
                seller={listing.seller}
                metrics={sellerRating}
                reviews={sellerReviews}
              />
            )}

            <PurchaseTimeline />

            <FAQ />

            <SimilarListings
              listings={similarList}
              favorites={favorites}
              onToggleFavorite={handleToggleFavoriteItem}
            />
          </div>

          {/* Sticky Purchase Panel Column */}
          <div className="lg:col-span-4">
            <StickyPurchaseCard
              listing={listing}
              isFavorited={isFavorited}
              isCopied={isCopied}
              onBuyClick={handleBuyClick}
              onContactClick={handleContactSeller}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ListingDetailPage
