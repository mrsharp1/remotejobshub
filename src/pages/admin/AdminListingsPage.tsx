import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ListFilter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bookmark,
  Eye,
  Trash2,
  Filter,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { listingService } from '@/services/marketplace/listing.service'
import { useAuthStore } from '@/stores/authStore'
import { Listing } from '@/types'

export const AdminListingsPage: React.FC = () => {
  const { user } = useAuthStore()

  // Query and Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest'>(
    'newest'
  )

  // Selected Listing state for drawer view
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)

  // Notes state for rejection or changes requested input modal
  const [reviewNotes, setReviewNotes] = useState('')
  const [actionTarget, setActionTarget] = useState<'reject' | 'changes' | null>(
    null
  )

  // Fetch Listings with images, tags, and profiles
  const {
    data: listings = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['admin-all-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(
          '*, seller:profiles(*), images:listing_images(*), tags:listing_tags(*)'
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Listing[]
    },
  })

  // Derive unique platforms from listings for filter select options
  const platforms = Array.from(new Set(listings.map((l) => l.platform)))

  // Action Handlers
  const handleApprove = async (id: string) => {
    if (!user) return
    try {
      await listingService.approveListing(id, user.id)
      refetch()
      setSelectedListing(null)
    } catch (err) {
      alert('Failed to approve listing')
    }
  }

  const handleActionSubmit = async () => {
    if (!selectedListing || !user || !actionTarget) return
    try {
      if (actionTarget === 'reject') {
        await listingService.rejectListing(
          selectedListing.id,
          reviewNotes,
          user.id
        )
      } else if (actionTarget === 'changes') {
        await listingService.requestListingChanges(
          selectedListing.id,
          reviewNotes,
          user.id
        )
      }
      refetch()
      setSelectedListing(null)
      setActionTarget(null)
      setReviewNotes('')
    } catch (err) {
      alert(`Failed to complete action: ${actionTarget}`)
    }
  }

  const handleToggleFeature = async (listing: Listing) => {
    try {
      await listingService.featureListing(listing.id, !listing.is_featured)
      refetch()
      // Update local state if drawer is open
      setSelectedListing((prev) =>
        prev ? { ...prev, is_featured: !prev.is_featured } : null
      )
    } catch (err) {
      alert('Failed to update featured state')
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await listingService.archiveListing(id)
      refetch()
      setSelectedListing(null)
    } catch (err) {
      alert('Failed to archive listing')
    }
  }

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this listing from the database?'
      )
    )
      return
    try {
      await listingService.deleteListing(id)
      refetch()
      setSelectedListing(null)
    } catch (err) {
      alert('Failed to delete listing')
    }
  }

  // Filter & Search Logic
  const filteredListings = listings
    .filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.seller?.full_name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())

      const matchesPlatform =
        selectedPlatform === 'all' || l.platform === selectedPlatform

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'pending' && l.approval_status === 'pending') ||
        (selectedStatus === 'approved' && l.approval_status === 'approved') ||
        (selectedStatus === 'rejected' && l.approval_status === 'rejected') ||
        (selectedStatus === 'featured' && l.is_featured) ||
        (selectedStatus === 'archived' && l.status === 'archived')

      return matchesSearch && matchesPlatform && matchesStatus
    })
    .sort((a, b) => {
      if (selectedSort === 'newest') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      } else {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }
    })

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="border-border/40 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Review Portal Control Panel
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Listing Moderation Center
          </h1>
        </div>
      </div>

      {/* Query Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-12">
        {/* Search */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, seller, platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="relative md:col-span-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 py-2 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="featured">Featured Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>

        {/* Platform Filter */}
        <div className="relative md:col-span-2">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 py-2 text-xs"
          >
            <option value="all">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting filter */}
        <div className="relative md:col-span-2">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 py-2 text-xs"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Stats counter */}
        <div className="bg-muted/20 flex items-center justify-center rounded-lg border px-3 text-[10px] font-bold text-muted-foreground md:col-span-2">
          {filteredListings.length} Listings Found
        </div>
      </div>

      {/* Grid of Listings */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-destructive" />
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card py-12 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">
            No listings match criteria
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Try widening search parameters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-muted/40 border-border/60 border-b text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Title</th>
                  <th className="p-4">Platform</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border/40 divide-y">
                {filteredListings.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="max-w-[200px] truncate p-4 font-bold text-foreground">
                      {l.title}
                    </td>
                    <td className="p-4 capitalize text-muted-foreground">
                      {l.platform}
                    </td>
                    <td className="p-4 font-medium text-foreground">
                      {l.seller?.full_name || 'Seller'}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      ${Number(l.price).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                          l.approval_status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : l.approval_status === 'rejected'
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-yellow-500/10 text-yellow-600'
                        }`}
                      >
                        {l.approval_status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeature(l)}
                        className={`rounded p-1 hover:bg-muted ${
                          l.is_featured
                            ? 'text-yellow-500'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Star className="h-4.5 w-4.5 fill-current" />
                      </button>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedListing(l)}
                        className="inline-flex items-center gap-1 rounded border bg-background px-2.5 py-1 font-bold transition-colors hover:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Drawer / Modal Panel */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedListing(null)}
          />
          <aside className="animate-in slide-in-from-right relative z-50 flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-background p-6 shadow-2xl duration-250">
            {/* Header info */}
            <div className="mb-6 flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                  Inspector Console Workspace
                </span>
                <h3 className="mt-0.5 font-heading text-lg font-bold text-foreground">
                  {selectedListing.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="rounded border px-2.5 py-1 text-xs font-bold hover:bg-muted"
              >
                Close
              </button>
            </div>

            {/* Layout details */}
            <div className="space-y-6">
              {/* Images preview */}
              {selectedListing.images && selectedListing.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedListing.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image_url}
                      alt="Listing upload"
                      className="h-36 w-full rounded-lg border object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Grid properties */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Platform
                  </span>
                  <div className="font-semibold capitalize text-foreground">
                    {selectedListing.platform}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Asking Price
                  </span>
                  <div className="text-sm font-bold text-foreground">
                    ${Number(selectedListing.price).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Account Age
                  </span>
                  <div className="font-semibold text-foreground">
                    {selectedListing.account_age || 'Unknown'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Monthly Income
                  </span>
                  <div className="font-semibold text-foreground">
                    $
                    {Number(
                      selectedListing.monthly_income || 0
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedListing.tags && selectedListing.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedListing.tags.map((t) => (
                      <span
                        key={t.id}
                        className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {t.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Badges */}
              <div className="bg-muted/20 space-y-3 rounded-lg border p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Escrow System Trust Indicators
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      className={
                        selectedListing.original_email_included
                          ? 'h-4 w-4 text-emerald-500'
                          : 'h-4 w-4 text-muted-foreground'
                      }
                    />
                    <span>Original Email Included</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      className={
                        selectedListing.recovery_email_included
                          ? 'h-4 w-4 text-emerald-500'
                          : 'h-4 w-4 text-muted-foreground'
                      }
                    />
                    <span>Recovery Email Included</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      className={
                        selectedListing.phone_included
                          ? 'h-4 w-4 text-emerald-500'
                          : 'h-4 w-4 text-muted-foreground'
                      }
                    />
                    <span>Phone Verification Removed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      className={
                        selectedListing.identity_verified
                          ? 'h-4 w-4 text-emerald-500'
                          : 'h-4 w-4 text-muted-foreground'
                      }
                    />
                    <span>Identity Verified Seller</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[9px] font-bold uppercase text-muted-foreground">
                  Description
                </span>
                <p className="bg-muted/20 whitespace-pre-line rounded-lg p-3 leading-relaxed text-muted-foreground">
                  {selectedListing.description || 'No description provided.'}
                </p>
              </div>

              {/* Seller details */}
              <div className="space-y-2 border-t pt-4">
                <h4 className="text-[10px] font-bold uppercase text-muted-foreground">
                  Seller Profile
                </h4>
                <div className="bg-muted/30 flex items-center justify-between rounded-lg p-3 text-xs">
                  <div>
                    <div className="font-bold text-foreground">
                      {selectedListing.seller?.full_name || 'Seller'}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      {selectedListing.seller?.role || 'User'}
                    </div>
                  </div>
                  {selectedListing.seller?.seller_verified && (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-500">
                      Verified Seller
                    </span>
                  )}
                </div>
              </div>

              {/* Review notes history */}
              {selectedListing.review_notes && (
                <div className="space-y-1.5 border-l-2 border-orange-500 pl-3 text-xs">
                  <span className="text-[9px] font-bold uppercase text-orange-500">
                    Previous Review Notes
                  </span>
                  <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                    {selectedListing.review_notes}
                  </p>
                </div>
              )}

              {/* Control Action Buttons Panel */}
              <div className="space-y-3 border-t pt-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(selectedListing.id)}
                    className="inline-flex min-w-[120px] flex-1 items-center justify-center gap-1.5 rounded bg-emerald-600 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => {
                      setActionTarget('reject')
                      setReviewNotes('')
                    }}
                    className="inline-flex min-w-[120px] flex-1 items-center justify-center gap-1.5 rounded bg-red-600 py-2 text-xs font-bold text-white transition-colors hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => {
                      setActionTarget('changes')
                      setReviewNotes('')
                    }}
                    className="inline-flex min-w-[120px] flex-1 items-center justify-center gap-1.5 rounded bg-amber-500 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600"
                  >
                    <AlertCircle className="h-4 w-4" /> Request Changes
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleFeature(selectedListing)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded border px-3 py-2 text-xs font-bold transition-colors hover:bg-muted"
                  >
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    {selectedListing.is_featured
                      ? 'Unfeature'
                      : 'Feature Listing'}
                  </button>
                  <button
                    onClick={() => handleArchive(selectedListing.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded border px-3 py-2 text-xs font-bold transition-colors hover:bg-muted"
                  >
                    <Bookmark className="h-4 w-4" /> Archive
                  </button>
                  <button
                    onClick={() => handleDelete(selectedListing.id)}
                    className="inline-flex items-center justify-center rounded border border-red-500/30 p-2 text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Input Action notes modal dialog overlay */}
      {actionTarget && (
        <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md space-y-4 rounded-xl border bg-background p-6 shadow-2xl duration-150">
            <h3 className="font-heading text-sm font-bold text-foreground">
              {actionTarget === 'reject'
                ? 'Confirm Listing Rejection'
                : 'Request Listing Changes'}
            </h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">
                Review Feedback Notes
              </label>
              <textarea
                placeholder="Describe the issues or changes requested..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="h-28 w-full rounded-lg border bg-background p-2 text-xs text-foreground"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setActionTarget(null)}
                className="rounded border px-3 py-2 hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleActionSubmit}
                disabled={!reviewNotes.trim()}
                className="hover:bg-destructive/95 rounded bg-destructive px-4 py-2 text-white disabled:opacity-40"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminListingsPage
