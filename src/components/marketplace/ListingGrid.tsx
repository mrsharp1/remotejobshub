import React from 'react'
import { Listing } from '@/types'
import { MarketplaceListingCard } from './MarketplaceListingCard'
import { LoadingSkeleton } from './LoadingSkeleton'
import { EmptyState } from './EmptyState'

interface ListingGridProps {
  listings: Listing[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  loading: boolean
  onResetFilters?: () => void
  onTryAnotherPlatform?: () => void
  onTryAnotherCountry?: () => void
}

export const ListingGrid: React.FC<ListingGridProps> = ({
  listings,
  favorites,
  onToggleFavorite,
  loading,
  onResetFilters,
  onTryAnotherPlatform,
  onTryAnotherCountry,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <LoadingSkeleton key={idx} />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        onResetFilters={onResetFilters}
        onTryAnotherPlatform={onTryAnotherPlatform}
        onTryAnotherCountry={onTryAnotherCountry}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
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
  )
}
