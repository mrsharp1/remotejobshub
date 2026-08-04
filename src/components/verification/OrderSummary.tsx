import React from 'react'
import type { Order } from '@/types'
import { Calendar, Hash, ShieldCheck, User } from 'lucide-react'

interface OrderSummaryProps {
  order: Order
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const purchaseDate = new Date(order.created_at).toLocaleDateString()
  
  const updatedTime = new Date(order.updated_at || order.created_at).getTime()
  const deadlineDate = new Date(updatedTime + (3 * 24 * 60 * 60 * 1000)).toLocaleDateString()

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Order Verification Summary
      </h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <User className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Platform & Seller</span>
            <span className="mt-0.5 block text-sm font-bold text-white">{order.listing?.platform || 'Digital Asset'}</span>
            <span className="mt-0.5 block text-xs text-slate-500">{order.seller?.full_name || 'Verified Vendor'}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Timeline</span>
            <span className="mt-0.5 block text-sm font-bold text-white">Purchased: {purchaseDate}</span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-amber-500">
              <ShieldCheck className="h-3 w-3" />
              Deadline: {deadlineDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
