import React from 'react'
import type { Order } from '@/types'
import { TrendingUp, BarChart3, PieChart } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface RevenuePanelProps {
  order: Order
}

export const RevenuePanel: React.FC<RevenuePanelProps> = ({ order }) => {
  const commission = order.amount * 0.05

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Platform Revenue
      </h3>
      
      <div className="flex flex-col gap-4">
        {/* Commission Earned from this order */}
        <div className="group flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-300">Commission Earned</span>
              <span className="block text-[10px] text-slate-500">From this transaction</span>
            </div>
          </div>
          <span className="font-mono text-lg font-bold text-indigo-400">+{formatCurrency(commission)}</span>
        </div>

        {/* Mock Data for Today's Revenue */}
        <div className="group flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-300">Today's Revenue</span>
              <span className="block text-[10px] text-slate-500">Total platform commission</span>
            </div>
          </div>
          <span className="font-mono text-lg font-bold text-emerald-400">{formatCurrency(12450.50 + commission)}</span>
        </div>

        {/* Mock Data for Escrow Under Management */}
        <div className="group flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4 transition-all hover:border-blue-500/50 hover:bg-blue-500/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-300">Escrow Under Mgmt</span>
              <span className="block text-[10px] text-slate-500">Total locked funds</span>
            </div>
          </div>
          <span className="font-mono text-lg font-bold text-blue-400">₦845,230,000.00</span>
        </div>
      </div>
    </div>
  )
}
