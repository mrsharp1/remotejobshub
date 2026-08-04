import React from 'react'
import { Info } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface PricingPanelProps {
  price: number
  onPriceChange: (val: number) => void
  negotiable: boolean
  onNegotiableChange: (val: boolean) => void
  instantBuy: boolean
  onInstantBuyChange: (val: boolean) => void
}

export const PricingPanel: React.FC<PricingPanelProps> = ({
  price,
  onPriceChange,
  negotiable,
  onNegotiableChange,
  instantBuy,
  onInstantBuyChange,
}) => {
  const platformFee = Math.round(price * 0.1 * 100) / 100
  const sellerReceives = Math.max(0, Math.round((price - platformFee) * 100) / 100)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Inputs block */}
      <div className="md:col-span-2 space-y-4">
        <div>
          <h4 className="font-heading text-base font-bold text-slate-900 dark:text-white">Pricing Model</h4>
          <p className="text-xs text-slate-400 mt-0.5">Determine the sale value and marketplace terms</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">Selling Price (NGN)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-bold text-slate-400">
                ₦
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={price || ''}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 py-3 pl-8 pr-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="hover:bg-slate-50 dark:hover:bg-slate-950/40 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 p-4">
              <input
                type="checkbox"
                checked={negotiable}
                onChange={(e) => onNegotiableChange(e.target.checked)}
                className="h-4 w-4 rounded border-slate-200 text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Negotiable Price</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Accept offers from buyers</p>
              </div>
            </label>

            <label className="hover:bg-slate-50 dark:hover:bg-slate-950/40 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 p-4">
              <input
                type="checkbox"
                checked={instantBuy}
                onChange={(e) => onInstantBuyChange(e.target.checked)}
                className="h-4 w-4 rounded border-slate-200 text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Instant Buy Enabled</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Buyers can clear vault immediately</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Fee Calculation Breakdown Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-white/5 dark:bg-slate-900/60 shadow-sm">
        <div>
          <h5 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Payout Breakdown</h5>
          <p className="text-[9px] text-slate-400 mt-0.5">Platform commission splits</p>
        </div>

        <div className="space-y-3.5 text-xs border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex justify-between">
            <span className="text-slate-450">Listing Price:</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(price || 0)}</span>
          </div>
          <div className="flex justify-between text-rose-500">
            <span className="flex items-center gap-1">
              Platform Fee (10%):
            </span>
            <span className="font-bold">-{formatCurrency(platformFee)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Seller Receives:</span>
          <span className="text-lg font-black text-emerald-500 font-mono">{formatCurrency(sellerReceives)}</span>
        </div>

        <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 flex items-start gap-2 border border-slate-100 dark:border-white/5">
          <Info className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
          <p className="text-[9.5px] leading-tight text-slate-400">
            Escrow protection holds buyer deposit securely. Payout transfers immediately upon credential verification check clearance.
          </p>
        </div>
      </div>
    </div>
  )
}
