import React from 'react'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import type { Order } from '@/types'
import { formatCurrency } from '@/utils/currency'

interface SettlementHeroProps {
  order: Order
}

export const SettlementHero: React.FC<SettlementHeroProps> = ({ order }) => {
  const commission = order.amount * 0.05
  const sellerPayout = order.amount - commission

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950 p-6 sm:p-10">
      {/* Background glowing effects */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-indigo-400" /> Escrow Settlement Engine
          </div>
          
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-black text-white sm:text-4xl">
              Settlement Pending
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Buyer Verified
              </span>
              <span className="text-slate-600">•</span>
              <span>Seller Waiting</span>
              <span className="text-slate-600">•</span>
              <span>Escrow Ready</span>
            </div>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="flex shrink-0 gap-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-900/50 p-6 px-8 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Escrow Amount</p>
            <p className="font-heading text-2xl font-black text-white">{formatCurrency(order.amount)}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 px-8 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Seller Payout</p>
            <p className="font-heading text-2xl font-black text-emerald-400">{formatCurrency(sellerPayout)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
