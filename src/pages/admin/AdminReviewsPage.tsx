import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Star,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { reviewService } from '@/services/marketplace/review.service'
import { Review } from '@/types'
import { Check, X } from 'lucide-react'

export const AdminReviewsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')

  // Fetch reviews for admin
  const {
    data: reviews = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['admin-all-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(
          '*, buyer_profile:profiles!reviews_buyer_id_fkey(*), seller_profile:profiles!reviews_seller_id_fkey(*), listing:listings(*)'
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Review[]
    },
  })

  // Handlers
  const handleApprove = async (id: string) => {
    try {
      await reviewService.approveReview(id)
      refetch()
    } catch {
      alert('Failed to approve review')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await reviewService.rejectReview(id)
      refetch()
    } catch {
      alert('Failed to reject review')
    }
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review permanently?'))
      return
    try {
      await reviewService.deleteReview(id)
      refetch()
    } catch {
      alert('Failed to delete review')
    }
  }

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.buyer_profile?.full_name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (r.seller_profile?.full_name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesRating =
      ratingFilter === 'all' || r.rating.toString() === ratingFilter

    const matchesStatus = statusFilter === 'all' || r.moderation_status === statusFilter

    return matchesSearch && matchesRating && matchesStatus
  })

  // Statistics calculations
  const totalReviewsCount = reviews.length
  const averagePlatformRating =
    totalReviewsCount > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount
        ).toFixed(1)
      : '5.0'

  const pendingCount = reviews.filter((r) => r.moderation_status === 'pending').length
  const rejectedCount = reviews.filter((r) => r.moderation_status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
          Security Administrator Control Panel
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Platform Reviews Moderation Center
        </h1>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-1 rounded-xl border bg-card p-5 shadow-sm">
          <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Average Platform Rating
          </span>
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-foreground">
              {averagePlatformRating}
            </span>
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4.5 w-4.5 ${
                    i < Math.round(Number(averagePlatformRating))
                      ? 'fill-current'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1 rounded-xl border bg-card p-5 shadow-sm">
          <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Logs Count
          </span>
          <div className="font-heading text-2xl font-bold text-foreground">
            {totalReviewsCount} reviews
          </div>
        </div>

        <div className="space-y-1 rounded-xl border bg-card p-5 shadow-sm">
          <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Pending / Rejected
          </span>
          <div className="font-heading text-2xl font-bold text-destructive">
            {pendingCount} Pending / {rejectedCount} Rejected
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              statusFilter === status
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-12">
        {/* Search */}
        <div className="relative md:col-span-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by keywords, titles, buyers, or sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-xs"
          />
        </div>

        {/* Rating Filter */}
        <div className="md:col-span-4">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 py-2 text-xs"
          >
            <option value="all">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐☆ 4 Stars</option>
            <option value="3">⭐⭐⭐☆☆ 3 Stars</option>
            <option value="2">⭐⭐☆☆☆ 2 Stars</option>
            <option value="1">⭐☆☆☆☆ 1 Star</option>
          </select>
        </div>
      </div>

      {/* Grid Log List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-destructive" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card py-12 text-center">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 animate-bounce text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">
            No matching reviews logs
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Try altering filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`space-y-4 rounded-xl border bg-card p-5 shadow-sm transition-all ${
                rev.moderation_status === 'rejected'
                  ? 'border-destructive/30 border-dashed opacity-65'
                  : rev.moderation_status === 'pending'
                  ? 'border-amber-500/50'
                  : ''
              }`}
            >
              {/* Header metadata */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    {rev.title} <span className="ml-2 rounded-full border px-2 py-0.5 text-[9px] uppercase">{rev.reviewer_type} review</span>
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>
                      Reviewer:{' '}
                      <span className="font-bold">
                        {rev.reviewer_type === 'buyer' ? rev.buyer_profile?.full_name : rev.seller_profile?.full_name}
                      </span>
                    </span>
                    <span>
                      Target:{' '}
                      <span className="font-bold text-primary">
                        {rev.reviewer_type === 'buyer' ? rev.seller_profile?.full_name : rev.buyer_profile?.full_name}
                      </span>
                    </span>
                    <span>
                      Listing:{' '}
                      <span className="font-bold">{rev.listing?.title}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>

                  <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase ${
                    rev.moderation_status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    rev.moderation_status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {rev.moderation_status}
                  </span>

                  {rev.moderation_status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(rev.id)}
                      className="rounded border p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
                      title="Approve Review"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  {rev.moderation_status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(rev.id)}
                      className="rounded border p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                      title="Reject Review"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="rounded border p-1.5 text-destructive transition-colors hover:bg-muted"
                    title="Delete Review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Rating representation */}
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < rev.rating ? 'fill-current' : 'text-muted'}`}
                  />
                ))}
              </div>

              {/* Review Text content */}
              <p className="bg-muted/20 rounded-lg border p-3.5 text-xs italic leading-relaxed text-muted-foreground">
                "{rev.review}"
              </p>

              {/* Seller Reply */}
              {rev.seller_reply && (
                <div className="bg-muted/40 space-y-1 rounded-lg border p-3 text-xs">
                  <span className="font-bold text-foreground">
                    Seller Response reply:
                  </span>
                  <p className="italic text-muted-foreground">
                    "{rev.seller_reply}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default AdminReviewsPage
