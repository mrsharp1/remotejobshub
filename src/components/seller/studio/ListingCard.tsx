import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Edit,
  Eye,
  Copy,
  Archive,
  Trash2,
  DollarSign,
  Globe,
  MoreVertical,
} from 'lucide-react'
import { Listing } from '@/types'
import { StatusBadge } from './StatusBadge'
import { ApprovalBadge } from './ApprovalBadge'

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

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Thumbnail or placeholder */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={listing.title}
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

        <div className="absolute left-2 top-2 flex gap-1">
          <StatusBadge status={listing.status} />
          <ApprovalBadge status={listing.approval_status} />
        </div>

        {/* Action dropdown toggle */}
        <div className="absolute right-2 top-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded bg-black/60 p-1.5 text-white hover:bg-black/80"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border bg-background py-1 shadow-lg">
                <button
                  onClick={() => {
                    onEdit(listing)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    onPreview(listing)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
                <button
                  onClick={() => {
                    onDuplicate(listing)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                {listing.status !== 'archived' && (
                  <button
                    onClick={() => {
                      onArchive(listing)
                      setShowMenu(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                  >
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(listing)
                    setShowMenu(false)
                  }}
                  className="hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-1.5 text-xs text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info details */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {listing.platform}
          </span>
          <h4 className="line-clamp-2 font-heading text-sm font-bold text-foreground">
            {listing.title}
          </h4>
        </div>

        <div className="border-border/50 mt-4 flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">
            {new Date(listing.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center font-heading text-sm font-extrabold text-primary">
            <DollarSign className="h-3.5 w-3.5" />
            {Number(listing.price).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
