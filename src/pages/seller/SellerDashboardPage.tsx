import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Profile, Listing } from '@/types'
import { listingService } from '@/services/marketplace/listing.service'
import { recommendationService } from '@/services/marketplace/recommendation.service'
import { ProfileCompletionCard } from '@/components/seller/ProfileCompletionCard'
import { VerificationCard } from '@/components/seller/VerificationCard'
import { SubscriptionCard } from '@/components/seller/SubscriptionCard'
import { SellerBioCard } from '@/components/seller/SellerBioCard'
import { PaymentCard } from '@/components/seller/PaymentCard'
import { SellerAgreementModal } from '@/components/seller/SellerAgreementModal'
import { useEventSubscriber } from '@/hooks/useEventSubscriber'

// Live data queries
import { useQuery } from '@tanstack/react-query'
import { walletService } from '@/services/marketplace/wallet.service'
import { orderService } from '@/services/marketplace/order.service'
import { useConversations } from '@/features/messaging/hooks/useConversations'
import { useWithdrawals } from '@/features/withdrawals/hooks/useWithdrawals'

// Studio Imports
import { ListingForm } from '@/components/seller/studio/ListingForm'
import { ListingPreview } from '@/components/seller/studio/ListingPreview'

// Listings Workspace Components
import { ListingCard } from '@/components/seller/listings/ListingCard'
import { ListingHero } from '@/components/seller/listings/ListingHero'
import { ListingMetrics } from '@/components/seller/listings/ListingMetrics'
import { ListingTabs } from '@/components/seller/listings/ListingTabs'
import { PerformanceChart } from '@/components/seller/listings/PerformanceChart'
import { EscrowStatusPanel } from '@/components/seller/listings/EscrowStatusPanel'
import { WalletSummary } from '@/components/seller/listings/WalletSummary'
import { EmptyState } from '@/components/seller/listings/EmptyState'
import { LoadingSkeleton } from '@/components/seller/listings/LoadingSkeleton'

