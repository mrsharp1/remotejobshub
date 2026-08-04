import React from 'react'
import { Inbox, Clock, Percent, AlertOctagon, Archive, ShieldAlert } from 'lucide-react'

interface ModerationMetricsProps {
  stats: {
    pending: number
    avgTime: string
    approvalRate: number
    rejected: number
    fraudAlerts: number
    inventory: number
  }
}

export const ModerationMetrics: React.FC<ModerationMetricsProps> = ({ stats }) => {
  const cards = [
    { label: 'Pending Queue', val: stats.pending, trend: 'Awaiting moderation', icon: Inbox, color: 'text-purple-600 bg-purple-500/10' },
    { label: 'Avg Review Time', val: stats.avgTime, trend: 'Target: < 4 hours', icon: Clock, color: 'text-indigo-600 bg-indigo-500/10' },
    { label: 'Approval Rate', val: `${stats.approvalRate}%`, trend: 'Audit acceptance rate', icon: Percent, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'Rejected Listings', val: stats.rejected, trend: 'Flagged compliance issues', icon: AlertOctagon, color: 'text-rose-600 bg-rose-500/10' },
    { label: 'Fraud Alerts', val: stats.fraudAlerts, trend: 'Suspicious coordinates flag', icon: ShieldAlert, color: 'text-rose-700 bg-rose-500/10 animate-pulse' },
    { label: 'Inventory Count', val: stats.inventory, trend: 'Published marketplace assets', icon: Archive, color: 'text-purple-600 bg-purple-500/10' },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((c, idx) => {
        const Icon = c.icon
        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-4.5 space-y-3 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm transition hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-450">{c.label}</span>
              <div className={`rounded-xl p-1.5 shrink-0 ${c.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div>
              <p className="font-heading text-xl font-black text-slate-900 dark:text-white font-mono">{c.val}</p>
              <span className="text-[9.5px] text-slate-400 mt-0.5 block leading-tight">{c.trend}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
