import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Copy,
  Users,
  Award,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Loader2,
} from 'lucide-react'
import { referralService } from '@/services/marketplace/referral.service'
import { useAuthStore } from '@/stores/authStore'
import { Referral } from '@/types'

export const BuyerReferralPage: React.FC = () => {
  const { profile } = useAuthStore()

  // Fetch referrals list
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ['buyer-referrals', profile?.id],
    queryFn: () =>
      profile?.id ? referralService.getReferrals(profile.id) : [],
    enabled: !!profile?.id,
  })

  const referralCode = profile?.referral_code || 'HUBREFCODE'
  const referralLink = `${window.location.origin}?ref=${referralCode}`

  // Metrics
  const totalCount = referrals.length
  const qualifiedCount = referrals.filter(
    (r) => r.status === 'qualified' || r.status === 'paid'
  ).length
  const pendingCount = referrals.filter((r) => r.status === 'pending').length
  const paidCount = referrals.filter((r) => r.status === 'paid').length
  const paidEarnings = paidCount * 1000
  const pendingEarnings = pendingCount * 1000

  // Gamification badges determinations
  const getAmbassadorBadge = () => {
    if (qualifiedCount >= 25)
      return {
        title: '💎 Platinum Ambassador',
        desc: 'Top tier program partner',
        style: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-500',
      }
    if (qualifiedCount >= 10)
      return {
        title: '🥇 Gold Referrer',
        desc: '10+ successful conversions verified',
        style: 'border-amber-500/30 bg-amber-500/5 text-amber-500',
      }
    if (qualifiedCount >= 5)
      return {
        title: '🥈 Silver Referrer',
        desc: '5+ successful conversions verified',
        style: 'border-slate-300/30 bg-slate-300/5 text-slate-400',
      }
    if (qualifiedCount >= 1)
      return {
        title: '🥉 Bronze Referrer',
        desc: 'First successful conversion verified',
        style: 'border-orange-600/30 bg-orange-600/5 text-orange-600',
      }
    return {
      title: 'No Badge',
      desc: 'Convert referrals to unlock badges',
      style: 'border-border/50 bg-muted/20 text-muted-foreground',
    }
  }
  const badge = getAmbassadorBadge()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    alert('Referral link copied to clipboard!')
  }

  // Social sharing urls
  const shareText = encodeURIComponent(
    `Join Remote Jobs Hub using my referral link to hire verified digital talents! ${referralLink}`
  )
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`
  const xTwitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Growth & Affiliate Program
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Affiliate & Referrals Center
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Share your custom referral code and earn ₦1,000 for every buyer or
          seller who completes their first purchase.
        </p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Total Invites
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
              Qualified Referrals
            </span>
            <h3 className="mt-1 text-xl font-bold text-green-500">
              {qualifiedCount}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Pending Rewards
            </span>
            <h3 className="mt-1 text-xl font-bold text-amber-500">
              ₦{pendingEarnings.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Paid Earnings
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              ₦{paidEarnings.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Share Details */}
        <div className="space-y-4 lg:col-span-5">
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Share Your Referral Link
            </h3>

            {/* Custom Link Box */}
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="premium-input flex-1 p-2 font-mono text-xs text-foreground focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="hover:bg-primary/95 rounded-lg bg-primary p-2.5 text-white transition-colors"
                title="Copy Link"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            {/* QR Mockup */}
            <div className="bg-muted/20 flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-lg border bg-card p-2 text-foreground">
                <QrCode className="h-14 w-14" />
              </div>
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-foreground">
                  Custom Scan QR Code
                </h4>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  Let peers scan this QR code directly from your device screen.
                </p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase text-muted-foreground">
                Quick Social Dispatch
              </label>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 rounded-lg bg-green-600 py-1.5 text-center text-[10px] font-semibold text-white hover:bg-green-600/95"
                >
                  WhatsApp
                </a>
                <a
                  href={xTwitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 rounded-lg bg-black py-1.5 text-center text-[10px] font-semibold text-white hover:bg-black/90"
                >
                  Twitter/X
                </a>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 rounded-lg bg-sky-500 py-1.5 text-center text-[10px] font-semibold text-white hover:bg-sky-500/95"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          {/* Badge Gamification Card */}
          <div
            className={`space-y-2.5 rounded-xl border p-4 shadow-sm ${badge.style}`}
          >
            <h4 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider">
              <Award className="h-4 w-4" /> Referral Ambassador Rank
            </h4>
            <div className="space-y-1 text-xs">
              <span className="block font-bold">{badge.title}</span>
              <span className="block text-[10px] opacity-80">{badge.desc}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline Table */}
        <div className="rounded-xl border bg-card shadow-sm lg:col-span-7">
          <div className="border-b p-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Referrals Conversion Timeline
            </h3>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : referrals.length === 0 ? (
              <div className="py-12 text-center text-xs italic text-muted-foreground">
                No users referred yet.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/30 border-border/40 border-b text-[10px] font-bold uppercase text-muted-foreground">
                    <th className="p-3">User</th>
                    <th className="p-3">Date Joined</th>
                    <th className="p-3">Conversion Status</th>
                    <th className="p-3">Commission Bounty</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y">
                  {referrals.map((r: Referral) => (
                    <tr key={r.id} className="hover:bg-muted/10">
                      <td className="p-3 font-semibold text-foreground">
                        {r.referred?.full_name || 'System User'}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
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
                      <td className="p-3 font-mono font-bold text-foreground">
                        ₦{Number(r.reward_amount).toLocaleString()}
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
export default BuyerReferralPage
