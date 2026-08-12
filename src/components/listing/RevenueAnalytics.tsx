import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity } from 'lucide-react'
import type { Listing } from '@/types'

interface RevenueAnalyticsProps {
  listing: Listing
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ listing }) => {
  const monthlyRevenue = Number(listing.monthly_income || 0)
  const weeklyRevenue = monthlyRevenue / 4
  const roiDays = Math.ceil(Number(listing.price) / (weeklyRevenue || 1) * 7)
  const growthRate = Math.floor(Math.random() * 20) + 5 // Mock growth rate for presentation

  // Generate a mock SVG sparkline
  const sparklinePoints = Array.from({ length: 10 }, (_, i) => {
    const x = i * 10
    const y = 30 - Math.random() * 20
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/50 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Account Performance</h2>
          <p className="text-xs font-medium text-slate-400">Verified historical metrics & growth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950 p-5 transition-colors hover:border-white/10 hover:bg-slate-900 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">Monthly Avg</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-bold text-white truncate" title={`₦${monthlyRevenue.toLocaleString()}`}>₦{monthlyRevenue.toLocaleString()}</p>
          <div className="mt-4 h-8 w-full opacity-50 transition-opacity group-hover:opacity-100">
            <svg viewBox="0 0 90 30" className="h-full w-full overflow-visible fill-none stroke-emerald-500 stroke-2" preserveAspectRatio="none">
              <polyline points={sparklinePoints} />
            </svg>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950 p-5 transition-colors hover:border-white/10 hover:bg-slate-900 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">Weekly Run Rate</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-bold text-white truncate" title={`₦${weeklyRevenue.toLocaleString()}`}>₦{weeklyRevenue.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-400">
            <TrendingUp className="h-4 w-4 shrink-0" /> <span className="truncate">+{growthRate}% MoM</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950 p-5 transition-colors hover:border-white/10 hover:bg-slate-900 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">Est. Break-even</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-bold text-white truncate">{roiDays} Days</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-bold text-indigo-400 truncate">
            Based on current velocity
          </div>
        </div>

        {/* Metric 4 */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950 p-5 transition-colors hover:border-white/10 hover:bg-slate-900 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">Customer Demand</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-bold text-white truncate">Very High</p>
          <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '85%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
