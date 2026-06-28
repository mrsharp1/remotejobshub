import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  DollarSign,
  Eye,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { SellerStatsCard } from '@/components/seller/SellerStatsCard'
import { ProfileCompletionCard } from '@/components/seller/ProfileCompletionCard'
import { VerificationCard } from '@/components/seller/VerificationCard'
import { SubscriptionCard } from '@/components/seller/SubscriptionCard'
import { SellerBioCard } from '@/components/seller/SellerBioCard'
import { PaymentCard } from '@/components/seller/PaymentCard'

export const SellerDashboardPage: React.FC = () => {
  const { profile, setProfile } = useAuthStore()

  const handleProfileUpdated = (updatedProfile: any) => {
    setProfile(updatedProfile)
  }

  // Calculate profile completion percentage
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-8"
    >
      {/* Workspace Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {profile?.full_name || 'Seller'} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your listings, monitor stats, and review verification state.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" /> Create Listing
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SellerStatsCard
          title="Active Listings"
          value={0}
          icon={FileText}
          description="Total active job listings"
        />
        <SellerStatsCard
          title="Total Sales"
          value="$0.00"
          icon={DollarSign}
          description="Total earnings this month"
        />
        <SellerStatsCard
          title="Profile Views"
          value={0}
          icon={Eye}
          description="Visitor views on your listings"
        />
        <SellerStatsCard
          title="Seller Rating"
          value="0.0"
          icon={Star}
          description="Average customer feedback"
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Completion, Bio, Payments */}
        <div className="space-y-8 lg:col-span-8">
          <ProfileCompletionCard
            profile={profile}
            onAvatarUpdated={(url) =>
              profile && handleProfileUpdated({ ...profile, avatar_url: url })
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

        {/* Right Side: Verification, Subscription, Activity */}
        <div className="space-y-8 lg:col-span-4">
          <VerificationCard
            profile={profile}
            onStatusUpdated={handleProfileUpdated}
          />
          <SubscriptionCard profile={profile} />

          {/* Recent Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="flex items-center justify-between font-heading text-lg font-bold text-foreground">
              Recent Activity
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </h3>
            <div className="py-6 text-center text-sm text-muted-foreground">
              No recent activity to display.
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
