import React from 'react'
import type { Order } from '@/types'
import { DollarSign, Percent, Lock } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface PaymentBreakdownProps {
  order: Order
}

export const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({ order }) => {
  const commissionRate = 0.05
  const commission = order.amount * commissionRate
  const processingFee = 0.00 // Absorbed by platform
  const netEarnings = order.amount - commission - processingFee

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Payment Breakdown
      </h3>

      <div className="flex flex-col gap-4">
        {/* Buyer Paid */}
        <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-300">Buyer Paid</span>
          </div>
          <span className="font-mono text-sm font-bold text-white">{formatCurrency(order.amount)}</span>
        </div>

        {/* Platform Commission */}
        <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Percent className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-300">Platform Commission (5%)</span>
          </div>
          <span className="font-mono text-sm font-bold text-rose-400">-{formatCurrency(commission)}</span>
        </div>

        {/* Processing Fee */}
        <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500/10 text-slate-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-slate-300">Processing Fee</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-400">-{formatCurrency(processingFee)}</span>
        </div>

        {/* Divider */}
        <div className="my-2 h-px w-full bg-white/5" />

        {/* Net Earnings */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-bold text-emerald-400">Net Seller Earnings</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-500/70">Escrow Balance</span>
            </div>
          </div>
          <span className="font-mono text-lg font-bold text-emerald-400">{formatCurrency(netEarnings)}</span>
        </div>
      </div>
    </div>
  )
}
