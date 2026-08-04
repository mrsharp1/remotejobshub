import React from 'react'
import { Listing } from '@/types'
import {
  Globe,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  TrendingUp,
  Target,
  BarChart3,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

interface AccountIntelligencePanelProps {
  listing: Listing
  className?: string
}

function estimateApprovalChance(listing: Listing): number {
  let score = 60
  if (listing.identity_verified) score += 10
  if (listing.seller?.seller_verified) score += 10
  if (listing.phone_included) score += 5
  if (listing.original_email_included) score += 8
  if (listing.recovery_email_included) score += 5
  if (
    listing.account_age &&
    !['< 1 year', 'Less than 1 year'].includes(listing.account_age)
  )
    score += 7
  return Math.min(99, score)
}

function estimateROI(price: number, monthlyIncome: number | null): string {
  if (!monthlyIncome || monthlyIncome <= 0 || price <= 0) return 'N/A'
  const months = price / monthlyIncome
  return `${months.toFixed(1)} months`
}

function estimateWeeklyEarnings(monthly: number | null): string {
  if (!monthly) return 'N/A'
  return `₦${(monthly / 4.33).toFixed(0)}`
}

function getKycStatus(listing: Listing): { label: string; color: string } {
  if (listing.identity_verified && listing.seller?.seller_verified) {
    return {
      label: 'KYC Approved',
      color:
        'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
    }
  }
  if (listing.identity_verified) {
    return {
      label: 'ID Verified',
      color:
        'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
    }
  }
  return {
    label: 'Pending KYC',
    color:
      'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
  }
}

interface InfoGridItem {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  highlight?: boolean
}

export const AccountIntelligencePanel: React.FC<
  AccountIntelligencePanelProps
> = ({ listing, className = '' }) => {
  const approvalChance = estimateApprovalChance(listing)
  const roi = estimateROI(listing.price, listing.monthly_income ?? null)
  const weeklyEarnings = estimateWeeklyEarnings(listing.monthly_income ?? null)
  const kycStatus = getKycStatus(listing)

  const infoItems: InfoGridItem[] = [
    {
      icon: Clock,
      label: 'Account Age',
      value: listing.account_age || 'Not specified',
    },
    {
      icon: Globe,
      label: 'Country',
      value: listing.country || 'Unknown',
    },
    {
      icon: Activity,
      label: 'Platform',
      value: listing.platform,
    },
    {
      icon: Calendar,
      label: 'Listed',
      value: new Date(listing.created_at).toLocaleDateString('en-NG', {
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      icon: TrendingUp,
      label: 'Monthly Earnings',
      value: listing.monthly_income
        ? `₦${Number(listing.monthly_income).toLocaleString()}`
        : 'N/A',
      highlight: true,
    },
    {
      icon: BarChart3,
      label: 'Weekly Earnings',
      value: weeklyEarnings,
      highlight: !!listing.monthly_income,
    },
    {
      icon: Target,
      label: 'Estimated ROI',
      value: roi,
    },
    {
      icon: ShieldCheck,
      label: 'Approval Chance',
      value: `${approvalChance}%`,
      highlight: approvalChance >= 80,
    },
  ]

  const booleanItems = [
    {
      label: 'Original Email',
      value: listing.original_email_included,
      icon: Mail,
    },
    {
      label: 'Recovery Email',
      value: listing.recovery_email_included,
      icon: Mail,
    },
    { label: 'Phone Number', value: listing.phone_included, icon: Phone },
    {
      label: 'Identity Verified',
      value: listing.identity_verified,
      icon: ShieldCheck,
    },
  ]

  return (
    <div
      className={`space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-card ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-foreground">
            Account Intelligence
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Premium metadata analysis
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${kycStatus.color}`}
        >
          <ShieldCheck className="h-2.5 w-2.5" />
          {kycStatus.label}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border p-3 transition-colors ${item.highlight ? 'border-primary/20 bg-primary/5' : 'border-border bg-slate-50 dark:bg-slate-800/50'}`}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <item.icon
                className={`h-3 w-3 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
            </div>
            <p
              className={`font-heading text-sm font-bold ${item.highlight ? 'text-primary' : 'text-foreground'}`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Verification Status */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Verification Status
        </p>
        <div className="grid grid-cols-2 gap-2">
          {booleanItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              {item.value ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
              )}
              <span
                className={
                  item.value
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground'
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
