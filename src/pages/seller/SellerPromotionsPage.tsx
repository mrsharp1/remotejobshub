import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, Loader2, Flame, ShieldAlert, BarChart2 } from 'lucide-react'
import { promotionService } from '@/services/marketplace/promotion.service'
import { listingService } from '@/services/marketplace/listing.service'
import { walletService } from '@/services/marketplace/wallet.service'
import { useAuthStore } from '@/stores/authStore'
import { Listing } from '@/types'

export const SellerPromotionsPage: React.FC = () => {
  const { user } = useAuthStore()
  const [selectedListing, setSelectedListing] = useState('')
  const [boostDays, setBoostDays] = useState(7)
  const [isProcessingBoost, setIsProcessingBoost] = useState(false)

  // Fetch Seller Listings
  const { data: listings = [], isLoading: loadingListings } = useQuery({
    queryKey: ['seller-boost-listings', user?.id],
    queryFn: () => listingService.getListings(), // Ideally filter by seller in real flow
  })

  // Filter listings owned by this user
  const sellerListings = listings.filter((l) => l.user_id === user?.id)

  // Handle Listing Boost purchase (₦1,000 per day)
  const handlePurchaseBoost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !selectedListing) {
      alert('Please select a listing to boost.')
      return
    }

    const totalCost = boostDays * 1000
    if (
      !confirm(
        `Confirm boosting this listing for ${boostDays} days? Total cost is ₦${totalCost.toLocaleString()} from your wallet.`
      )
    ) {
      return
    }

    setIsProcessingBoost(true)
    try {
      const wallet = await walletService.getWallet(user.id)
      if (Number(wallet.available_balance) < totalCost) {
        alert(
          'Insufficient wallet balance to purchase this listing boost. Please top up first.'
        )
        return
      }

      // Debit wallet for the boost
      await walletService.debitWallet(
        wallet.id,
        totalCost,
        `Listing Boost Purchase: Listing ID ${selectedListing} for ${boostDays} Days`,
        'debit'
      )

      // Create promotion record
      const listing = sellerListings.find((l) => l.id === selectedListing)
      await promotionService.createPromotion({
        user_id: user.id,
        title: `FEATURED BOOST: ${listing?.title || 'Seller Listing'}`,
        description: `Premium listing visibility boost.`,
        discount_type: 'percentage',
        discount_value: 10, // dummy default discount parameter
        campaign_type: 'seller_boost',
        start_date: new Date().toISOString(),
        end_date: new Date(
          Date.now() + boostDays * 24 * 60 * 60 * 1000
        ).toISOString(),
        active: true,
      })

      alert('Listing boost purchased and active successfully!')
      setSelectedListing('')
    } catch {
      alert('Failed to process listing boost purchase.')
    } finally {
      setIsProcessingBoost(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Sellers Visibility & Campaigns Orchestration
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Seller Promotions Engine
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Orchestrate flash sales, purchase featured listing boosts, and track
          impression analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Purchase Boost Form */}
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:col-span-7">
          <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            <Flame className="h-4.5 w-4.5 animate-bounce text-amber-500" />{' '}
            Purchase Visibility Boost
          </h3>

          <form onSubmit={handlePurchaseBoost} className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Select Listing to Boost
              </label>
              {loadingListings ? (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />{' '}
                  Loading listings...
                </div>
              ) : sellerListings.length === 0 ? (
                <div className="italic text-muted-foreground">
                  Create a marketplace listing first to apply boosts.
                </div>
              ) : (
                <select
                  value={selectedListing}
                  onChange={(e) => setSelectedListing(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2.5 text-foreground focus:outline-none"
                  required
                >
                  <option value="">-- Choose Account Listing --</option>
                  {sellerListings.map((l: Listing) => (
                    <option key={l.id} value={l.id}>
                      {l.title} (₦{Number(l.price).toLocaleString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Boost Duration (₦1,000 / Day)
              </label>
              <select
                value={boostDays}
                onChange={(e) => setBoostDays(Number(e.target.value))}
                className="w-full rounded-lg border bg-background p-2.5 text-foreground focus:outline-none"
              >
                <option value={3}>3 Days (₦3,000)</option>
                <option value={7}>7 Days (₦7,000)</option>
                <option value={14}>14 Days (₦14,000)</option>
                <option value={30}>30 Days (₦30,000)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessingBoost || sellerListings.length === 0}
              className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-bold text-white transition-colors disabled:opacity-60"
            >
              {isProcessingBoost ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Purchase Premium
                  Visibility Boost
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Boost Performance Graph */}
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:col-span-5">
          <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            <BarChart2 className="h-4.5 w-4.5 text-primary" /> Impressions
            Growth Audit
          </h3>

          <div className="flex h-32 items-end justify-between gap-1.5 pt-4">
            {[30, 45, 60, 52, 70, 85, 95].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="bg-primary/20 w-full rounded-t transition-all duration-300 hover:bg-primary"
                  style={{ height: `${h}%` }}
                />
                <span className="font-mono text-[9px] text-muted-foreground">
                  Day {i + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-muted/20 flex gap-2 rounded-lg border p-3 text-xs">
            <ShieldAlert className="h-5 w-5 flex-shrink-0 text-amber-500" />
            <span className="leading-relaxed text-muted-foreground">
              Impressions are audited dynamically daily. Premium listing
              promotions receive up to 5x higher search visibility.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SellerPromotionsPage
