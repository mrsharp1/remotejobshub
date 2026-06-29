import React, { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from 'lucide-react'
import { listingService } from '@/services/marketplace/listing.service'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

// Components
import { MarketplaceHero } from '@/components/marketplace/MarketplaceHero'
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch'
import { CategoryGrid } from '@/components/marketplace/CategoryGrid'
import { FilterSidebar } from '@/components/marketplace/FilterSidebar'
import { ListingGrid } from '@/components/marketplace/ListingGrid'
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard'

export const MarketplacePage: React.FC = () => {
  const { user } = useAuthStore()
  const [keyword, setKeyword] = useState('')
  const [platform, setPlatform] = useState('')
  const [country, setCountry] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sellerVerified, setSellerVerified] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [favorites, setFavorites] = useState<string[]>([])
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

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
    if (keyword) {
      const query = keyword.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.platform.toLowerCase().includes(query) ||
          (l.description && l.description.toLowerCase().includes(query))
      )
    }

    // Country
    if (country) {
      result = result.filter((l) =>
        l.country.toLowerCase().includes(country.toLowerCase())
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
    keyword,
    platform,
    country,
    selectedPlatforms,
    minPrice,
    maxPrice,
    sellerVerified,
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
      a: 'Once a purchase is agreed, the funds are held securely in Remote Jobs Hub Escrow. The seller uploads credentials, our team verifies them, and guides both parties through the account ownership transfer.',
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
    <div className="space-y-12 pb-16">
      {/* Hero section */}
      <MarketplaceHero
        onBrowseClick={() => {
          const el = document.getElementById('search-grid-section')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <div
        id="search-grid-section"
        className="mx-auto max-w-7xl space-y-10 px-4"
      >
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

        {/* Featured Listings Carousel/Grid */}
        {featuredListings.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-foreground">
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
              <div className="border-destructive/20 bg-destructive/10 rounded-xl border p-6 text-center text-destructive">
                <p className="font-semibold">
                  Failed to load marketplace listings.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 rounded bg-destructive px-4 py-1.5 text-xs font-bold text-destructive-foreground"
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
              />
            )}
          </div>
        </div>

        {/* Verified Sellers spotlight section */}
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto max-w-xl space-y-2 text-center">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Verified Sellers Spotlight
            </h3>
            <p className="text-sm text-muted-foreground">
              Buyers deal with trustworthy professionals who undergo
              verification checks.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
              >
                <div className="bg-primary/10 rounded-full p-2 text-primary">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {seller.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    {seller.sales} • {seller.rate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safe Escrow / Buyer protection banner */}
        <div className="to-primary-hover flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-primary p-8 text-primary-foreground shadow-lg md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="flex items-center justify-center gap-2 font-heading text-xl font-extrabold md:justify-start">
              <ShieldCheck className="h-6 w-6" /> Escrow Buyer Protection
              Guaranteed
            </h3>
            <p className="max-w-xl text-sm opacity-90">
              We hold the purchase funds in escrow until the account ownership
              has been safely completed. Zero risk, verified transactions.
            </p>
          </div>
          <CheckCircle className="hidden h-12 w-12 opacity-80 md:block" />
        </div>

        {/* FAQs section */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <HelpCircle className="h-5 w-5 text-primary" /> Buyer Protection
            FAQs
          </h3>
          <div className="max-w-3xl space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="hover:bg-muted/30 flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-border/40 border-t px-4 pb-3 pt-2 text-xs leading-relaxed text-muted-foreground"
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
      </div>
    </div>
  )
}
export default MarketplacePage
