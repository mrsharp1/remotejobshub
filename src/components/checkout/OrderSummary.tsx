import React from 'react'
import { Percent, Globe, AlertCircle } from 'lucide-react'
import type { Listing } from '@/types'
import { formatCurrency } from '@/utils/currency'

interface OrderSummaryProps {
  listing: Listing
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ listing }) => {
  const price = Number(listing.price)
  const commission = price * 0.05 // 5% fee example
  const total = price + commission

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/50 p-6 backdrop-blur-xl sm:p-8">
      <h3 className="font-heading text-lg font-bold text-white">Order Summary</h3>

      <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-slate-950 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
          <Globe className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-4">
            <h4 className="font-heading text-sm font-bold text-white line-clamp-2">
              {listing.title}
            </h4>
            <span className="shrink-0 font-mono text-sm font-bold text-white">
              {formatCurrency(price)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>{listing.platform}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>{listing.country}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>Seller: {listing.seller?.full_name || 'Verified Vendor'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 text-sm">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            Listing Price
          </span>
          <span className="font-mono text-slate-300">{formatCurrency(price)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            Remote Job Hub Commission (5%)
            <Percent className="h-3 w-3" />
          </span>
          <span className="font-mono text-slate-300">{formatCurrency(commission)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            Taxes
          </span>
          <span className="font-mono text-slate-300">Calculated at next step</span>
        </div>
        
        <div className="border-t border-white/5 pt-4">
          <div className="flex items-end justify-between">
            <span className="text-base font-bold text-white">Total Amount</span>
            <div className="text-right">
              <span className="block font-heading text-3xl font-black text-indigo-400">
                {formatCurrency(total)}
              </span>
              <span className="text-xs font-medium text-slate-500">NGN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-indigo-500/10 p-3 text-xs leading-relaxed text-indigo-300">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Your payment is processed by Remote Job Hub. The seller will not see your payment details.</p>
      </div>
    </div>
  )
}
