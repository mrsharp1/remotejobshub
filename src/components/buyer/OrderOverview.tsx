import React from 'react'
import { Clock, Key, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { Order } from '@/types'
import { getOrderStatusDisplayLabel } from '@/utils/OrderStatusMapper'

interface OrderOverviewProps {
  orders: Order[]
}

export const OrderOverview: React.FC<OrderOverviewProps> = ({ orders }) => {
  const total = orders.length || 1 // prevent div by 0 for percentages

  const metrics = [
    {
      id: 'awaiting',
      label: getOrderStatusDisplayLabel('seller_processing'),
      count: orders.filter((o) => o.status === 'payment_received' || o.status === 'seller_processing').length,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'ready',
      label: getOrderStatusDisplayLabel('buyer_review'),
      count: orders.filter((o) => o.status === 'buyer_review').length,
      icon: Key,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      id: 'completed',
      label: getOrderStatusDisplayLabel('completed'),
      count: orders.filter((o) => o.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'disputed',
      label: getOrderStatusDisplayLabel('disputed'),
      count: orders.filter((o) => o.status === 'disputed').length,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      id: 'cancelled',
      label: getOrderStatusDisplayLabel('cancelled'),
      count: orders.filter((o) => o.status === 'cancelled').length,
      icon: XCircle,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m) => {
        const pct = Math.round((m.count / total) * 100)
        return (
          <div key={m.id} className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.bg} ${m.color}`}>
                <m.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{pct}%</span>
            </div>
            <div>
              <div className="font-heading text-2xl font-black text-white">{m.count}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
