import React from 'react'
import { ShieldCheck, Lock, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

export type TrustBadgeType = 'encryption' | 'escrow' | 'verified' | 'soc2'

interface TrustBadgeProps {
  type: TrustBadgeType
  className?: string
  variant?: 'minimal' | 'full'
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ type, className, variant = 'full' }) => {
  const config = {
    encryption: {
      icon: <Lock className="h-3.5 w-3.5" />,
      text: 'AES-256 Encrypted',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    escrow: {
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      text: 'Escrow Protected',
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10'
    },
    verified: {
      icon: <CheckCircle className="h-3.5 w-3.5" />,
      text: 'Identity Verified',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    soc2: {
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      text: 'SOC 2 Ready',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  }

  const { icon, text, color, bg } = config[type]

  if (variant === 'minimal') {
    return (
      <div className={clsx('flex items-center gap-1.5 text-xs font-semibold', color, className)} title={text}>
        {icon}
        <span>{text}</span>
      </div>
    )
  }

  return (
    <div className={clsx('inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold', color, bg, className)}>
      {icon}
      <span>{text}</span>
    </div>
  )
}
