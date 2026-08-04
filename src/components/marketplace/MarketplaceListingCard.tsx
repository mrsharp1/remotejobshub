import React from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Globe,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  ArrowRightLeft,
  Flame,
  Sparkles,
  BadgeCheck,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Listing } from '@/types'
import { OptimizedImage } from '@/components/shared/OptimizedImage'
import { useComparisonStore } from '@/stores/comparisonStore'
import { TrustRibbon } from '@/components/shared/TrustRibbon'
import { springs } from '@/lib/framer-physics'

interface MarketplaceListingCardProps {
  listing: Listing
  isFavorited: boolean
  onToggleFavorite: (e: React.MouseEvent) => void
}

type IntelligenceLabel = {
  label: string
  icon: React.ElementType
  color: string
  bg: string
}

function computeIntelligenceLabel(listing: Listing): IntelligenceLabel | null {
  const isVerifiedPremium =
    listing.identity_verified &&
    listing.seller?.seller_verified &&
    listing.original_email_included
  const isBestValue =
    listing.monthly_income &&
    listing.price > 0 &&
    listing.monthly_income / listing.price > 0.25
  const isTrending = listing.views > 50
  const isFastSelling = listing.favorites_count > 10
  const isNew =
    Date.now() - new Date(listing.created_at).getTime() <
    1000 * 60 * 60 * 24 * 3
  const isFeatured = listing.is_featured

  if (isFeatured)
    return {
      label: "Editor's Choice",
      icon: Sparkles,
      color: 'text-violet-300',
      bg: 'bg-violet-500/20 border-violet-500/30',
    }
  if (isVerifiedPremium)
    return {
      label: 'Verified Premium',
      icon: BadgeCheck,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20 border-emerald-500/30',
    }
  if (isBestValue)
    return {
      label: 'Best Value',
      icon: Zap,
      color: 'text-amber-300',
      bg: 'bg-amber-500/20 border-amber-500/30',
    }
  if (isTrending)
    return {
      label: 'Trending',
      icon: Flame,
      color: 'text-rose-300',
      bg: 'bg-rose-500/20 border-rose-500/30',
    }
  if (isFastSelling)
    return {
      label: 'Fast Selling',
      icon: TrendingUp,
      color: 'text-blue-300',
      bg: 'bg-blue-500/20 border-blue-500/30',
    }
  if (isNew)
    return {
      label: 'New Listing',
      icon: Sparkles,
      color: 'text-indigo-300',
      bg: 'bg-indigo-500/20 border-indigo-500/30',
    }
  return null
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
  const sellerAvatar = listing.seller?.avatar_url
  const intelligenceLabel = computeIntelligenceLabel(listing)

  const { addToCompare, removeFromCompare, isInCompare } = useComparisonStore()
  const inCompare = isInCompare(listing.id)

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(listing.id)
    } else {
      addToCompare(listing)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8, transition: springs.gentle }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {listing.seller?.subscription_plan === 'enterprise' && (
          <TrustRibbon type="premium" />
        )}
        {isSellerVerified &&
          listing.seller?.subscription_plan !== 'enterprise' && (
            <TrustRibbon type="verified" />
          )}

        {thumbnail ? (
          <OptimizedImage
            src={thumbnail}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-slate-900 text-slate-500">
            <Globe className="h-10 w-10 opacity-50" />
            <span className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
              {listing.platform}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

        {/* Intelligence Label (Top Left) */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          <span className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
            {listing.platform}
          </span>
          {intelligenceLabel && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold shadow-lg backdrop-blur-md ${intelligenceLabel.bg} ${intelligenceLabel.color}`}
            >
              <intelligenceLabel.icon className="h-3 w-3" />
              {intelligenceLabel.label}
            </span>
          )}
        </div>

        {/* Top Right: Favorite + Compare */}
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.8, transition: springs.snappy }}
            onClick={onToggleFavorite}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-rose-500/50 hover:bg-slate-900"
            aria-label={
              isFavorited ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Heart
              className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8, transition: springs.snappy }}
            onClick={handleCompare}
            title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
            className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all hover:scale-110 ${
              inCompare
                ? 'border-indigo-500/60 bg-indigo-500 text-white'
                : 'border-white/10 bg-slate-950/60 text-white hover:border-indigo-500/50 hover:bg-slate-900'
            }`}
            aria-label="Compare listing"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Bottom Image Stats overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-slate-800 shadow-lg">
              {sellerAvatar ? (
                <img
                  src={sellerAvatar}
                  alt="Seller"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {listing.seller?.full_name?.charAt(0) || 'S'}
                </span>
              )}
            </div>
            {isSellerVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 shadow-lg backdrop-blur-md">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info details */}
      <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Globe className="h-4 w-4 text-indigo-400" />
            <span>{listing.country}</span>
            <span className="mx-1 text-white/20">•</span>
            <span>Age: {listing.account_age || 'N/A'}</span>
          </div>
          <h4 className="line-clamp-2 font-heading text-lg font-black leading-snug text-white transition-colors group-hover:text-indigo-300">
            {listing.title}
          </h4>
        </div>

        <div className="space-y-5 pt-2">
          {/* Income block */}
          {listing.monthly_income !== undefined && (
            <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 shadow-inner">
              <TrendingUp className="h-4 w-4" />
              <span>
                ₦{Number(listing.monthly_income).toLocaleString()}/mo Revenue
              </span>
            </div>
          )}

          {/* Pricing and Action row */}
          <div className="flex items-end justify-between pt-1">
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Asking Price
              </span>
              <span className="flex items-center font-heading text-2xl font-black tracking-tight text-white">
                <span className="text-indigo-400 mr-0.5 font-sans font-bold">₦</span>
                {Number(listing.price).toLocaleString()}
              </span>
            </div>
            <motion.div whileTap={{ scale: 0.95, transition: springs.snappy }}>
              <Link
                to={`/listing/${listing.id}`}
                className="group/btn inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.8)]"
              >
                View Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center gap-2 border-t border-white/5 pt-4 text-xs font-semibold text-slate-400">
            <ShieldCheck className="h-4 w-4 text-purple-400" /> 
            Smart Escrow Vault Included
          </div>
        </div>
      </div>
    </motion.div>
  )
}
