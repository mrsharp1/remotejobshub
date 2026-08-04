import React, { useState } from 'react'
import { Calculator } from 'lucide-react'
import type { Listing } from '@/types'

interface RoiCalculatorProps {
  listing: Listing
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ listing }) => {
  const defaultWeekly = Number(listing.monthly_income || 0) / 4
  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(defaultWeekly || 50000)
  
  const purchasePrice = Number(listing.price) || 1
  const validWeekly = weeklyEarnings > 0 ? weeklyEarnings : 1
  
  const breakEvenDays = Math.ceil((purchasePrice / validWeekly) * 7)
  const roi30 = Math.floor(((validWeekly * 4.3) - purchasePrice) / purchasePrice * 100)
  const roi90 = Math.floor(((validWeekly * 13) - purchasePrice) / purchasePrice * 100)
  const roiAnnual = Math.floor(((validWeekly * 52) - purchasePrice) / purchasePrice * 100)

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Investment ROI Calculator</h2>
          <p className="text-xs font-medium text-slate-400">Estimate your potential returns based on work volume</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchase Price</label>
            <div className="mt-1 flex h-12 w-full items-center rounded-xl bg-slate-950 px-4 font-mono text-lg font-bold text-slate-500">
              ₦{purchasePrice.toLocaleString()}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Weekly Earnings (₦)</label>
            <input
              type="number"
              value={weeklyEarnings}
              onChange={(e) => setWeeklyEarnings(Number(e.target.value))}
              className="mt-1 flex h-12 w-full items-center rounded-xl border border-white/10 bg-slate-950 px-4 font-mono text-lg font-bold text-white transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-slate-950 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Break-even Point</p>
            <p className="mt-1 font-mono text-xl font-bold text-white">{breakEvenDays} Days</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">30-Day ROI</p>
            <p className={`mt-1 font-mono text-xl font-bold ${roi30 > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {roi30 > 0 ? '+' : ''}{roi30}%
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">90-Day ROI</p>
            <p className={`mt-1 font-mono text-xl font-bold ${roi90 > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {roi90 > 0 ? '+' : ''}{roi90}%
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Annual ROI</p>
            <p className={`mt-1 font-mono text-xl font-bold ${roiAnnual > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {roiAnnual > 0 ? '+' : ''}{roiAnnual}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
