import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp,
  DollarSign,
  Award,
  Users,
  Trophy,
  Loader2,
} from 'lucide-react'
import { referralService } from '@/services/marketplace/referral.service'
import { useAuthStore } from '@/stores/authStore'
import { Referral } from '@/types'

export const SellerReferralPage: React.FC = () => {
  const { profile } = useAuthStore()

  // Fetch referrals list
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ['seller-referrals', profile?.id],
    queryFn: () =>
      profile?.id ? referralService.getReferrals(profile.id) : [],
    enabled: !!profile?.id,
  })

  // Metrics
  const totalCount = referrals.length
  const qualifiedCount = referrals.filter(
    (r) => r.status === 'qualified' || r.status === 'paid'
  ).length
  const totalEarnings = qualifiedCount * 1000

  // Mocked Leaderboard
  const leaderboardPosition =
    qualifiedCount > 0 ? `#${Math.max(1, 15 - qualifiedCount)}` : 'N/A'

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Growth & Affiliate Program
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Seller Referral Center
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Track referral conversions and weekly affiliate bonuses earned from
          qualified registrations.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Total Referrals
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {totalCount}
            </h3>
          </div>
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg text-primary">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Total Earnings
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              ₦{totalEarnings.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Qualified Invites
            </span>
            <h3 className="mt-1 text-xl font-bold text-green-500">
              {qualifiedCount}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Leaderboard Spot
            </span>
            <h3 className="mt-1 text-xl font-bold text-amber-500">
              {leaderboardPosition}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Trophy className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Top Performers leader table */}
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm lg:col-span-5">
          <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            <Award className="h-4 w-4 text-primary" /> Top Partners Rankings
          </h3>
          <div className="space-y-2 text-xs">
            <div className="bg-muted/20 flex items-center justify-between rounded-lg p-2.5">
              <span className="font-semibold text-foreground">
                1. chinedu_dev
              </span>
              <span className="font-mono font-bold text-primary">
                48 Refers
              </span>
            </div>
            <div className="bg-muted/20 flex items-center justify-between rounded-lg p-2.5">
              <span className="font-semibold text-foreground">
                2. amara_talents
              </span>
              <span className="font-mono font-bold text-primary">
                35 Refers
              </span>
            </div>
            <div className="bg-muted/20 flex items-center justify-between rounded-lg p-2.5">
              <span className="font-semibold text-foreground">
                3. blessing_design
              </span>
              <span className="font-mono font-bold text-primary">
                29 Refers
              </span>
            </div>
          </div>
        </div>

        {/* Right: Active referrals list */}
        <div className="rounded-xl border bg-card shadow-sm lg:col-span-7">
          <div className="border-b p-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Referral Performance Registry
            </h3>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : referrals.length === 0 ? (
              <div className="py-12 text-center text-xs italic text-muted-foreground">
                No referrers registered yet.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/30 border-border/40 border-b text-[10px] font-bold uppercase text-muted-foreground">
                    <th className="p-3">User</th>
                    <th className="p-3">Join Date</th>
                    <th className="p-3">First Purchase</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y">
                  {referrals.map((r: Referral) => (
                    <tr key={r.id} className="hover:bg-muted/10">
                      <td className="p-3 font-semibold text-foreground">
                        {r.referred?.full_name || 'Anonymous User'}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {r.first_purchase_date
                          ? new Date(r.first_purchase_date).toLocaleDateString()
                          : 'None'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            r.status === 'paid'
                              ? 'bg-green-500/10 text-green-500'
                              : r.status === 'qualified'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : r.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SellerReferralPage
