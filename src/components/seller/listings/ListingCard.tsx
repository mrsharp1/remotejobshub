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
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 shadow-sm transition-all hover:border-purple-550/20 text-xs">
      <div className="flex flex-col md:flex-row gap-5 p-5">
        
        {/* Left Side: Thumbnail info */}
        <div className="relative aspect-video w-full md:w-44 overflow-hidden rounded-xl bg-slate-950 shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-500">
              <Globe className="h-7 w-7 text-slate-650" />
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
        <div className="flex-1 space-y-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-purple-400">
              <span>{listing.platform}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              <span>{listing.country || 'Global'}</span>
            </div>
            <h4 className="font-heading text-sm font-bold text-white leading-snug">{listing.title}</h4>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
            <span className="rounded-lg bg-slate-950 px-2.5 py-1">Monthly Rev: {formatCurrency(Number(listing.monthly_income || 0))}</span>
            <span className="rounded-lg bg-slate-950 px-2.5 py-1">Age: {listing.account_age || 'N/A'}</span>
            <span className="rounded-lg bg-slate-950 px-2.5 py-1 font-bold text-white">Price: {formatCurrency(Number(listing.price))}</span>
          </div>

          <div className="flex items-center gap-3.5 text-[10px] text-slate-500 pt-1">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {stats.views} Views</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {stats.faves} Saves</span>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold ml-auto"
            >
              <BarChart3 className="h-3.5 w-3.5" /> {showAnalytics ? 'Hide Performance' : 'View Analytics'}
            </button>
          </div>
        </div>

        {/* Right Action Menu dropdown */}
        <div className="relative self-start md:self-center ml-auto">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-xl border border-white/5 bg-slate-950 hover:bg-slate-900 p-2 text-slate-400 hover:text-white"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 z-20 mt-1.5 w-40 rounded-xl border border-white/5 bg-slate-950 py-1.5 shadow-xl text-slate-300">
                <button
                  onClick={() => { onEdit(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit details
                </button>
                <button
                  onClick={() => { onPreview(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" /> Live Preview
                </button>
                <button
                  onClick={() => { onDuplicate(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                {listing.status !== 'archived' && (
                  <button
                    onClick={() => { onArchive(listing); setShowMenu(false) }}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                  >
                    <Archive className="h-3.5 w-3.5" /> Pause listing
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs hover:bg-white/5 hover:text-white"
                >
                  <Share2 className="h-3.5 w-3.5" /> Copy Link
                </button>
                <button
                  onClick={handleBoost}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-bold text-purple-400 hover:bg-white/5 hover:text-purple-300"
                >
                  <Zap className="h-3.5 w-3.5" /> Boost Exposure
                </button>
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={() => { onDelete(listing); setShowMenu(false) }}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-rose-500 hover:bg-rose-550/10"
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
        <div className="border-t border-white/5 bg-slate-950/40 p-5 space-y-5 animate-in slide-in-from-top duration-300">
          <div>
            <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400">Analytics breakdown</h5>
            <p className="text-[9px] text-slate-500">Real-time search and traffic values</p>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5">
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Click-Through Rate</span>
              <span className="block text-sm font-black text-white font-mono mt-1">{stats.ctr}%</span>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5">
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Profile Visits</span>
              <span className="block text-sm font-black text-white font-mono mt-1">{stats.visits}</span>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5">
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Avg View Time</span>
              <span className="block text-sm font-black text-white font-mono mt-1">{stats.watchTime}s</span>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3 border border-white/5">
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Trending safety</span>
              <span className="block text-sm font-black text-purple-400 font-mono mt-1">{stats.trendingScore}%</span>
            </div>
          </div>

          {/* Connect Moderation progression details */}
          <ModerationTimeline status={listing.status} adminComment={listing.reason_for_sale?.startsWith('VAULT_SECURE_PAYLOAD:') ? undefined : listing.reason_for_sale || undefined} />

          {/* Connect Escrow Smart Status progress */}
          {listing.status === 'sold' && (
            <EscrowStatusPanel escrowStatus={escrowState} />
          )}
        </div>
      )}
    </div>
  )
}
