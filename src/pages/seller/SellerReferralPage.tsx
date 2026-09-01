import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { referralService } from '@/services/marketplace/referral.service'
import { Referral } from '@/types'
import { Loader2, Copy, Share, Users, DollarSign, CheckCircle2 } from 'lucide-react'

export const SellerReferralPage: React.FC = () => {
  const { profile } = useAuthStore()
  const [copied, setCopied] = useState(false)

  const referralCode = profile?.referral_code || 'N/A'
  const referralLink = window.location.origin + '?ref=' + referralCode

  // Fetch admin reward setting
  const { data: rewardAmount = 0 } = useQuery({
    queryKey: ['referral-reward-setting'],
    queryFn: () => referralService.getAdminSettings(),
  })

  // Fetch referrals list
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ['buyer-referrals', profile?.id],
    queryFn: () =>
      profile?.id ? referralService.getReferrals(profile.id) : [],
    enabled: !!profile?.id,
  })

  const paidCount = referrals.filter((r) => r.status === 'paid').length
  const paidEarnings = referrals
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + Number(r.reward_amount), 0)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Remote Jobs Hub',
        text: 'Join me on Remote Jobs Hub and discover great opportunities!',
        url: referralLink,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="font-heading text-xl font-extrabold tracking-tight">REFER & EARN</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Invite someone to Remote Jobs Hub.
        </p>
        <p className="mt-1 font-medium">
          Earn Ã¢â€šÂ¦{rewardAmount.toLocaleString()} when someone you refer completes their first qualifying purchase.
        </p>

        <div className="mt-6 max-w-xl">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            YOUR REFERRAL LINK
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="premium-input w-full p-3 font-mono text-sm text-foreground focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/95 sm:flex-none"
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
              <button
                onClick={handleShare}
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 font-semibold text-foreground transition-colors hover:bg-muted sm:flex-none"
              >
                <Share className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Successful Referrals
            </span>
            <h3 className="mt-1 text-2xl font-bold text-foreground">
              {paidCount}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Referral Earnings
            </span>
            <h3 className="mt-1 text-2xl font-bold text-foreground">
              Ã¢â€šÂ¦{paidEarnings.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            YOUR REFERRALS
          </h3>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-foreground">No referrals yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">Share your referral link to start earning.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-border/40 border-b bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Person</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-border/50 divide-y">
                {referrals.map((r: Referral) => (
                  <tr key={r.id} className="hover:bg-muted/10">
                    <td className="p-4 font-medium text-foreground">
                      {r.referred?.full_name || 'System User'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          r.status === 'paid'
                            ? 'bg-green-500/10 text-green-500'
                            : r.status === 'qualified'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : r.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {r.status === 'pending' ? 'Purchase Pending' : r.status === 'paid' ? 'Reward Paid' : r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-foreground">
                      Ã¢â€šÂ¦{Number(r.reward_amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
export default SellerReferralPage