export const SellerDashboardPage: React.FC = () => {
  const { profile, setProfile } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'workspace' | 'studio'>(
    'workspace'
  )
  const [studioView, setStudioView] = useState<'list' | 'form' | 'preview'>(
    'list'
  )
  const [sellerListings, setSellerListings] = useState<Listing[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [formData, setFormData] = useState<Partial<Listing> | null>(null)
  const [formImages, setFormImages] = useState<string[]>([])
  const [formTags, setFormTags] = useState<string[]>([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Live queries
  const { data: wallet, refetch: refetchWallet } = useQuery({
    queryKey: ['seller-wallet', profile?.id],
    queryFn: () => (profile?.id ? walletService.getWallet(profile.id) : null),
    enabled: !!profile?.id,
  })

  const { data: withdrawals = [] } = useWithdrawals(profile?.id)
  const hasPayoutDetails = withdrawals.length > 0

  const { data: sellerOrders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['seller-orders', profile?.id],
    queryFn: () => (profile?.id ? orderService.getSellerOrders(profile.id) : []),
    enabled: !!profile?.id,
  })

  const { data: conversations = [], refetch: refetchConversations } = useConversations(profile?.id)

  const getTabCounts = () => {
    const counts: Record<string, number> = {
      all: sellerListings.length,
      draft: sellerListings.filter((l) => l.status === 'draft').length,
      submitted: sellerListings.filter((l) => l.status === 'submitted').length,
      approved: sellerListings.filter((l) => l.status === 'published').length,
      rejected: sellerListings.filter((l) => l.approval_status === 'rejected').length,
      paused: sellerListings.filter((l) => l.status === 'archived').length,
      sold: sellerListings.filter((l) => l.status === 'sold').length,
      archived: sellerListings.filter((l) => l.status === 'archived').length,
    }
    return counts
  }

  const getStats = () => {
    const active = sellerListings.filter((l) => l.status === 'published').length
    const pending = sellerListings.filter((l) => l.status === 'submitted').length
    const sold = sellerListings.filter((l) => l.status === 'sold').length
    const paused = sellerListings.filter((l) => l.status === 'archived').length
    const drafts = sellerListings.filter((l) => l.status === 'draft').length
    
    // Live Revenue calculation (completed sales sum)
    const revenue = sellerOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.amount), 0)

    // Dynamic views tally from listings
    const views = sellerListings.reduce((sum, l) => sum + (l.views || 0), 0)

    // Dynamic conversion rate calculation
    const conversion = views > 0 
      ? Math.round((sellerOrders.filter(o => o.status === 'completed').length / views) * 100 * 10) / 10
      : (sellerListings.length > 0 ? Math.round((sold / sellerListings.length) * 100 * 10) / 10 : 0)

    return { active, pending, sold, paused, drafts, revenue, views, conversion }
  }

  const handleProfileUpdated = (updatedProfile: Profile) => {
    setProfile(updatedProfile)
  }

  const fetchListings = useCallback(async () => {
    if (!profile?.id) return
    setLoadingListings(true)
    try {
      const data = await listingService.getSellerListings(profile.id)
      setSellerListings(data)
    } catch (err) {
      console.error('Failed to load listings:', err)
    } finally {
      setLoadingListings(false)
    }
  }, [profile?.id])

  const [coachFeedback, setCoachFeedback] = useState<{
    score: number
    saleProbability: string
    pricingSuggestions: string
    warnings: string[]
  } | null>(null)

  const handleWorkspaceUpdate = useCallback(() => {
    fetchListings()
    refetchWallet()
    refetchOrders()
    refetchConversations()
  }, [fetchListings, refetchWallet, refetchOrders, refetchConversations])

  useEffect(() => {
    handleWorkspaceUpdate()
  }, [handleWorkspaceUpdate])

  useEventSubscriber('ORDER_CREATED', handleWorkspaceUpdate)
  useEventSubscriber('ESCROW_RELEASED', handleWorkspaceUpdate)
  useEventSubscriber('DISPUTE_OPENED', handleWorkspaceUpdate)
  useEventSubscriber('DISPUTE_RESOLVED', handleWorkspaceUpdate)

  useEffect(() => {
    if (sellerListings.length > 0) {
      recommendationService
        .getSellerAICoach(sellerListings[0].id)
        .then((res) => {
          setCoachFeedback(res)
        })
    }
  }, [sellerListings])

  // Profile completion calculations
  const checklistItems = [
    { completed: !!profile?.full_name },
    { completed: !!profile?.email },
    { completed: !!profile?.phone },
    { completed: !!profile?.country },
    { completed: !!profile?.avatar_url },
    { completed: !!profile?.bio },
    { completed: profile?.seller_verified || false },
    { completed: hasPayoutDetails },
  ]
  const completedCount = checklistItems.filter((i) => i.completed).length
  const completionPercentage = Math.round(
    (completedCount / checklistItems.length) * 100
  )

  const handleCreateListing = () => {
    setSelectedListing(null)
    setFormData(null)
    setFormImages([])
    setFormTags([])
    setStudioView('form')
  }

  const handleEditListing = (listing: Listing) => {
    setSelectedListing(listing)
    setStudioView('form')
  }

  const handlePreviewListing = (listing: Listing) => {
    setSelectedListing(listing)
    setFormData(listing)
    setFormImages(listing.images?.map((i) => i.image_url) || [])
    setFormTags(listing.tags?.map((t) => t.tag) || [])
    setStudioView('preview')
  }

  const handleDuplicateListing = async (listing: Listing) => {
    if (!profile?.id) return
    try {
      const imagesList = listing.images?.map((i) => i.image_url) || []
      const tagsList = listing.tags?.map((t) => t.tag) || []
      await listingService.createListing(
        {
          seller_id: profile.id,
          title: `${listing.title} (Copy)`,
          platform: listing.platform,
          country: listing.country,
          description: listing.description,
          reason_for_sale: listing.reason_for_sale,
          account_age: listing.account_age,
          monthly_income: listing.monthly_income,
          price: listing.price,
          original_email_included: listing.original_email_included,
          recovery_email_included: listing.recovery_email_included,
          phone_included: listing.phone_included,
          identity_verified: listing.identity_verified,
          status: 'draft',
        },
        imagesList,
        tagsList
      )
      fetchListings()
    } catch (err) {
      console.error(err)
    }
  }

  const handleArchiveListing = async (listing: Listing) => {
    try {
      await listingService.updateListing(listing.id, { status: 'archived' })
      fetchListings()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteListing = async (listing: Listing) => {
    try {
      // Soft delete by converting status to archived
      await listingService.updateListing(listing.id, { status: 'archived' })
      fetchListings()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveDraft = async (
    data: Partial<Listing>,
    imagesList: string[],
    tagsList: string[]
  ) => {
    if (!profile?.id) return
    try {
      if (selectedListing?.id) {
        await listingService.updateListing(
          selectedListing.id,
          { ...data, status: 'draft' },
          imagesList,
          tagsList
        )
      } else {
        await listingService.createListing(
          { ...data, seller_id: profile.id, status: 'draft' } as Parameters<
            typeof listingService.createListing
          >[0],
          imagesList,
          tagsList
        )
      }
      setStudioView('list')
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmitPreview = (
    data: Partial<Listing>,
    imagesList: string[],
    tagsList: string[]
  ) => {
    setFormData(data)
    setFormImages(imagesList)
    setFormTags(tagsList)
    setStudioView('preview')
  }

  const handleConfirmPublish = async () => {
    if (!profile?.id) return
    setSubmitting(true)
    try {
      if (selectedListing?.id) {
        await listingService.updateListing(
          selectedListing.id,
          { ...formData, status: 'submitted' },
          formImages,
          formTags
        )
      } else {
        await listingService.createListing(
          {
            ...formData,
            seller_id: profile.id,
            status: 'submitted',
          } as Parameters<typeof listingService.createListing>[0],
          formImages,
          formTags
        )
        if (import.meta.env.DEV) {
          console.log("Listing successfully inserted.");
        }
      }
      setStudioView('list')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredListings = sellerListings.filter(
    (l) => filterStatus === 'all' || l.status === filterStatus
  )

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16 px-4">
      {/* Seller Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl md:p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-emerald-600/20 blur-[80px]" />
          <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-teal-600/20 blur-[80px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-4 border-slate-900 bg-slate-800 shadow-md">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-2xl font-bold text-slate-300">
                    {profile?.full_name?.charAt(0) || 'S'}
                  </span>
                )}
              </div>
              {profile?.seller_verified && (
                <div className="absolute -bottom-2 -right-2 rounded-xl bg-emerald-500 p-1.5 shadow-lg shadow-emerald-500/20">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                PRO SELLER WORKSPACE
              </p>
              <h1 className="mt-1 font-heading text-3xl font-black md:text-4xl text-white">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'Seller'}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <TrendingUp className="h-4 w-4" /> Level 2 Verified
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span>
                  {activeTab === 'workspace'
                    ? `Profile ${completionPercentage}% complete`
                    : 'Studio Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pending Payouts
            </p>
            <p className="mt-1 font-heading text-3xl font-black text-white font-mono">
              ₦{(wallet?.pending_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
            activeTab === 'workspace'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Workspace Overview
        </button>
        <button
          onClick={() => {
            setActiveTab('studio')
            setStudioView('list')
          }}
          className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
            activeTab === 'studio'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Listing Studio ({sellerListings.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'workspace' ? (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Workspace Stats Row */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="premium-card p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Revenue</p>
                <p className="mt-2 font-heading text-2xl font-black text-slate-900 dark:text-white font-mono">
                  ₦{getStats().revenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-[10px] text-emerald-500 font-semibold">Completed sales</p>
              </div>

              <div className="premium-card p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Views</p>
                <p className="mt-2 font-heading text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {getStats().views.toLocaleString()}
                </p>
                <p className="mt-1 text-[10px] text-emerald-500 font-semibold">Listing pageviews</p>
              </div>

              <div className="premium-card p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Favorites</p>
                <p className="mt-2 font-heading text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {sellerListings.reduce((sum, l) => sum + (l.favorites_count || 0), 0).toLocaleString()}
                </p>
                <p className="mt-1 text-[10px] text-emerald-500 font-semibold">Listing bookmarks</p>
              </div>

              <div className="premium-card p-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Average Conversion</p>
                <p className="mt-2 font-heading text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {getStats().conversion}%
                </p>
                <p className="mt-1 text-[10px] text-emerald-500 font-semibold">Orders ÷ Views</p>
              </div>
            </div>

            {/* Listing States Quick counters */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {[
                { label: 'Published Listings', count: sellerListings.filter((l) => l.status === 'published').length, color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/[0.02]' },
                { label: 'Draft Listings', count: sellerListings.filter((l) => l.status === 'draft').length, color: 'border-amber-500/20 text-amber-400 bg-amber-500/[0.02]' },
                { label: 'Paused Listings', count: sellerListings.filter((l) => l.status === 'archived').length, color: 'border-indigo-500/20 text-indigo-405 bg-indigo-500/[0.02]' },
                { label: 'Sold Listings', count: sellerListings.filter((l) => l.status === 'sold').length, color: 'border-purple-500/20 text-purple-400 bg-purple-500/[0.02]' },
              ].map((c, idx) => (
                <div key={idx} className={`rounded-xl border p-4 flex items-center justify-between ${c.color}`}>
                  <span className="font-heading text-[10px] font-bold uppercase tracking-wider">{c.label}</span>
                  <span className="font-heading text-xl font-black font-mono">{c.count}</span>
                </div>
              ))}
            </div>

            {/* Main Grids */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column: Analytics, Active Orders, Promos */}
              <div className="lg:col-span-2 space-y-8">
                {/* SVG Revenue Graph */}
                <div className="premium-card p-8">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Revenue Performance</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Live completed escrow transactions trend (last 7 days)</p>
                    </div>
                  </div>

                  <div className="aspect-[3/1] w-full">
                    {/* SVG Line Chart */}
                    <svg className="h-full w-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path
                        d={(() => {
                          const days = Array.from({ length: 7 }, (_, i) => {
                            const d = new Date()
                            d.setDate(d.getDate() - i)
                            return d.toDateString()
                          }).reverse()

                          const dailyRevenue = days.map((day) => {
                            return sellerOrders
                              .filter((o) => o.status === 'completed' && new Date(o.created_at).toDateString() === day)
                              .reduce((sum, o) => sum + Number(o.amount), 0)
                          })

                          const maxRev = Math.max(...dailyRevenue, 1000)
                          const pts = dailyRevenue.map((rev, idx) => {
                            const x = (idx / 6) * 600
                            const y = 180 - (rev / maxRev) * 140
                            return `${x},${y}`
                          })

                          return `M0,200 L${pts.join(' L')} L600,200 Z`
                        })()}
                        fill="url(#chartGrad)"
                      />
                      <path
                        d={(() => {
                          const days = Array.from({ length: 7 }, (_, i) => {
                            const d = new Date()
                            d.setDate(d.getDate() - i)
                            return d.toDateString()
                          }).reverse()

                          const dailyRevenue = days.map((day) => {
                            return sellerOrders
                              .filter((o) => o.status === 'completed' && new Date(o.created_at).toDateString() === day)
                              .reduce((sum, o) => sum + Number(o.amount), 0)
                          })

                          const maxRev = Math.max(...dailyRevenue, 1000)
                          const pts = dailyRevenue.map((rev, idx) => {
                            const x = (idx / 6) * 600
                            const y = 180 - (rev / maxRev) * 140
                            return `${x},${y}`
                          })

                          return `M${pts.join(' L')}`
                        })()}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Seller Orders / Escrow Stage */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Active Escrow Contracts</h3>
                  {(() => {
                    const activeEscrowOrders = sellerOrders.filter((o) => 
                      ['payment_received', 'seller_processing', 'buyer_review', 'disputed'].includes(o.status)
                    )

                    if (activeEscrowOrders.length === 0) {
                      return (
                        <div className="premium-card p-6 text-center text-xs text-muted-foreground bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl">
                          No active escrow agreements currently in mediation.
                        </div>
                      )
                    }

                    return activeEscrowOrders.map((order) => {
                      let progressWidth = '25%'
                      if (order.status === 'seller_processing') progressWidth = '50%'
                      if (order.status === 'buyer_review') progressWidth = '75%'
                      if (order.status === 'disputed') progressWidth = '90%'

                      return (
                        <div key={order.id} className="premium-card p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                  order.status === 'disputed' 
                                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500' 
                                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                                }`}>
                                  {order.status === 'disputed' ? 'Disputed' : 'Escrow Active'}
                                </span>
                              </div>
                              <h4 className="mt-2 font-heading text-base font-bold text-slate-900 dark:text-white">{order.listing?.title || 'System listing'}</h4>
                              <p className="text-xs text-slate-400">Buyer: @{order.buyer?.full_name?.split(' ')[0] || 'buyer'} | Status: {order.status.replace('_', ' ')}</p>
                            </div>
                            <div className="font-heading text-2xl font-black text-slate-900 dark:text-white font-mono">
                              ₦{Number(order.amount).toLocaleString('en-NG')}
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="relative flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <span className="text-emerald-500">Vault Funded</span>
                              <span className={['seller_processing', 'buyer_review', 'disputed'].includes(order.status) ? 'text-emerald-500' : ''}>Processing</span>
                              <span className={['buyer_review', 'disputed'].includes(order.status) ? 'text-emerald-500' : ''}>Inspecting</span>
                              <span>Payout</span>
                            </div>
                            <div className="relative mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                              <div className="absolute left-0 top-0 h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: progressWidth }} />
                            </div>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>

              </div>

              {/* Right Column: AI Coach warning checklist, Profile completion, bio cards */}
              <div className="space-y-8">
                {coachFeedback && (
                  <div className="premium-card space-y-4 shadow-xl">
                    <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="h-4.5 w-4.5 animate-pulse text-emerald-500 dark:text-emerald-400" />
                      AI Seller Coach
                    </h3>
                    <div className="flex items-center gap-4 border-b border-border pb-4">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                          {coachFeedback.score}%
                        </span>
                        <span className="text-[9px] font-bold uppercase text-muted-foreground">
                          Score
                        </span>
                      </div>
                      <div className="space-y-0.5 text-xs text-foreground">
                        <p className="font-semibold">{coachFeedback.saleProbability} Sale Probability</p>
                        <p className="text-[11px] leading-tight text-muted-foreground mt-1">
                          {coachFeedback.pricingSuggestions}
                        </p>
                      </div>
                    </div>

                    {coachFeedback.warnings.length > 0 ? (
                      <div className="space-y-2 text-xs text-foreground">
                        <span className="block font-bold">Optimization Checklist:</span>
                        <ul className="list-disc space-y-1.5 pl-4 text-muted-foreground">
                          {coachFeedback.warnings.map((w: string, i: number) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ All active listings fully optimized for conversion!
                      </p>
                    )}
                  </div>
                )}

                {/* Messages preview */}
                <div className="premium-card p-6">
                  <h3 className="mb-4 font-heading text-lg font-bold text-slate-900 dark:text-white">Recent Messages</h3>
                  {conversations.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No recent messages.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversations.slice(0, 3).map((conv) => (
                        <div key={conv.id} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
                          <div className="flex items-center gap-3">
                            {conv.unreadCount > 0 && (
                              <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            )}
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">@{conv.otherUser?.full_name || 'User'}</h4>
                              <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                "{conv.lastMessage?.message_text || 'No message yet'}"
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-500">
                            {conv.lastMessage ? new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <ProfileCompletionCard
                  profile={profile}
                  onAvatarUpdated={(url) =>
                    profile &&
                    handleProfileUpdated({ ...profile, avatar_url: url })
                  }
                />
                <SellerBioCard
                  profile={profile}
                  onBioUpdated={handleProfileUpdated}
                />
                <PaymentCard
                  profile={profile}
                />
                <VerificationCard
                  profile={profile}
                  onStatusUpdated={handleProfileUpdated}
                />
                <SubscriptionCard
                  profile={profile}
                  wallet={wallet}
                  completedCount={sellerOrders.filter((o) => o.status === 'completed').length}
                  totalRevenue={getStats().revenue}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >            {studioView === 'list' && (
              <div className="space-y-8">
                {/* Hero Section */}
                <ListingHero
                  sellerName={profile?.full_name || ''}
                  onCreateListing={handleCreateListing}
                  onOpenWallet={() => {
                    document.getElementById('wallet-summary-panel')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  onOpenEscrow={() => {
                    document.getElementById('escrow-status-panel')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  onOpenAnalytics={() => {
                    document.getElementById('performance-chart-panel')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  hasDrafts={sellerListings.some((l) => l.status === 'draft')}
                  onContinueDraft={() => {
                    const firstDraft = sellerListings.find((l) => l.status === 'draft')
                    if (firstDraft) handleEditListing(firstDraft)
                  }}
                />

                {/* Metrics Grid */}
                <ListingMetrics stats={getStats()} />

                {/* Performance Analytics Vector Charts & General Smart Escrow panel */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div id="performance-chart-panel" className="md:col-span-2">
                    <PerformanceChart />
                  </div>
                  <div id="escrow-status-panel" className="md:col-span-1">
                    <EscrowStatusPanel escrowStatus={sellerListings.some((l) => l.status === 'sold') ? 'released' : 'locked'} />
                  </div>
                </div>

                {/* Merchant Payout Accounting Summary */}
                <div id="wallet-summary-panel">
                  <WalletSummary />
                </div>

                {/* Status Tabs Navigation */}
                <div className="space-y-4">
                  <ListingTabs
                    activeTab={filterStatus}
                    onTabChange={setFilterStatus}
                    counts={getTabCounts()}
                  />

                  {/* Listings Grid List */}
                  {loadingListings ? (
                    <LoadingSkeleton />
                  ) : filteredListings.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {filteredListings.map((listing) => (
                        <ListingCard
                          key={listing.id}
                          listing={listing}
                          onEdit={handleEditListing}
                          onPreview={handlePreviewListing}
                          onDuplicate={handleDuplicateListing}
                          onArchive={handleArchiveListing}
                          onDelete={handleDeleteListing}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState onCreateClick={handleCreateListing} />
                  )}
                </div>
              </div>
            )}

            {studioView === 'form' && (
              <ListingForm
                initialData={selectedListing || undefined}
                onSaveDraft={handleSaveDraft}
                onSubmitPreview={handleSubmitPreview}
                onCancel={() => setStudioView('list')}
              />
            )}

            {studioView === 'preview' && formData && (
              <ListingPreview
                listing={
                  {
                    ...formData,
                    images: formImages,
                    tags: formTags,
                  } as Partial<Listing> & { images?: string[]; tags?: string[] }
                }
                onBack={() => setStudioView('form')}
                onSubmit={handleConfirmPublish}
                submitting={submitting}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <SellerAgreementModal onAccept={() => {}} />
    </div>
  )
}
