import React from 'react'
import {
  ShieldCheck,
  Lock,
  BadgeCheck,
  ArrowRightLeft,
  UserCheck,
  Headphones,
  DollarSign,
} from 'lucide-react'

interface BuyerProtectionBannerProps {
  variant?: 'horizontal' | 'grid'
  className?: string
}

const TRUST_ITEMS = [
  {
    icon: Lock,
    label: 'Escrow Protected',
    description: 'Funds held securely until delivery confirmed',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: DollarSign,
    label: 'Money-Back Guarantee',
    description: '14-day full refund if transfer fails',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BadgeCheck,
    label: 'Verified Sellers',
    description: 'All sellers are KYC & identity verified',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: ArrowRightLeft,
    label: 'Secure Transfer',
    description: 'Guided 8-step ownership transfer wizard',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: ShieldCheck,
    label: 'Fraud Protection',
    description: 'AI-powered fraud detection on every listing',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: UserCheck,
    label: 'KYC Verified',
    description: 'Sellers pass strict identity checks',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Headphones,
    label: 'Support Included',
    description: '24/7 dispute resolution & post-sale help',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
  },
]

export const BuyerProtectionBanner: React.FC<BuyerProtectionBannerProps> = ({
  variant = 'horizontal',
  className = '',
}) => {
  if (variant === 'grid') {
    return (
      <div
        className={`rounded-[24px] border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl ${className}`}
      >
        <h3 className="mb-6 font-heading text-lg font-bold text-white">
          Buyer Protection Guarantees
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_ITEMS.slice(0, 4).map((item) => (
            <div
              key={item.label}
              className={`flex flex-col items-center gap-3 rounded-2xl border border-white/5 ${item.bg} p-5 text-center transition-colors hover:bg-white/5`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-inner`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${item.color}`}>{item.label}</p>
              <p className="text-xs leading-relaxed text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-lg ${className}`}
    >
      <div className="scrollbar-hide flex items-center gap-0 overflow-x-auto">
        <div className="shrink-0 border-r border-white/10 px-5 py-3.5 lg:px-6">
          <p className="whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400">
            Buyer Protection
          </p>
        </div>
        {TRUST_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={`flex shrink-0 items-center gap-2 px-5 py-3.5 transition-colors hover:bg-white/5 ${i < TRUST_ITEMS.length - 1 ? 'border-r border-white/10' : ''}`}
          >
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="whitespace-nowrap text-xs font-bold tracking-wide text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
