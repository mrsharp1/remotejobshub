import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Globe, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Listing } from '@/types'

interface MarketplaceListingCardProps {
  listing: Listing
  isFavorited: boolean
  onToggleFavorite: (e: React.MouseEvent) => void
}

export const MarketplaceListingCard: React.FC<MarketplaceListingCardProps> = ({
  listing,
  isFavorited,
  onToggleFavorite,
}) => {
  const thumbnail =
    listing.images && listing.images.length > 0
      ? listing.images[0].image_url
      : null

  const isSellerVerified = listing.seller?.seller_verified || false

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <Globe className="h-8 w-8" />
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">
              {listing.platform}
            </span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {listing.platform}
          </span>
          {isSellerVerified && (
            <span className="inline-flex items-center gap-0.5 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              <ShieldCheck className="h-3 w-3" /> Verified Seller
            </span>
          )}
        </div>

        {/* Favorite Trigger */}
        <button
          onClick={onToggleFavorite}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
        >
          <Heart
            className={`h-4 w-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
          />
        </button>
      </div>

      {/* Info details */}
      <div className="flex flex-1 flex-col justify-between space-y-4 p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span className="font-semibold">{listing.country}</span>
            <span>•</span>
            <span>Age: {listing.account_age || 'N/A'}</span>
          </div>
          <h4 className="line-clamp-2 font-heading text-sm font-bold text-foreground">
            {listing.title}
          </h4>
        </div>

        <div className="space-y-3 pt-2">
          {/* Income block */}
          {listing.monthly_income !== undefined && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Monthly Income:</span>
              <span className="font-bold text-foreground">
                ${Number(listing.monthly_income).toLocaleString()}/mo
              </span>
            </div>
          )}

          {/* Pricing and Action row */}
          <div className="border-border/50 flex items-center justify-between border-t pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Price
              </span>
              <span className="flex items-center font-heading text-base font-extrabold text-primary">
                <DollarSign className="h-4 w-4" />
                {Number(listing.price).toLocaleString()}
              </span>
            </div>
            <Link
              to={`/listing/${listing.id}`}
              className="hover:bg-secondary/80 inline-flex items-center gap-1 rounded bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors"
            >
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
