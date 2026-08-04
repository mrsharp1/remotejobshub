import React from 'react'
import { ShieldCheck, Bell, Lock } from 'lucide-react'

interface BuyerHeroProps {
  fullName: string
  activeOrdersCount: number
  escrowBalance: number
  unreadNotifsCount: number
}

export const BuyerHero: React.FC<BuyerHeroProps> = ({
  fullName,
  activeOrdersCount,
  escrowBalance,
  unreadNotifsCount,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-900 p-6 sm:p-8">
      {/* Background gradients */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[80px]" />

      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
            <ShieldCheck className="h-4 w-4" /> Protected Workspace
          </div>
          <div className="space-y-1">
            <h1 className="font-heading text-3xl font-black text-white sm:text-4xl">
              Welcome back, {fullName.split(' ')[0]}
            </h1>
            <p className="text-sm font-medium text-slate-400">
              You have <strong className="text-white">{activeOrdersCount}</strong> active purchases under escrow protection.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-start gap-1 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-md">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Lock className="h-3 w-3" /> Escrow Balance
            </span>
            <span className="font-mono text-2xl font-bold text-white">
              ₦{escrowBalance.toLocaleString()}
            </span>
          </div>

          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
            <Bell className="h-5 w-5 text-slate-300" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-rose-500 text-[10px] font-bold text-white">
                {unreadNotifsCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
