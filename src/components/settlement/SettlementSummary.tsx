import React from 'react'
import type { Order } from '@/types'
import { Hash, Calendar, Clock, CreditCard } from 'lucide-react'

interface SettlementSummaryProps {
  order: Order
}

export const SettlementSummary: React.FC<SettlementSummaryProps> = ({ order }) => {
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Settlement Summary
      </h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Hash className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Order ID</span>
            <span className="mt-0.5 block font-mono text-sm font-bold text-white">ORD-{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">References</span>
            <span className="mt-0.5 block font-mono text-xs text-white">STL-{order.id.slice(0, 6).toUpperCase()}</span>
            <span className="mt-0.5 block font-mono text-xs text-slate-500">TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Release Date</span>
            <span className="mt-0.5 block text-sm font-bold text-white">{date}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Release Time</span>
            <span className="mt-0.5 block text-sm font-bold text-white">{time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
