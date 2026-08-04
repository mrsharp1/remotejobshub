import React from 'react'
import { Users, Globe, Activity, DollarSign, CheckCircle, MessageSquare } from 'lucide-react'
import { useCMSStore, GlobalStats } from '@/services/cms/cms.store'

export const GlobalStatisticsManager: React.FC = () => {
  const { globalStats, globalStatsDraft, updateGlobalStatsDraft } = useCMSStore()
  const stats = globalStatsDraft || globalStats

  const handleChange = (field: keyof GlobalStats, value: string) => {
    updateGlobalStatsDraft({
      ...stats,
      [field]: value
    })
  }

  const statFields: { key: keyof GlobalStats; label: string; icon: React.ElementType }[] = [
    { key: 'users', label: 'Registered Users', icon: Users },
    { key: 'transactions', label: 'Total Transactions', icon: Activity },
    { key: 'escrowVolume', label: 'Total Escrow Volume', icon: DollarSign },
    { key: 'activeEscrow', label: 'Currently in Escrow', icon: DollarSign },
    { key: 'countries', label: 'Countries Supported', icon: Globe },
    { key: 'responseTime', label: 'Avg Support Response', icon: Activity },
    { key: 'communityMembers', label: 'Community Members', icon: Users },
    { key: 'dailyDiscussions', label: 'Daily Discussions', icon: MessageSquare },
    { key: 'escrowSuccess', label: 'Escrow Success Rate', icon: CheckCircle },
    { key: 'eventsHosted', label: 'Events Hosted', icon: Activity },
    { key: 'onlineNow', label: 'Online Members', icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Global Statistics Sync</h3>
        <p className="text-sm text-slate-500">
          These statistics are synchronized globally across the Homepage, About page, Community page, and Footer. Changing a value here updates it everywhere instantly.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statFields.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/50 space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Icon className="h-4 w-4 text-primary" /> {label}
            </label>
            <input
              type="text"
              value={stats[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded-lg border bg-white p-3 text-lg font-bold text-slate-900 focus:outline-none dark:bg-slate-950 dark:text-white"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
