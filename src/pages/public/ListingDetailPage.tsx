import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Globe,
  DollarSign,
  Heart,
  Share2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
} from 'lucide-react'
import { listingService } from '@/services/marketplace/listing.service'
import { orderService } from '@/services/marketplace/order.service'
import { paymentService } from '@/services/marketplace/payment.service'
import { reviewService } from '@/services/marketplace/review.service'
import { messageService } from '@/services/marketplace/message.service'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { Review } from '@/types'
import { PurchaseSummaryModal } from '@/components/marketplace/PurchaseSummaryModal'
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard'

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isCopied, setIsCopied] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)

  // Fetch Listing Detail
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

  // Increment views count once detail loads
  useEffect(() => {
    if (listing?.id) {
      listingService.incrementViews(listing.id)
    }
  }, [listing?.id])

  // Fetch initial favorites list if authenticated
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

  // Fetch related listings based on same platform
  const { data: relatedListings = [] } = useQuery({
    queryKey: ['related-listings', listing?.platform],
    queryFn: () => {
      if (!listing?.platform) return []
      return listingService.getListings({ platform: listing.platform })
    },
    enabled: !!listing?.platform,
  })

  // Filter out current listing from related list
  const filteredRelated = useMemo(() => {
    return relatedListings.filter((l) => l.id !== listing?.id).slice(0, 4)
  }, [relatedListings, listing?.id])

  // Fetch seller rating metrics
  const { data: sellerRating } = useQuery({
    queryKey: ['seller-rating-metrics', listing?.seller_id],
    queryFn: () => {
      if (!listing?.seller_id) return null
      return reviewService.getSellerRating(listing.seller_id)
    },
    enabled: !!listing?.seller_id,
  })

  // Fetch listing reviews
  const { data: listingReviews = [] } = useQuery({
    queryKey: ['listing-reviews-list', listing?.id],
    queryFn: () => {
      if (!listing?.id) return []
      return reviewService.getListingReviews(listing.id)
    },
    enabled: !!listing?.id,
  })

  // Toggle favorite trigger
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

  // Handle Share URL
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleConfirmPurchase = async () => {
    if (!user?.id || !user?.email || !listing) return
    try {
      // 1. Create order in pending status
      const order = await orderService.createOrder({
        buyer_id: user.id,
        seller_id: listing.seller_id,
        listing_id: listing.id,
        amount: listing.price,
      })

      // 2. Close modal view
      setShowSummaryModal(false)

      // 3. Initialize Paystack payment popups
      paymentService.initializePayment(
        user.email,
        listing.price,
        order.id,
        async (response) => {
          try {
            // Verify payment on success and redirect
            await paymentService.verifyPayment(response.reference, order.id)
            navigate(`/orders/${order.id}`)
          } catch (verifyErr) {
            console.error('Failed to verify payment reference:', verifyErr)
            alert(
              'Verification failed. Please contact support with reference: ' +
                response.reference
            )
          }
        },
        () => {
          alert(
            'Payment checkout window closed. You can fulfill this transaction in the buyer dashboard.'
          )
          navigate(`/orders/${order.id}`)
        }
      )
    } catch (err) {
      console.error(err)
      throw err
    }
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
      await messageService.createConversation(
        listing.id,
        user.id,
        listing.seller_id
      )
      navigate('/dashboard/messages')
    } catch {
      alert('Failed to initialize conversation')
    }
  }

  const isFavorited = listing ? favorites.includes(listing.id) : false

  const images = useMemo(() => {
    return listing?.images?.map((i) => i.image_url) || []
  }, [listing?.images])

  const tags = useMemo(() => {
    return listing?.tags?.map((t) => t.tag) || []
  }, [listing?.tags])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-4 py-8">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: gallery, detail skeleton */}
          <div className="space-y-6 lg:col-span-8">
            <div className="aspect-video w-full rounded-xl bg-muted" />
            <div className="h-8 w-2/3 rounded bg-muted" />
            <div className="h-40 w-full rounded-xl bg-muted" />
          </div>
          {/* Right Column: seller, actions skeleton */}
          <div className="space-y-6 lg:col-span-4">
            <div className="h-64 w-full rounded-xl bg-muted" />
            <div className="h-40 w-full rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-16 text-center">
        <XCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="font-heading text-xl font-bold text-foreground">
          Failed to load listing details
        </h2>
        <p className="text-sm text-muted-foreground">
          The listing may have been archived, sold, or is temporarily
          unavailable.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
          >
            Retry Loading
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="rounded-lg border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  const isSellerVerified = listing.seller?.seller_verified || false

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      {/* Breadcrumb / Top actions bar */}
      <div className="border-border/40 flex items-center justify-between border-b pb-4">
        <Link
          to="/marketplace"
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
        >
          ← Back to Marketplace
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
              isFavorited
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                : 'border-border bg-background hover:bg-muted'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isFavorited ? 'fill-rose-500' : ''}`}
            />
            {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
            {isCopied ? 'Copied URL!' : 'Share'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Gallery, Specs Table, Description, Protection */}
        <div className="space-y-8 lg:col-span-8">
          {/* Main Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[activeImageIdx]}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIdx((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/85"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIdx((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/85"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                  <Globe className="h-16 w-16" />
                  <span className="mt-2 text-sm">
                    No listing gallery images uploaded
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, idx) => (
                  <button
                    key={url}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded border ${
                      idx === activeImageIdx
                        ? 'border-transparent ring-2 ring-primary'
                        : 'border-border'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Information Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/10 rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {listing.platform}
              </span>
              <span className="flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <Globe className="h-3.5 w-3.5" /> {listing.country}
              </span>
            </div>

            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
              {listing.title}
            </h1>

            <div className="border-border/50 flex items-center gap-6 border-y py-4">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  List Price
                </span>
                <span className="flex items-center font-heading text-2xl font-extrabold text-primary">
                  <DollarSign className="h-6 w-6" />
                  {Number(listing.price).toLocaleString()}
                </span>
              </div>
              {listing.monthly_income !== undefined && (
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Monthly Earnings
                  </span>
                  <span className="flex items-center font-heading text-xl font-extrabold text-foreground">
                    <DollarSign className="h-5 w-5" />
                    {Number(listing.monthly_income).toLocaleString()}/mo
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Account Verification Features Checklist */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-heading text-sm font-bold text-foreground">
              Asset Security Features
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  label: 'Original Email Included',
                  val: listing.original_email_included,
                },
                {
                  label: 'Recovery Email Linked',
                  val: listing.recovery_email_included,
                },
                {
                  label: 'Phone Verification Cleared',
                  val: listing.phone_included,
                },
                {
                  label: 'Identity Verification Cleared',
                  val: listing.identity_verified,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {item.val ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span
                    className={
                      item.val
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Sale Details */}
          <div className="space-y-6">
            {listing.description && (
              <div className="space-y-2">
                <h3 className="font-heading text-base font-bold text-foreground">
                  Description & History
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {listing.description}
                </p>
              </div>
            )}

            {listing.reason_for_sale && (
              <div className="space-y-2">
                <h3 className="font-heading text-base font-bold text-foreground">
                  Reason for Sale
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {listing.reason_for_sale}
                </p>
              </div>
            )}
          </div>

          {/* Tags Chips list */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Escrow Banner */}
          <div className="border-primary/20 bg-primary/5 space-y-4 rounded-xl border p-6">
            <h4 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
              <ShieldCheck className="h-5.5 w-5.5" /> Buyer Escrow Protection
            </h4>
            <ul className="list-inside list-disc space-y-2 text-xs text-muted-foreground">
              <li>
                Your checkout payment is held securely in Remote Jobs Hub's
                escrow account.
              </li>
              <li>
                Verification steps are completed by our team before releasing
                credentials.
              </li>
              <li>
                100% full money-back guarantee in case of transfer issues.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Seller Trust Card & Buying CTAs */}
        <div className="space-y-6 lg:col-span-4">
          {/* Action CTAs */}
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Price
              </span>
              <span className="flex items-center font-heading text-3xl font-extrabold text-foreground">
                <DollarSign className="h-8 w-8" />
                {Number(listing.price).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => {
                if (!user?.id) {
                  navigate(`/login?redirect=/listing/${listing.id}`)
                  return
                }
                setShowSummaryModal(true)
              }}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90"
            >
              Buy Asset Now
            </button>
            <button
              onClick={handleContactSeller}
              className="flex w-full items-center justify-center rounded-lg border border-border bg-background py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Contact Seller
            </button>
            <button
              onClick={() =>
                alert(
                  'Listing reported. Thank you for keeping Remote Jobs Hub safe.'
                )
              }
              className="flex w-full items-center justify-center gap-1.5 py-1.5 text-xs text-destructive hover:underline"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Report Listing
            </button>
          </div>

          {/* Seller Trust Profile Card */}
          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="border-border/50 border-b pb-3 font-heading text-sm font-bold text-foreground">
              Seller Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                {listing.seller?.avatar_url ? (
                  <img
                    src={listing.seller.avatar_url}
                    alt={listing.seller.full_name || 'Seller'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-bold text-muted-foreground">
                    {listing.seller?.full_name?.charAt(0) || 'S'}
                  </div>
                )}
              </div>
              <div>
                <h4 className="flex items-center gap-1 font-heading text-sm font-bold text-foreground">
                  {listing.seller?.full_name || 'Seller'}
                  {isSellerVerified && (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  )}
                </h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">
                    {listing.seller?.subscription_plan || 'Free'} Plan
                  </span>
                  {isSellerVerified && (
                    <>
                      <span className="bg-primary/10 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold text-primary">
                        <ShieldCheck className="h-2.5 w-2.5" /> Verified Seller
                      </span>
                      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">
                        🛡 Identity Verified
                      </span>
                    </>
                  )}
                  {listing.seller?.subscription_plan === 'pro' && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-500">
                      ⭐ Gold Seller
                    </span>
                  )}
                  {listing.seller?.subscription_plan === 'enterprise' && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-bold text-indigo-500">
                      💎 Premium Seller
                    </span>
                  )}
                </div>
              </div>
            </div>

            {listing.seller?.bio && (
              <p className="text-xs italic leading-relaxed text-muted-foreground">
                "{listing.seller.bio}"
              </p>
            )}

            {/* Seller specifications table details */}
            <div className="border-border/50 space-y-2 border-t pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seller Since:</span>
                <span className="font-bold text-foreground">
                  {listing.seller?.created_at
                    ? new Date(listing.seller.created_at).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              {listing.seller?.company_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-bold text-foreground">
                    {listing.seller.company_name}
                  </span>
                </div>
              )}
              {listing.seller?.company_website && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <a
                    href={listing.seller.company_website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Visit Site
                  </a>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-bold text-foreground">&lt; 2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="font-bold text-foreground">
                  100% Escrow Positive
                </span>
              </div>
            </div>
          </div>

          {/* Seller Reputation & Review Widget */}
          {sellerRating && (
            <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="border-border/50 flex items-center justify-between border-b pb-3 font-heading text-sm font-bold text-foreground">
                <span>Seller Reputation</span>
                <span className="bg-primary/10 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary">
                  Trust Score: {sellerRating.trust_score}/100
                </span>
              </h3>

              <div className="flex items-center gap-2.5">
                <div className="text-3xl font-extrabold text-foreground">
                  {sellerRating.average_rating}
                </div>
                <div className="space-y-0.5">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(sellerRating.average_rating)
                            ? 'fill-current'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-semibold text-muted-foreground">
                    Based on {sellerRating.total_reviews} reviews
                  </div>
                </div>
              </div>

              {/* Reputation tags badges */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[8px] font-extrabold uppercase tracking-wider">
                {sellerRating.is_verified_seller && (
                  <span className="bg-primary/10 border-primary/20 rounded border px-2 py-0.5 text-primary">
                    Verified Seller
                  </span>
                )}
                {sellerRating.average_rating >= 4.8 &&
                  sellerRating.completed_orders >= 5 && (
                    <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-amber-600">
                      Gold Seller
                    </span>
                  )}
                {sellerRating.trust_score >= 90 && (
                  <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
                    Top Seller
                  </span>
                )}
              </div>

              <div className="border-border/50 space-y-2 border-t pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    5-star rating rate:
                  </span>
                  <span className="font-bold text-foreground">
                    {sellerRating.five_star_percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Repeat Buyer count:
                  </span>
                  <span className="font-bold text-foreground">
                    {sellerRating.repeat_buyers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sales:</span>
                  <span className="font-bold text-foreground">
                    {sellerRating.completed_orders} orders
                  </span>
                </div>
              </div>

              {/* Reviews logs List */}
              <div className="border-border/50 space-y-3 border-t pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Latest Reviews ({listingReviews.length})
                </h4>
                {listingReviews.length === 0 ? (
                  <p className="py-2 text-center text-[11px] italic text-muted-foreground">
                    No reviews for this listing yet.
                  </p>
                ) : (
                  <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                    {listingReviews.map((rev: Review) => (
                      <div
                        key={rev.id}
                        className="bg-muted/20 space-y-1.5 rounded-lg border p-3"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-foreground">
                            {rev.buyer_profile?.full_name || 'Buyer'}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < rev.rating ? 'fill-current' : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <h5 className="text-[11px] font-bold leading-tight text-foreground">
                          {rev.title}
                        </h5>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          "{rev.review}"
                        </p>

                        {rev.seller_reply && (
                          <div className="mt-1.5 space-y-0.5 rounded border bg-background p-2 text-[10px]">
                            <span className="block font-bold text-foreground">
                              Seller Reply:
                            </span>
                            <p className="italic text-muted-foreground">
                              "{rev.seller_reply}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Listings Section */}
      {filteredRelated.length > 0 && (
        <div className="border-border/50 space-y-4 border-t pt-8">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Similar Account Listings
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredRelated.map((related) => (
              <MarketplaceListingCard
                key={related.id}
                listing={related}
                isFavorited={favorites.includes(related.id)}
                onToggleFavorite={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Toggle favorite callback
                  if (!user?.id) {
                    alert('Please log in to add listings to your favorites.')
                    return
                  }
                  listingService
                    .toggleFavorite(user.id, related.id)
                    .then((isFav) => {
                      setFavorites((prev) =>
                        isFav
                          ? [...prev, related.id]
                          : prev.filter((fid) => fid !== related.id)
                      )
                    })
                }}
              />
            ))}
          </div>
        </div>
      )}

      {showSummaryModal && (
        <PurchaseSummaryModal
          listing={listing}
          onClose={() => setShowSummaryModal(false)}
          onConfirmPurchase={handleConfirmPurchase}
        />
      )}
    </div>
  )
}
export default ListingDetailPage
