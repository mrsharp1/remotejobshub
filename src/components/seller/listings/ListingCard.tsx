import React, { useState } from 'react'
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
  BarChart3,
} from 'lucide-react'
import { Listing } from '@/types'
import { formatCurrency } from '@/utils/currency'
import { StatusBadge } from '../studio/StatusBadge'
import { ModerationTimeline } from './ModerationTimeline'
import { EscrowStatusPanel } from './EscrowStatusPanel'
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
  const [showAnalytics, setShowAnalytics] = useState(false)

  const thumbnail =
    listing.images && listing.images.length > 0
      ? listing.images[0].image_url
      : null

  // Generate deterministic views/favorites counts based on listing title hash
  const getSimulatedStats = () => {
    const hash = listing.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const views = 145 + (hash % 880)
    const faves = 12 + (hash % 120)
    const ctr = 1.8 + (hash % 8) / 10
    const visits = Math.round(views * (ctr / 100))
    const watchTime = 12 + (hash % 40)
    const trendingScore = 55 + (hash % 45)
    return { views, faves, ctr, visits, watchTime, trendingScore }
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

  // Parse simulated escrow status: if sold -> released or locked.
  const escrowState = listing.status === 'sold' ? 'released' : 'waiting'

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-purple-550/20 text-xs text-foreground">
      <div className="flex flex-col md:flex-row gap-5 p-5">
        
        {/* Left Side: Thumbnail info */}
        <div className="relative aspect-video w-full md:w-44 overflow-hidden rounded-xl bg-muted shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Globe className="h-7 w-7 text-muted-foreground/60" />
              <span className="mt-1 text-[9px] font-bold uppercase tracking-wider">
                {listing.platform}
              </span>
            </div>
          )}

          <div className="absolute left-2 top-2 flex gap-1">
            <StatusBadge status={listing.status} />
          </div>
        </div>

        {/* Center: Listing Description metadata */}
        <div className="flex-1 space-y-3.5 min-w-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              <span>{listing.platform}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span>{listing.country || 'Global'}</span>
            </div>
            <h4 className="font-heading text-sm font-bold text-foreground leading-snug break-words">{listing.title}</h4>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
            <span className="rounded-lg bg-muted px-2.5 py-1">Monthly Rev: {formatCurrency(Number(listing.monthly_income || 0))}</span>
            <span className="rounded-lg bg-muted px-2.5 py-1">Age: {listing.account_age || 'N/A'}</span>
            <span className="rounded-lg bg-muted px-2.5 py-1 font-bold text-foreground">Price: {formatCurrency(Number(listing.price))}</span>
          </div>

          <div className="flex items-center gap-3.5 text-[10px] text-muted-foreground pt-1 flex-wrap">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {stats.views} Views</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {stats.faves} Saves</span>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold ml-auto"
            >
              <BarChart3 className="h-3.5 w-3.5" /> {showAnalytics ? 'Hide Performance' : 'View Analytics'}
            </button>
          </div>
        </div>

        {/* Right Action Menu dropdown */}
        <div className="relative self-start md:self-center ml-auto shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-xl border border-border bg-muted hover:bg-muted/80 p-2 text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 z-20 mt-1.5 w-40 rounded-xl border border-border bg-card py-1.5 shadow-xl text-foreground">
                <button
                  onClick={() => { onEdit(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-muted hover:text-foreground"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit details
                </button>
                <button
                  onClick={() => { onPreview(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-muted hover:text-foreground"
                >
                  <Eye className="h-3.5 w-3.5" /> Live Preview
                </button>
                <button
                  onClick={() => { onDuplicate(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-muted hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                {listing.status !== 'archived' && (
                  <button
                    onClick={() => { onArchive(listing); setShowMenu(false) }}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-muted hover:text-foreground"
                  >
                    <Archive className="h-3.5 w-3.5" /> Pause listing
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-muted hover:text-foreground"
                >
                  <Share2 className="h-3.5 w-3.5" /> Copy Link
                </button>
                <button
                  onClick={handleBoost}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-muted hover:text-purple-700 dark:hover:text-purple-300"
                >
                  <Zap className="h-3.5 w-3.5" /> Boost Exposure
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => { onDelete(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Expandable performance analytics details */}
      {showAnalytics && (
        <div className="border-t border-border bg-muted/40 p-5 space-y-5 animate-in slide-in-from-top duration-300">
          <div>
            <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Analytics breakdown</h5>
            <p className="text-[9px] text-muted-foreground/80">Real-time search and traffic values</p>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <div className="rounded-xl bg-muted/60 p-3 border border-border">
              <span className="block text-[8px] font-bold text-muted-foreground uppercase">Click-Through Rate</span>
              <span className="block text-sm font-black text-foreground font-mono mt-1">{stats.ctr}%</span>
            </div>
            <div className="rounded-xl bg-muted/60 p-3 border border-border">
              <span className="block text-[8px] font-bold text-muted-foreground uppercase">Profile Visits</span>
              <span className="block text-sm font-black text-foreground font-mono mt-1">{stats.visits}</span>
            </div>
            <div className="rounded-xl bg-muted/60 p-3 border border-border">
              <span className="block text-[8px] font-bold text-muted-foreground uppercase">Avg View Time</span>
              <span className="block text-sm font-black text-foreground font-mono mt-1">{stats.watchTime}s</span>
            </div>
            <div className="rounded-xl bg-muted/60 p-3 border border-border">
              <span className="block text-[8px] font-bold text-muted-foreground uppercase">Trending safety</span>
              <span className="block text-sm font-black text-purple-600 dark:text-purple-400 font-mono mt-1">{stats.trendingScore}%</span>
            </div>
          </div>

          {/* Connect Moderation progression details */}
          <ModerationTimeline status={listing.status} adminComment={listing.reason_for_sale || undefined} />

          {/* Connect Escrow Smart Status progress */}
          {listing.status === 'sold' && (
            <EscrowStatusPanel escrowStatus={escrowState} />
          )}
        </div>
      )}
    </div>
  )
}
