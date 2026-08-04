import React from 'react'
import { Sparkles } from 'lucide-react'
import type { Listing } from '@/types'
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard'

interface SimilarListingsProps {
  listings: Listing[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export const SimilarListings: React.FC<SimilarListingsProps> = ({ listings, favorites, onToggleFavorite }) => {
  if (!listings || listings.length === 0) return null

  return (
    <div className="space-y-6 pt-12">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <h2 className="font-heading text-2xl font-black text-white">Recommended Similar Assets</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.slice(0, 3).map((listing) => (
          <MarketplaceListingCard
            key={listing.id}
            listing={listing}
            isFavorited={favorites.includes(listing.id)}
            onToggleFavorite={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite(listing.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
