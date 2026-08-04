import React from 'react'
import { ShieldCheck, BadgeCheck, Zap, Star, Shield, Lock, Activity } from 'lucide-react'

export type BadgeType = 
  | 'verified-seller'
  | 'premium-seller'
  | 'buyer-protection'
  | 'escrow-protected'
  | 'ai-verified'
  | 'fast-delivery'
  | 'top-rated'
  | 'elite-seller'
  | 'low-risk'
  | 'high-success'

interface TrustBadgeProps {
  type: BadgeType
  className?: string
  showText?: boolean
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ type, className = '', showText = true }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'verified-seller':
        return {
          icon: BadgeCheck,
          text: 'Verified Seller',
          colors: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]'
        }
      case 'premium-seller':
        return {
          icon: Star,
          text: 'Premium Seller',
          colors: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]'
        }
      case 'buyer-protection':
        return {
          icon: Shield,
          text: 'Buyer Protection',
          colors: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]'
        }
      case 'escrow-protected':
        return {
          icon: Lock,
          text: 'Escrow Protected',
          colors: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]'
        }
      case 'ai-verified':
        return {
          icon: Activity,
          text: 'AI Verified',
          colors: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]'
        }
      case 'fast-delivery':
        return {
          icon: Zap,
          text: 'Fast Delivery',
          colors: 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)]'
        }
      case 'top-rated':
        return {
          icon: Star,
          text: 'Top Rated',
          colors: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_-3px_rgba(234,179,8,0.2)]'
        }
      case 'elite-seller':
        return {
          icon: ShieldCheck,
          text: 'Elite Seller',
          colors: 'bg-white/10 text-white border-white/20 shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)] backdrop-blur-md'
        }
      case 'low-risk':
        return {
          icon: ShieldCheck,
          text: 'Low Risk',
          colors: 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_15px_-3px_rgba(20,184,166,0.2)]'
        }
      case 'high-success':
        return {
          icon: Activity,
          text: 'High Success Rate',
          colors: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]'
        }
    }
  }

  const config = getBadgeConfig()
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border tracking-wide ${config.colors} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {showText && <span>{config.text}</span>}
    </div>
  )
}
