import React from 'react'
import { ShieldCheck, Sparkles, Award } from 'lucide-react'

type TrustRibbonType = 'verified' | 'premium' | 'escrow' | 'top-rated'

interface TrustRibbonProps {
  type: TrustRibbonType
  className?: string
}

export const TrustRibbon: React.FC<TrustRibbonProps> = ({
  type,
  className = '',
}) => {
  const configs = {
    verified: {
      text: 'Verified Seller',
      bg: 'bg-emerald-500',
      textClass: 'text-white',
      icon: ShieldCheck,
    },
    premium: {
      text: 'Premium Account',
      bg: 'bg-indigo-600',
      textClass: 'text-white',
      icon: Sparkles,
    },
    escrow: {
      text: 'Escrow Protected',
      bg: 'bg-slate-900',
      textClass: 'text-white',
      icon: ShieldCheck,
    },
    'top-rated': {
      text: 'Top Rated Seller',
      bg: 'bg-amber-500',
      textClass: 'text-white',
      icon: Award,
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div
      className={`absolute -right-12 top-6 z-20 w-40 rotate-45 text-center shadow-md ${config.bg} ${className}`}
    >
      <div
        className={`flex items-center justify-center gap-1 py-1 text-[9px] font-black uppercase tracking-wider ${config.textClass}`}
      >
        <Icon className="h-3 w-3" />
        {config.text}
      </div>
    </div>
  )
}
