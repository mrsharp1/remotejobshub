import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Sparkles,
} from 'lucide-react'
import { listingService } from '@/services/marketplace/listing.service'
import { recommendationService } from '@/services/marketplace/recommendation.service'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

// Components
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero'
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch'
import { CategoryGrid } from '@/components/marketplace/CategoryGrid'
import { FilterSidebar } from '@/components/marketplace/FilterSidebar'
import { ListingGrid } from '@/components/marketplace/ListingGrid'
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard'
import { TrustBar } from '@/components/marketplace/TrustBar'
import { useDebounce } from '@/hooks/useDebounce'
import { BuyerProtectionBanner } from '@/components/shared/BuyerProtectionBanner'
import {
  ListingComparison,
  ComparisonBar,
} from '@/components/marketplace/intelligence/ListingComparison'
import { MarketplaceHighlights } from '@/components/marketplace/conversion/MarketplaceHighlights'
import { RecentlyViewedSection } from '@/components/marketplace/conversion/RecentlyViewedSection'
import { WrittenReviews } from '@/components/home/WrittenReviews'
import { VideoTestimonials } from '@/components/home/VideoTestimonials'

export const MarketplacePage: React.FC = () => {
  const { user } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [platform, setPlatform] = useState(searchParams.get('platform') || '')
  const [country, setCountry] = useState(searchParams.get('country') || '')
  
  const platformsParam = searchParams.get('platforms')
  const initialPlatforms = platformsParam ? platformsParam.split(',') : []
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialPlatforms)
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sellerVerified, setSellerVerified] = useState(searchParams.get('seller_verified') === 'true')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true')
  
  const [favorites, setFavorites] = useState<string[]>([])
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Sync state back to URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (platform) params.set('platform', platform)
    if (country) params.set('country', country)
    if (selectedPlatforms.length > 0) params.set('platforms', selectedPlatforms.join(','))
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sellerVerified) params.set('seller_verified', 'true')
    if (sortBy !== 'newest') params.set('sort', sortBy)
    if (featured) params.set('featured', 'true')
    
    // Only update if params actually changed to prevent infinite loops
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true })
    }
  }, [keyword, platform, country, selectedPlatforms, minPrice, maxPrice, sellerVerified, sortBy, featured, setSearchParams, searchParams])

  const debouncedKeyword = useDebounce(keyword, 400)
  const debouncedCountry = useDebounce(country, 400)

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)

  // Fetch approved published listings
  const {
    data: rawListings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['public-listings'],
    queryFn: () => listingService.getListings(),
  })

  // AI queries
  const { data: trendingList = [] } = useQuery({
    queryKey: ['trending-listings'],
    queryFn: () => recommendationService.getTrendingListings(),
  })

  const { data: recommendedList = [] } = useQuery({
    queryKey: ['recommended-listings', user?.id],
    queryFn: () =>
      user?.id ? recommendationService.getRecommendedListings(user.id) : [],
    enabled: !!user?.id,
  })

  const { data: recentlyViewed = [] } = useQuery({
    queryKey: ['recently-viewed-listings', user?.id],
    queryFn: () =>
      user?.id ? recommendationService.getRecentlyViewed(user.id) : [],
    enabled: !!user?.id,
  })

  // Fetch initial favorites list if authenticated
  useEffect(() => {
    if (!user?.id) return
    const getFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id)
        if (error) throw error
        if (data) {
          setFavorites(data.map((f) => f.listing_id))
        }
      } catch (err) {
        console.error('Failed to load favorites:', err)
      }
    }
    getFavorites()
  }, [user?.id])

  // Filter callback for toggling checks
  const handleTogglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    )
  }

  // Clear filters
  const handleClearFilters = () => {
    setKeyword('')
    setPlatform('')
    setCountry('')
    setSelectedPlatforms([])
    setMinPrice('')
    setMaxPrice('')
    setSellerVerified(false)
    setSortBy('newest')
    setFeatured(false)
  }

  // Toggle favorite trigger
  const handleToggleFavorite = async (listingId: string) => {
    if (!user?.id) {
      alert('Please log in to add listings to your favorites.')
      return
    }

    try {
      const isFav = await listingService.toggleFavorite(user.id, listingId)
      setFavorites((prev) =>
        isFav ? [...prev, listingId] : prev.filter((id) => id !== listingId)
      )
    } catch (err) {
      console.error(err)
    }
  }

  // Client-side memoized filter/search logic
  const filteredListings = useMemo(() => {
    let result = [...rawListings]

    // Platform category tag filter
    if (platform) {
      result = result.filter(
        (l) => l.platform.toLowerCase() === platform.toLowerCase()
      )
    }

    // Platform checkbox lists
    if (selectedPlatforms.length > 0) {
      result = result.filter((l) => selectedPlatforms.includes(l.platform))
    }

    // Search keywords
    if (debouncedKeyword) {
      const query = debouncedKeyword.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.platform.toLowerCase().includes(query) ||
          (l.description && l.description.toLowerCase().includes(query))
      )
    }

    // Country
    if (debouncedCountry) {
      result = result.filter((l) =>
        l.country.toLowerCase().includes(debouncedCountry.toLowerCase())
      )
    }

    // Price Bounds
    if (minPrice) {
      result = result.filter((l) => Number(l.price) >= Number(minPrice))
    }
    if (maxPrice) {
      result = result.filter((l) => Number(l.price) <= Number(maxPrice))
    }

    // Verification check
    if (sellerVerified) {
      result = result.filter((l) => l.seller?.seller_verified === true)
    }

    // Featured check
    if (featured) {
      result = result.filter((l) => l.is_featured === true)
    }

    // Sorting Modes
    if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } else if (sortBy === 'income-desc') {
      result.sort(
        (a, b) => Number(b.monthly_income || 0) - Number(a.monthly_income || 0)
      )
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price))
    } else if (sortBy === 'best-value') {
      result.sort((a, b) => {
        const aROI = a.price > 0 ? Number(a.monthly_income || 0) / Number(a.price) : 0
        const bROI = b.price > 0 ? Number(b.monthly_income || 0) / Number(b.price) : 0
        return bROI - aROI
      })
    } else if (sortBy === 'rating') {
      // Sort by seller rating if available. Fallback to featured or price.
      // Currently `Listing` lacks direct rating field, so we prioritize verified sellers and featured status.
      result.sort((a, b) => {
        const aScore = (a.seller?.seller_verified ? 2 : 0) + (a.is_featured ? 1 : 0)
        const bScore = (b.seller?.seller_verified ? 2 : 0) + (b.is_featured ? 1 : 0)
        return bScore - aScore
      })
    } else if (sortBy === 'recommended') {
      // Prioritize featured, high income, verified
      result.sort((a, b) => {
        const aScore = (a.is_featured ? 100 : 0) + (a.seller?.seller_verified ? 50 : 0) + Number(a.monthly_income || 0) / 10
        const bScore = (b.is_featured ? 100 : 0) + (b.seller?.seller_verified ? 50 : 0) + Number(b.monthly_income || 0) / 10
        return bScore - aScore
      })
    }

    // Boost Verified Sellers search rankings
    result.sort((a, b) => {
      const aVerified = a.seller?.seller_verified ? 1 : 0
      const bVerified = b.seller?.seller_verified ? 1 : 0
      if (aVerified !== bVerified) {
        return bVerified - aVerified
      }
      return 0
    })

    return result
  }, [
    rawListings,
    debouncedKeyword,
    platform,
    debouncedCountry,
    selectedPlatforms,
    minPrice,
    maxPrice,
    sellerVerified,
    featured,
    sortBy,
  ])

  // Featured listings (is_featured = true or fallback to first 3 published listings)
  const featuredListings = useMemo(() => {
    const featured = rawListings.filter((l) => l.is_featured === true)
    return featured.length > 0 ? featured.slice(0, 3) : rawListings.slice(0, 3)
  }, [rawListings])

  const faqs = [
    {
      q: 'How does the account handoff work?',
      a: 'Once a purchase is agreed upon, the funds are held securely in the Remote Jobs Hub Escrow vault, protected by Paystack. Once payment is made, the account information is displayed so the buyer can access the account.',
    },
    {
      q: 'Are the accounts verified?',
      a: 'Yes, listings require verification details. Verified sellers also pass ID checks to earn trust credentials.',
    },
    {
      q: 'Is there buyer protection?',
      a: 'Absolutely. If the account is not successfully transferred or does not match the description, the buyer receives a full refund from escrow.',
    },
  ]

  return (
    <div className="min-h-screen space-y-12 bg-slate-950 pb-16 text-slate-300 selection:bg-indigo-500/30">
      {/* Hero section */}
      <MarketplaceHero
        onBrowseClick={() => {
          const el = document.getElementById('search-grid-section')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <TrustBar />

      {/* Buyer Protection Banner */}
      <BuyerProtectionBanner
        variant="horizontal"
        className="mx-auto max-w-7xl px-4"
      />

      <div
        id="search-grid-section"
        className="mx-auto max-w-7xl space-y-10 px-4"
      >
        <MarketplaceHighlights />

        {/* Live categories grid selection */}
        <CategoryGrid
          activeCategory={platform}
          onSelectCategory={(plat) => {
            setPlatform(plat)
            // Add or clear from selected list
            if (plat) {
              setSelectedPlatforms([plat])
            } else {
              setSelectedPlatforms([])
            }
          }}
        />

        {/* AI Recommendations Section */}
        {user?.id && recommendedList.length > 0 && (
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse text-indigo-400" />
              <h3 className="font-heading text-xl font-black text-white">
                Recommended For You
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedList.slice(0, 3).map((listing) => (
                <MarketplaceListingCard
                  key={`recommended-${listing.id}`}
                  listing={listing}
                  isFavorited={favorites.includes(listing.id)}
                  onToggleFavorite={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleFavorite(listing.id)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {trendingList.length > 0 && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-heading text-xl font-black text-white">
              Trending Accounts
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trendingList.slice(0, 3).map((listing) => (
                <MarketplaceListingCard
                  key={`trending-${listing.id}`}
                  listing={listing}
                  isFavorited={favorites.includes(listing.id)}
                  onToggleFavorite={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleFavorite(listing.id)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Continue Browsing / Recently Viewed */}
        {user?.id && recentlyViewed.length > 0 && (
          <div className="bg-muted/10 space-y-4 rounded-xl border border-t border-dashed p-4 pt-6">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Continue Browsing / Recently Viewed
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewed.slice(0, 4).map((listing) => (
                <div
                  key={`recent-view-${listing.id}`}
                  className="space-y-1 rounded-lg border bg-card p-3 text-xs"
                >
                  <span className="block truncate font-bold text-foreground">
                    {listing.title}
                  </span>
                  <span className="block font-mono text-primary">
                    ₦{Number(listing.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Listings Carousel/Grid */}
        {featuredListings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-black text-white">
              Featured Asset Opportunities
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((listing) => (
                <MarketplaceListingCard
                  key={`featured-${listing.id}`}
                  listing={listing}
                  isFavorited={favorites.includes(listing.id)}
                  onToggleFavorite={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleFavorite(listing.id)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search Control elements */}
        <div className="sticky top-0 z-40 -mx-4 bg-slate-950/80 px-4 py-4 backdrop-blur-2xl">
          <MarketplaceSearch
            keyword={keyword}
            onKeywordChange={setKeyword}
            platform={platform}
            onPlatformChange={(plat) => {
              setPlatform(plat)
              if (plat) {
                setSelectedPlatforms([plat])
              } else {
                setSelectedPlatforms([])
              }
            }}
            country={country}
            onCountryChange={setCountry}
            onToggleFilterDrawer={() => setIsFilterDrawerOpen(true)}
          />
        </div>

        {/* Search Results / Main Filter Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Filters Sidebar */}
          <div className="md:col-span-3">
            <FilterSidebar
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={handleTogglePlatform}
              minPrice={minPrice}
              onMinPriceChange={setMinPrice}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              sellerVerified={sellerVerified}
              onSellerVerifiedChange={setSellerVerified}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onClearFilters={handleClearFilters}
              isOpen={isFilterDrawerOpen}
              onClose={() => setIsFilterDrawerOpen(false)}
            />
          </div>

          {/* Listings List grid */}
          <div className="space-y-6 md:col-span-9">
            {isError ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-rose-400 backdrop-blur-md">
                <p className="font-semibold">
                  Failed to load marketplace listings.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 rounded-xl bg-rose-500/20 px-6 py-2 text-sm font-bold text-rose-300 transition-colors hover:bg-rose-500/30"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <ListingGrid
                listings={filteredListings}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                loading={isLoading}
                onResetFilters={handleClearFilters}
                onTryAnotherPlatform={() => {
                  setPlatform('')
                  setSelectedPlatforms([])
                  setKeyword('')
                }}
                onTryAnotherCountry={() => {
                  setCountry('')
                  setKeyword('')
                }}
              />
            )}
          </div>
        </div>

        {/* Verified Sellers spotlight section */}
        <div className="relative space-y-8 rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent opacity-50" />
          <div className="relative z-10 mx-auto max-w-xl space-y-3 text-center">
            <h3 className="font-heading text-3xl font-black text-white">
              Verified Sellers Spotlight
            </h3>
            <p className="text-base text-slate-400">
              Buyers deal with trustworthy professionals who undergo strict
              KYC verification checks.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                name: 'Alex K.',
                sales: '14 successful Escrows',
                rate: '100% positive reviews',
              },
              {
                name: 'Sarah M.',
                sales: '9 successful Escrows',
                rate: '100% positive reviews',
              },
              {
                name: 'David L.',
                sales: '23 successful Escrows',
                rate: '98% positive reviews',
              },
            ].map((seller, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950/60 p-5 shadow-lg transition-colors hover:border-white/10 hover:bg-slate-900"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-inner">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {seller.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400">
                    {seller.sales} <br /> {seller.rate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safe Escrow / Buyer protection banner */}
        <div className="group relative flex flex-col items-center justify-between gap-8 rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-900/60 to-purple-900/40 p-10 shadow-2xl backdrop-blur-xl md:flex-row md:p-12">
          <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h3 className="flex items-center justify-center gap-3 font-heading text-3xl font-black text-white md:justify-start">
              <ShieldCheck className="h-8 w-8 text-indigo-400" /> Escrow Buyer Protection
            </h3>
            <p className="max-w-xl text-base leading-relaxed text-indigo-200/80">
              We hold the purchase funds in a secure smart escrow vault until the account ownership
              has been safely verified and completed. Zero risk, 100% guaranteed.
            </p>
          </div>
          <CheckCircle className="relative z-10 hidden h-20 w-20 text-indigo-500/40 transition-transform duration-700 group-hover:scale-110 md:block" />
        </div>

        {/* FAQs section */}
        <div className="space-y-8 pt-8">
          <h3 className="flex items-center gap-3 font-heading text-2xl font-black text-white">
            <HelpCircle className="h-6 w-6 text-indigo-400" /> Buyer Protection FAQs
          </h3>
          <div className="max-w-3xl space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 shadow-lg backdrop-blur-md transition-colors hover:bg-slate-900/60"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-bold text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-indigo-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 px-6 pb-6 pt-2 text-sm leading-relaxed text-slate-400"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        <RecentlyViewedSection />
        
        {/* Marketplace Reviews Section */}
        <div className="space-y-4">
          <WrittenReviews location="marketplace" />
          <VideoTestimonials location="marketplace" />
        </div>
      </div>

      {/* Comparison Bar (sticky bottom) */}
      <ComparisonBar />
      {/* Comparison Modal */}
      <ListingComparison />
    </div>
  )
}
export default MarketplacePage
