import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { referralService } from '@/services/marketplace/referral.service'
import { Referral } from '@/types'
import { Loader2, Copy, Share, Users, CheckCircle2, AlertCircle, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

export const BuyerReferralPage: React.FC = () => {
  const { profile } = useAuthStore()
  const [copied, setCopied] = useState(false)

  const referralCode = profile?.referral_code || 'N/A'
  const referralLink = window.location.origin + '?ref=' + referralCode

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['referral-settings'],
    queryFn: () => referralService.getAdminSettings(),
  })

  const { data: referrals = [], isLoading: isLoadingReferrals } = useQuery({
    queryKey: ['buyer-referrals', profile?.id],
    queryFn: () =>
      profile?.id ? referralService.getReferrals(profile.id) : [],
    enabled: !!profile?.id,
  })

  const isLoading = isLoadingSettings || isLoadingReferrals

  const totalCount = referrals.length
  const qualifiedCount = referrals.filter((r) => r.status === 'qualified' || r.status === 'paid').length
  const pendingRewards = referrals
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.reward_amount), 0)
  const earnedRewards = referrals
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + Number(r.reward_amount), 0)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Remote Jobs Hub',
          text: `Join Remote Jobs Hub using my referral link and explore available opportunities: ${referralLink}`,
          url: referralLink,
        })
      } catch (err) {
        // user cancelled or error
      }
    } else {
       handleCopyLink()
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (settings && !settings.is_enabled) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center shadow-sm">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold text-foreground">Referral Program Temporarily Unavailable</h2>
        <p className="mt-2 text-muted-foreground">Invitations are currently paused. Your existing referral records remain safe.</p>
      </div>
    )
  }

  const rewardFormatted = (settings?.reward_amount || 0).toLocaleString()
  const minimumPurchaseFormatted = (settings?.minimum_purchase_amount || 0).toLocaleString()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Refer & Earn</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite friends and earn ₦{rewardFormatted} when they make their first qualifying purchase of at least ₦{minimumPurchaseFormatted}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex aspect-square w-48 max-w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2 border shadow-sm">
                 <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(referralLink)}`}
                   alt="Referral QR Code"
                   className="h-full w-full object-contain"
                 />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Your Referral Link
              </label>
              <input
                type="text"
                readOnly
                value={referralLink}
                className="premium-input w-full rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground focus:outline-none"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary/95 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-bold text-foreground transition-all hover:bg-muted focus:ring-2 focus:ring-border focus:ring-offset-2"
                >
                  <Share className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm">
            <h3 className="font-heading text-sm font-bold text-foreground mb-4">How it works</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Share your link</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Send your unique referral link to friends.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">They join</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Your friend creates an account through your link.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Qualifying purchase</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">They make their first purchase of at least ₦{minimumPurchaseFormatted}.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600">4</div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">You earn</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">₦{rewardFormatted} is credited to your wallet.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-5 border-t">
              <Link to="/dashboard/wallet" className="flex items-center text-sm font-medium text-primary hover:underline">
                <Wallet className="mr-2 h-4 w-4" />
                View Wallet Balance
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">{totalCount}</h3>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Qualified</span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">{qualifiedCount}</h3>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pending</span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-amber-500">₦{pendingRewards.toLocaleString()}</h3>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Earned</span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-emerald-500">₦{earnedRewards.toLocaleString()}</h3>
            </div>
          </div>

          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="border-b p-4 sm:p-5">
              <h3 className="font-heading text-sm font-bold text-foreground">Referral Activity</h3>
            </div>

            <div className="p-0">
              {referrals.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-bold text-foreground">No referrals yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Share your referral link to invite your first friend.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {referrals.map((r: Referral) => (
                    <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-muted/5 transition-colors">
                      <div>
                        <div className="font-bold text-sm text-foreground">
                          {r.referred?.full_name || 'Anonymous User'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Joined {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            r.status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : r.status === 'qualified'
                                ? 'bg-blue-500/10 text-blue-600'
                                : r.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {r.status}
                        </span>
                        <div className="font-mono font-bold text-sm text-foreground">
                          ₦{Number(r.reward_amount || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BuyerReferralPage
