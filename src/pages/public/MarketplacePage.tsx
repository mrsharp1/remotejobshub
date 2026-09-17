import React, { useState, useMemo, useEffect, useRef } from 'react'
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
import { MarketplaceAnnouncementBar } from '@/components/marketplace/MarketplaceAnnouncementBar'
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
    if (selectedPlatforms.length > 0) {
      // Avoid duplicate param when a single platform is already represented by `platform`
      const singleMatch = selectedPlatforms.length === 1 && selectedPlatforms[0] === platform;
      if (!singleMatch) {
        params.set('platforms', selectedPlatforms.join(','));
      }
    }
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

  // Active filters count for compact mobile display (excluding default newest sort)
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (platform || selectedPlatforms.length > 0) count += 1
    if (country) count += 1
    if (minPrice || maxPrice) count += 1
    if (sellerVerified) count += 1
    if (sortBy && sortBy !== 'newest') count += 1
    if (featured) count += 1
    return count
  }, [platform, selectedPlatforms, country, minPrice, maxPrice, sellerVerified, sortBy, featured])

  // Scroll helper to smoothly position listings without being obscured by sticky header/announcement bar
  const scrollToResults = (smooth = true) => {
    const target =
      document.getElementById('marketplace-search-section') ||
      document.getElementById('marketplace-listings-section')
    if (!target) return

    // Dynamically measure sticky header (MainLayout h-16 = 64px) and announcement bar
    const headerHeight = 64
    const announcementEl = document.querySelector('aside[aria-label="Marketplace announcement"]')
    const announcementHeight = announcementEl ? announcementEl.getBoundingClientRect().height : 0
    const totalStickyOffset = headerHeight + announcementHeight + 16

    const elementPosition = target.getBoundingClientRect().top + window.scrollY
    const targetScrollTop = Math.max(0, elementPosition - totalStickyOffset)

    window.scrollTo({
      top: targetScrollTop,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }

  // Handle platform button selection with automatic scroll to listings
  const handleSelectPlatform = (plat: string) => {
    setPlatform(plat)
    if (plat) {
      setSelectedPlatforms([plat])
      setTimeout(() => {
        scrollToResults(true)
      }, 50)
    } else {
      setSelectedPlatforms([])
    }
  }

  // Auto-scroll on initial load when a platform filter is present in URL
  const hasAutoScrolledInitialRef = useRef(false)
  useEffect(() => {
    const initialPlatform = searchParams.get('platform') || searchParams.get('platforms')
    if (initialPlatform && !hasAutoScrolledInitialRef.current) {
      hasAutoScrolledInitialRef.current = true
      const timer = setTimeout(() => {
        scrollToResults(true)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

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
      result = result.filter((l) => selectedPlatforms.map(p => p.toLowerCase()).includes(l.platform.toLowerCase()))
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
    
  {
    q: 'Will there be a class after purchase?',
    a: `Yes. After your purchase, a link will be provided for you to join our practical class. In the class, you’ll be guided through:
• How to complete AI tasks
• How to create or set up your PayPal account
• How to withdraw your earnings

The goal is to help beginners understand the process and get started confidently.`
  },
  {
    q: 'Will a proxy be provided?',
    a: 'This depends on the account you choose. Please read the individual account listing carefully to see whether a proxy is included with your purchase.',
  },
  {
    q: 'After payment, can I start working immediately?',
    a: 'Yes. Once your account handoff is completed and you have everything you need, you can start working immediately if you choose to.',
  },
];

  return (
    <div className="min-h-screen bg-slate-950 pb-16 text-slate-300 selection:bg-indigo-500/30">
      {/* Sticky "Last Batch of the Year" Announcement Bar */}
      <MarketplaceAnnouncementBar />

      <div className="space-y-12">
        {/* Hero section */}
        <MarketplaceHero
        onBrowseClick={() => {
          const el = document.getElementById('search-grid-section')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <TrustBar />

      {/* Community Channels / Stay Connected Section */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Official Community Channels
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                Stay Connected With Remote Jobs Hub
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-400">
                Stay updated with new account opportunities, marketplace updates, important announcements, and helpful resources. Join our community and never miss an update.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href="https://whatsapp.com/channel/0029Vb8iwJJ3gvWctviMHX0B"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30 active:scale-95"
              >
                <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Join Our WhatsApp Channel
              </a>

            </div>
          </div>
        </div>
      </div>

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
          onSelectCategory={handleSelectPlatform}
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
        <div id="marketplace-search-section" className="relative z-20 -mx-4 px-4 py-2 sm:py-3 md:py-4">
          <MarketplaceSearch
            keyword={keyword}
            onKeywordChange={setKeyword}
            platform={platform}
            onPlatformChange={handleSelectPlatform}
            country={country}
            onCountryChange={setCountry}
            onToggleFilterDrawer={() => setIsFilterDrawerOpen(true)}
            activeFiltersCount={activeFiltersCount}
            selectedPlatforms={selectedPlatforms}
          />
        </div>

        {/* Search Results / Main Filter Grid */}
        <div
          id="marketplace-listings-section"
          className="grid grid-cols-1 gap-8 md:grid-cols-12 scroll-mt-28 md:scroll-mt-32"
        >
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
              country={country}
              onCountryChange={setCountry}
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
      </div>

      {/* Comparison Bar (sticky bottom) */}
      <ComparisonBar />
      {/* Comparison Modal */}
      <ListingComparison />
    </div>
  )
}
export default MarketplacePage
