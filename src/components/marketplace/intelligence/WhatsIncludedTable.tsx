import React from 'react'
import {
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Key,
  Cookie,
  Monitor,
  FileText,
  Camera,
  BookOpen,
  Headphones,
} from 'lucide-react'
import { Listing } from '@/types'

interface WhatsIncludedTableProps {
  listing: Listing
  className?: string
}

interface IncludedItem {
  label: string
  description: string
  included: boolean
  icon: React.ElementType
  tier: 'essential' | 'valuable' | 'bonus'
}

export const WhatsIncludedTable: React.FC<WhatsIncludedTableProps> = ({
  listing,
  className = '',
}) => {
  const items: IncludedItem[] = [
    {
      label: 'Original Email',
      description: 'The original account email address with full access.',
      included: listing.original_email_included,
      icon: Mail,
      tier: 'essential',
    },
    {
      label: 'Recovery Email',
      description: 'Secondary email for account recovery purposes.',
      included: listing.recovery_email_included,
      icon: Mail,
      tier: 'essential',
    },
    {
      label: 'Phone Number',
      description: 'Verified phone number for SMS verification.',
      included: listing.phone_included,
      icon: Phone,
      tier: 'essential',
    },
    {
      label: '2FA Backup Codes',
      description: 'One-time backup codes for two-factor authentication.',
      included: listing.identity_verified,
      icon: Key,
      tier: 'valuable',
    },
    {
      label: 'Browser Cookies',
      description:
        'Session cookies for seamless first login without triggering alerts.',
      included: listing.identity_verified && listing.original_email_included,
      icon: Cookie,
      tier: 'valuable',
    },
    {
      label: 'Browser Profile',
      description:
        "Complete browser fingerprint profile matching the account's history.",
      included: listing.identity_verified,
      icon: Monitor,
      tier: 'valuable',
    },
    {
      label: 'Account Documentation',
      description:
        'Written records of account history, earnings, and credentials.',
      included: true,
      icon: FileText,
      tier: 'bonus',
    },
    {
      label: 'Earnings Screenshots',
      description:
        'Historical screenshots of payment proofs and account statistics.',
      included: !!(listing.monthly_income && listing.monthly_income > 0),
      icon: Camera,
      tier: 'bonus',
    },
    {
      label: 'Transfer Guide',
      description:
        'Step-by-step guide for safely taking ownership of the account.',
      included: true,
      icon: BookOpen,
      tier: 'bonus',
    },
    {
      label: 'Post-Sale Support',
      description:
        '14-day post-purchase support period from Remote Jobs Hub team.',
      included: true,
      icon: Headphones,
      tier: 'bonus',
    },
  ]

  const essentialItems = items.filter((i) => i.tier === 'essential')
  const valuableItems = items.filter((i) => i.tier === 'valuable')
  const bonusItems = items.filter((i) => i.tier === 'bonus')

  const renderGroup = (
    title: string,
    groupItems: IncludedItem[],
    badgeColor: string
  ) => (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${badgeColor}`}
        >
          {groupItems.filter((i) => i.included).length}/{groupItems.length}
        </span>
      </div>
      <div className="space-y-2">
        {groupItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
              item.included
                ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5'
                : 'border-border bg-slate-50 opacity-60 dark:bg-slate-800/30'
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.included ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800'}`}
            >
              <item.icon
                className={`h-4 w-4 ${item.included ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-sm font-semibold ${item.included ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {item.label}
                </p>
                {item.included ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const totalIncluded = items.filter((i) => i.included).length

  return (
    <div
      className={`space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-card ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-foreground">
            What's Included
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Full transfer package breakdown
          </p>
        </div>
        <div className="text-right">
          <p className="font-heading text-2xl font-black text-primary">
            {totalIncluded}/{items.length}
          </p>
          <p className="text-[10px] text-muted-foreground">items included</p>
        </div>
      </div>

      {renderGroup(
        'Essential Credentials',
        essentialItems,
        'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
      )}
      {renderGroup(
        'Security Assets',
        valuableItems,
        'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
      )}
      {renderGroup(
        'Bonus Inclusions',
        bonusItems,
        'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      )}
    </div>
  )
}
