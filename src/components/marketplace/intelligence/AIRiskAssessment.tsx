import React, { useMemo } from 'react'
import { Listing } from '@/types'
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react'

interface AIRiskAssessmentProps {
  listing: Listing
  sellerReviewScore?: number
  hasDisputes?: boolean
  className?: string
}

type RiskLevel = 'low' | 'medium' | 'high'

interface RiskFactor {
  label: string
  positive: boolean
}

function assessRisk(
  listing: Listing,
  sellerReviewScore: number,
  hasDisputes: boolean
): { level: RiskLevel; confidence: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = []
  let riskPoints = 0

  if (listing.identity_verified) {
    factors.push({
      label: 'Seller completed KYC identity verification',
      positive: true,
    })
  } else {
    factors.push({
      label: 'No KYC identity verification on record',
      positive: false,
    })
    riskPoints += 2
  }

  if (listing.seller?.seller_verified) {
    factors.push({
      label: 'Seller is officially verified by Remote Jobs Hub',
      positive: true,
    })
  } else {
    factors.push({
      label: 'Seller has not completed platform verification',
      positive: false,
    })
    riskPoints += 2
  }

  if (listing.phone_included) {
    factors.push({
      label: 'Phone number verified and included in transfer',
      positive: true,
    })
  } else {
    factors.push({
      label: 'Phone number not included in this listing',
      positive: false,
    })
    riskPoints += 1
  }

  if (listing.original_email_included) {
    factors.push({
      label: 'Original account email included for full ownership',
      positive: true,
    })
  } else {
    factors.push({
      label: 'Original email not included — limits account access',
      positive: false,
    })
    riskPoints += 1
  }

  if (hasDisputes) {
    factors.push({
      label: 'Dispute history detected on seller account',
      positive: false,
    })
    riskPoints += 3
  } else {
    factors.push({
      label: 'No dispute history — clean seller record',
      positive: true,
    })
  }

  if (sellerReviewScore >= 4.5) {
    factors.push({
      label:
        'Excellent seller rating (' + sellerReviewScore.toFixed(1) + '/5.0)',
      positive: true,
    })
  } else if (sellerReviewScore >= 3.5) {
    factors.push({
      label: 'Good seller rating (' + sellerReviewScore.toFixed(1) + '/5.0)',
      positive: true,
    })
    riskPoints += 1
  } else if (sellerReviewScore > 0) {
    factors.push({
      label:
        'Below average seller rating (' +
        sellerReviewScore.toFixed(1) +
        '/5.0)',
      positive: false,
    })
    riskPoints += 2
  }

  if (
    listing.account_age &&
    !['< 1 year', 'Less than 1 year'].includes(listing.account_age)
  ) {
    factors.push({
      label: 'Account has established history: ' + listing.account_age,
      positive: true,
    })
  } else {
    factors.push({
      label: 'Account is relatively new — limited history',
      positive: false,
    })
    riskPoints += 1
  }

  let level: RiskLevel = 'low'
  let confidence = 92

  if (riskPoints >= 6) {
    level = 'high'
    confidence = Math.max(68, 90 - riskPoints * 4)
  } else if (riskPoints >= 3) {
    level = 'medium'
    confidence = Math.max(74, 90 - riskPoints * 2)
  }

  return { level, confidence, factors }
}

const riskConfig = {
  low: {
    label: 'Low Risk',
    emoji: '🟢',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    bar: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    Icon: ShieldCheck,
  },
  medium: {
    label: 'Medium Risk',
    emoji: '🟡',
    color: 'text-amber-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    bar: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    Icon: AlertTriangle,
  },
  high: {
    label: 'High Risk',
    emoji: '🔴',
    color: 'text-rose-400',
    bg: 'bg-rose-500/5',
    border: 'border-rose-500/20',
    bar: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    Icon: ShieldAlert,
  },
}

export const AIRiskAssessment: React.FC<AIRiskAssessmentProps> = ({
  listing,
  sellerReviewScore = 0,
  hasDisputes = false,
  className = '',
}) => {
  const { level, confidence, factors } = useMemo(
    () => assessRisk(listing, sellerReviewScore, hasDisputes),
    [listing, sellerReviewScore, hasDisputes]
  )

  const config = riskConfig[level]
  const { Icon } = config

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border ${config.border} ${config.bg} space-y-6 p-7 shadow-2xl backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 shadow-inner">
          <Cpu className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-white">
            AI Risk Assessment
          </h3>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400/80">
            Powered by Platform Intelligence
          </p>
        </div>
      </div>

      {/* Risk Level */}
      <div
        className={`relative z-10 flex items-center gap-4 rounded-2xl border ${config.border} bg-slate-900/60 p-5 backdrop-blur-sm`}
      >
        <Icon className={`h-8 w-8 ${config.color}`} />
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className={`font-heading text-xl font-black tracking-tight ${config.color}`}>
              {config.emoji} {config.label}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {confidence}% confidence
            </span>
          </div>
          {/* Confidence bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800 shadow-inner">
            <div
              className={`h-full rounded-full ${config.bar} transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Factor list */}
      <div className="relative z-10 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Risk Factors Analyzed
        </p>
        <div className="space-y-2">
          {factors.map((f, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              {f.positive ? (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10">
                  <XCircle className="h-3 w-3 text-rose-400" />
                </div>
              )}
              <span
                className={
                  f.positive ? 'text-slate-300' : 'font-medium text-rose-300'
                }
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-start gap-3 rounded-xl border border-white/5 bg-slate-900/60 p-4 text-xs leading-relaxed text-slate-400 shadow-inner">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
        <p>
          This assessment is generated automatically from listing and seller data. It does
          not constitute financial advice.
        </p>
      </div>
    </div>
  )
}
