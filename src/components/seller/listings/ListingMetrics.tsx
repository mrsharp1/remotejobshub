import React from 'react'
import { Sparkles, Eye, ShieldCheck, DollarSign, Percent, Ban, Hourglass } from 'lucide-react'

interface ListingMetricsProps {
  stats: {
    active: number
    pending: number
    sold: number
    paused: number
    drafts: number
    revenue: number
    views: number
    conversion: number
  }
}

export const ListingMetrics: React.FC<ListingMetricsProps> = ({ stats }) => {
  const cards = [
    { label: 'Active Listings', val: stats.active, trend: 'Live on feed', icon: Sparkles, color: 'text-emerald-450 bg-emerald-500/10' },
    { label: 'Pending Review', val: stats.pending, trend: 'Moderation queue', icon: Hourglass, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Sold Accounts', val: stats.sold, trend: 'Cleared payout', icon: ShieldCheck, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Paused Listings', val: stats.paused, trend: 'Inactive lists', icon: Ban, color: 'text-indigo-400 bg-indigo-500/10' },
    { label: 'Total Revenue', val: `₦${stats.revenue.toLocaleString()}`, trend: '+₦2,400 this week', icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Marketplace Views', val: stats.views.toLocaleString(), trend: '+18% exposure', icon: Eye, color: 'text-indigo-400 bg-indigo-500/10' },
    { label: 'Conversion Rate', val: `${stats.conversion}%`, trend: 'Top 5% on platform', icon: Percent, color: 'text-purple-400 bg-purple-500/10' },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {cards.map((c, idx) => {
        const Icon = c.icon
        return (
          <div
            key={idx}
            className={`rounded-2xl border border-border bg-card p-4 space-y-3 transition duration-300 hover:scale-[1.02] ${
              idx === cards.length - 1 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{c.label}</span>
              <div className={`rounded-lg p-1.5 ${c.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div>
              <p className="font-heading text-lg font-black text-foreground font-mono">{c.val}</p>
              <span className="text-[9px] text-muted-foreground mt-0.5 block leading-tight">{c.trend}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
