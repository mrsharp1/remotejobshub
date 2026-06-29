import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  DollarSign,
  Eye,
  Star,
  Plus,
  TrendingUp,
  LayoutDashboard,
  ClipboardList,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Profile, Listing } from '@/types'
import { listingService } from '@/services/marketplace/listing.service'
import { recommendationService } from '@/services/marketplace/recommendation.service'
import { SellerStatsCard } from '@/components/seller/SellerStatsCard'
import { ProfileCompletionCard } from '@/components/seller/ProfileCompletionCard'
import { VerificationCard } from '@/components/seller/VerificationCard'
import { SubscriptionCard } from '@/components/seller/SubscriptionCard'
import { SellerBioCard } from '@/components/seller/SellerBioCard'
import { PaymentCard } from '@/components/seller/PaymentCard'
import { SellerAgreementModal } from '@/components/seller/SellerAgreementModal'

// Studio Imports
import { ListingForm } from '@/components/seller/studio/ListingForm'
import { ListingCard } from '@/components/seller/studio/ListingCard'
import { ListingPreview } from '@/components/seller/studio/ListingPreview'

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

  const [coachFeedback, setCoachFeedback] = useState<any>(null)

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

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
    {
      completed:
        !!profile?.company_name && !!profile?.company_website && !!profile?.bio,
    },
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { ...data, seller_id: profile.id, status: 'draft' } as any,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { ...formData, seller_id: profile.id, status: 'submitted' } as any,
          formImages,
          formTags
        )
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
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Dynamic welcome header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {profile?.full_name || 'Seller'} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === 'workspace'
              ? `Your profile is ${completionPercentage}% complete.`
              : 'Add and edit your asset listings for review.'}
          </p>
        </div>

        {/* Workspace navigation buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold ${
              activeTab === 'workspace'
                ? 'border-primary bg-primary text-primary-foreground shadow'
                : 'bg-background hover:bg-muted'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Workspace
          </button>
          <button
            onClick={() => {
              setActiveTab('studio')
              setStudioView('list')
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold ${
              activeTab === 'studio'
                ? 'border-primary bg-primary text-primary-foreground shadow'
                : 'bg-background hover:bg-muted'
            }`}
          >
            <ClipboardList className="h-4 w-4" /> Listing Studio
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'workspace' ? (
          <motion.div
            key="workspace-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Statistics Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SellerStatsCard
                title="Active Listings"
                value={
                  sellerListings.filter((l) => l.status === 'published').length
                }
                icon={FileText}
                description="Published listings"
              />
              <SellerStatsCard
                title="Total Sales"
                value="$0.00"
                icon={DollarSign}
                description="Escrow earnings pending checkout"
              />
              <SellerStatsCard
                title="Profile Views"
                value={0}
                icon={Eye}
                description="Listings visits total count"
              />
              <SellerStatsCard
                title="Seller Rating"
                value="0.0"
                icon={Star}
                description="Seller trust rating"
              />
            </div>

            {/* Layout details */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-8 lg:col-span-8">
                {/* AI Seller Coach Feedback Widget */}
                {coachFeedback && (
                  <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                      <Sparkles className="h-4.5 w-4.5 animate-pulse text-primary" />{' '}
                      AI Seller Coach Recommendations
                    </h3>
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-primary">
                          {coachFeedback.score}%
                        </span>
                        <span className="text-[9px] font-bold uppercase text-muted-foreground">
                          Listing Score
                        </span>
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <div className="flex gap-1.5">
                          <span className="text-muted-foreground">
                            Sale Probability:
                          </span>
                          <span className="font-bold text-foreground">
                            {coachFeedback.saleProbability}
                          </span>
                        </div>
                        <p className="text-[11px] leading-tight text-muted-foreground">
                          {coachFeedback.pricingSuggestions}
                        </p>
                      </div>
                    </div>

                    {coachFeedback.warnings.length > 0 ? (
                      <div className="space-y-2 text-xs">
                        <span className="block font-bold text-foreground">
                          Improvement Checklist:
                        </span>
                        <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                          {coachFeedback.warnings.map(
                            (w: string, i: number) => (
                              <li key={i}>{w}</li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-green-500">
                        ✓ Your active listings are fully optimized for maximum
                        conversion potential!
                      </p>
                    )}
                  </div>
                )}

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
                  onPaymentUpdated={handleProfileUpdated}
                />
              </div>

              <div className="space-y-8 lg:col-span-4">
                <VerificationCard
                  profile={profile}
                  onStatusUpdated={handleProfileUpdated}
                />
                <SubscriptionCard profile={profile} />

                {/* Activity Feed */}
                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="flex items-center justify-between font-heading text-lg font-bold text-foreground">
                    Recent Activity
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </h3>
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No recent activity to display.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="studio-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {studioView === 'list' && (
              <div className="space-y-6">
                {/* Filters block and Create trigger */}
                <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {[
                      'all',
                      'draft',
                      'submitted',
                      'published',
                      'sold',
                      'archived',
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize ${
                          filterStatus === status
                            ? 'border-secondary bg-secondary text-secondary-foreground shadow-sm'
                            : 'bg-background hover:bg-muted'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleCreateListing}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" /> Create Listing
                  </button>
                </div>

                {loadingListings ? (
                  <div className="flex min-h-[200px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                  <div className="rounded-xl border border-dashed bg-card p-12 text-center">
                    <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-bold text-foreground">
                      No listings found
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                      Get started by listing your digital asset on Remote Jobs
                      Hub. You can save your progress as a draft anytime.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleCreateListing}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
                      >
                        <Plus className="h-4 w-4" /> Create Listing
                      </button>
                    </div>
                  </div>
                )}
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  { ...formData, images: formImages, tags: formTags } as any
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
