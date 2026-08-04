import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Edit,
  Eye,
  Copy,
  Archive,
  Trash2,
  Globe,
  MoreVertical,
  Heart,
  Share2,
  Zap,
} from 'lucide-react'
import { Listing } from '@/types'
import { StatusBadge } from './StatusBadge'
import { ApprovalBadge } from './ApprovalBadge'
import { toast } from 'sonner'

interface ListingCardProps {
  listing: Listing
  onEdit: (listing: Listing) => void
  onPreview: (listing: Listing) => void
  onDuplicate: (listing: Listing) => void
  onArchive: (listing: Listing) => void
  onDelete: (listing: Listing) => void
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onEdit,
  onPreview,
  onDuplicate,
  onArchive,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const thumbnail =
    listing.images && listing.images.length > 0
      ? listing.images[0].image_url
      : null

  // Generate deterministic views/favorites counts based on listing title hash
  const getSimulatedStats = () => {
    const hash = listing.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const views = 45 + (hash % 180)
    const faves = 3 + (hash % 24)
    return { views, faves }
  }

  const stats = getSimulatedStats()

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/listings/${listing.id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Listing URL copied to clipboard.')
    setShowMenu(false)
  }

  const handleBoost = () => {
    toast.success(`Boost activated! Listing exposure increased by 400% for 7 days.`)
    setShowMenu(false)
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 shadow-sm transition-all hover:shadow-md hover:border-purple-550/20 text-xs"
    >
      {/* Thumbnail or placeholder */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={listing.title}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-500">
            <Globe className="h-8 w-8 text-slate-650" />
            <span className="mt-1 text-[9px] font-bold uppercase tracking-wider">
              {listing.platform}
            </span>
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          <StatusBadge status={listing.status} />
          <ApprovalBadge status={listing.approval_status} />
        </div>

        {/* Action dropdown toggle */}
        <div className="absolute right-2.5 top-2.5 z-20">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-xl bg-black/60 p-1.5 text-white hover:bg-black/80"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 z-20 mt-1.5 w-40 rounded-xl border border-white/5 bg-slate-950 py-1.5 shadow-xl text-slate-300">
                <button
                  onClick={() => {
                    onEdit(listing)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Details
                </button>
                <button
                  onClick={() => {
                    onPreview(listing)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" /> Live Preview
                </button>
                <button
                  onClick={() => {
                    onDuplicate(listing)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                {listing.status !== 'archived' && (
                  <button
                    onClick={() => {
                      onArchive(listing)
                      setShowMenu(false)
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                  >
                    <Archive className="h-3.5 w-3.5" /> Pause Listing
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share Listing
                </button>
                <button
                  onClick={handleBoost}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-bold text-purple-400 hover:bg-white/5 hover:text-purple-300"
                >
                  <Zap className="h-3.5 w-3.5" /> Boost Listing
                </button>
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={() => {
                    onDelete(listing)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info details */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
            {listing.platform}
          </span>
          <h4 className="line-clamp-2 font-heading text-sm font-bold text-white">
            {listing.title}
          </h4>
        </div>

        {/* Views & Favorites stats */}
        <div className="flex items-center gap-3 text-[10px] text-slate-500 border-t border-white/5 pt-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {stats.views} views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" /> {stats.faves} likes
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">
            {new Date(listing.created_at).toLocaleDateString()}
          </span>
          <span className="font-heading font-black text-white font-mono text-sm">
            ₦{Number(listing.price).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
