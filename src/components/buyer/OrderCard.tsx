import React from 'react'
import { ChevronRight, ShieldCheck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import type { Order } from '@/types'
import { getPremiumOrderStatus, getOrderStatusDisplayLabel } from '@/utils/OrderStatusMapper'

interface OrderCardProps {
  order: Order
  onClick: (order: Order) => void
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const getStatusDisplay = (status: Order['status']) => {
    const premiumStatus = getPremiumOrderStatus(status)
    const label = getOrderStatusDisplayLabel(status)

    switch (premiumStatus) {
      case 'PAYMENT_RECEIVED':
      case 'ESCROW_LOCKED':
      case 'SELLER_DELIVERING':
        return { label, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' }
      case 'CREDENTIALS_DELIVERED':
      case 'BUYER_VERIFYING':
        return { label, icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' }
      case 'COMPLETED':
        return { label, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
      case 'DISPUTED':
        return { label, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' }
      default:
        return { label, icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10' }
    }
  }

  const status = getStatusDisplay(order.status)

  return (
    <div 
      onClick={() => onClick(order)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm transition-all hover:bg-slate-900/50 hover:shadow-xl"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Info Section */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              {order.listing?.platform || 'Platform'}
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-heading text-base font-bold text-white line-clamp-1">
            {order.listing?.title || 'Secured Asset'}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-mono">ORD-{order.id.slice(0, 6).toUpperCase()}</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Seller: {order.seller?.full_name || 'Verified Vendor'}</span>
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <div className="text-left sm:text-right">
            <div className="font-heading text-lg font-black text-white">
              ₦{Number(order.amount).toLocaleString()}
            </div>
            <div className={`mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
              <status.icon className="h-3 w-3" />
              {status.label}
            </div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
        
      </div>
    </div>
  )
}
