import React, { useMemo } from 'react'
import { Listing } from '@/types'
import {
  ShieldCheck,
  Phone,
  Mail,
  Clock,
  Star,
  AlertCircle,
  Info,
} from 'lucide-react'

interface AccountHealthScoreProps {
  listing: Listing
  sellerReviewScore?: number
  hasDisputes?: boolean
  className?: string
}

interface ScoreFactor {
  label: string
  weight: number
  met: boolean
  icon: React.ElementType
  description: string
}

function computeHealthScore(
  listing: Listing,
  sellerReviewScore: number,
  hasDisputes: boolean
): { score: number; factors: ScoreFactor[] } {
  const factors: ScoreFactor[] = [
    {
      label: 'Identity Verified',
      weight: 20,
      met: listing.identity_verified,
      icon: ShieldCheck,
      description: 'Seller has completed KYC identity verification.',
    },
    {
      label: 'Seller Verified',
      weight: 15,
      met: !!listing.seller?.seller_verified,
      icon: ShieldCheck,
      description: 'Seller account has been verified by Remote Jobs Hub.',
    },
    {
      label: 'Phone Verified',
      weight: 12,
      met: listing.phone_included,
      icon: Phone,
      description: 'Phone number is included and verified.',
    },
    {
      label: 'Original Email',
      weight: 12,
      met: listing.original_email_included,
      icon: Mail,
      description: 'Original account email is included in the transfer.',
    },
    {
      label: 'Recovery Email',
      weight: 10,
      met: listing.recovery_email_included,
      icon: Mail,
      description: 'Recovery email is included for account safety.',
    },
    {
      label: 'Established Account',
      weight: 15,
      met:
        !!listing.account_age &&
        listing.account_age !== '< 1 year' &&
        listing.account_age !== 'Less than 1 year',
      icon: Clock,
      description: 'Account age shows a long-standing, established history.',
    },
    {
      label: 'Strong Review Score',
      weight: 10,
      met: sellerReviewScore >= 4.0,
      icon: Star,
      description: 'Seller has maintained a strong review rating above 4.0.',
    },
    {
      label: 'No Dispute History',
      weight: 6,
      met: !hasDisputes,
      icon: AlertCircle,
      description: 'No open or past dispute records on this listing or seller.',
    },
  ]

  const score = factors.reduce((acc, f) => acc + (f.met ? f.weight : 0), 0)
  return { score, factors }
}

function getHealthLabel(score: number): {
  label: string
  color: string
  bg: string
  ring: string
} {
  if (score >= 80)
    return {
      label: 'Excellent',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      ring: '#34d399',
    }
  if (score >= 60)
    return {
      label: 'Good',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      ring: '#60a5fa',
    }
  if (score >= 40)
    return {
      label: 'Fair',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      ring: '#fbbf24',
    }
  return {
    label: 'Risk',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    ring: '#fb7185',
  }
}

export const AccountHealthScore: React.FC<AccountHealthScoreProps> = ({
  listing,
  sellerReviewScore = 0,
  hasDisputes = false,
  className = '',
}) => {
  const { score, factors } = useMemo(
    () => computeHealthScore(listing, sellerReviewScore, hasDisputes),
    [listing, sellerReviewScore, hasDisputes]
  )

  const { label, color, ring } = getHealthLabel(score)

  // SVG circle params
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const metFactors = factors.filter((f) => f.met)
  const missingFactors = factors.filter((f) => !f.met)

  return (
    <div
      className={`relative space-y-6 rounded-[24px] border border-white/5 bg-slate-900/40 p-7 shadow-2xl backdrop-blur-2xl ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-white">
            Account Health Score
          </h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Based on completeness & trust
          </p>
        </div>
        <div
          className="relative flex items-center justify-center"
          style={{ width: 100, height: 100 }}
        >
          <svg
            width={100}
            height={100}
            viewBox="0 0 100 100"
            className="-rotate-90"
          >
            <circle
              cx={50}
              cy={50}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={8}
              className="text-slate-800"
            />
            <circle
              cx={50}
              cy={50}
              r={radius}
              fill="none"
              stroke={ring}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
                filter: `drop-shadow(0 0 4px ${ring})`,
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`font-heading text-2xl font-black ${color}`}>
              {score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              / 100
            </span>
          </div>
        </div>
      </div>

      <div
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${color}`}
        style={{ backgroundColor: `${ring}15`, border: `1px solid ${ring}30` }}
      >
        <span style={{ color: ring }}>{label} Health</span>
      </div>

      {/* Factor Breakdown */}
      <div className="space-y-4">
        {metFactors.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Trust Signals Met
            </p>
            <div className="flex flex-wrap gap-2">
              {metFactors.map((f) => (
                <span
                  key={f.label}
                  title={f.description}
                  className="inline-flex cursor-help items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  <f.icon className="h-3 w-3" />
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {missingFactors.length > 0 && (
          <div>
            <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Missing Signals
            </p>
            <div className="flex flex-wrap gap-2">
              {missingFactors.map((f) => (
                <span
                  key={f.label}
                  title={f.description}
                  className="inline-flex cursor-help items-center gap-1.5 rounded-lg border border-white/5 bg-slate-800 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 transition-colors hover:bg-slate-700"
                >
                  <f.icon className="h-3 w-3" />
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-400 shadow-inner">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
        <p>
          Hover over each signal to learn how it contributes to the overall
          score. Higher scores indicate lower risk for buyers.
        </p>
      </div>
    </div>
  )
}
