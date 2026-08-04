import React from 'react'
import { Search } from 'lucide-react'

interface ModerationFiltersProps {
  search: string
  onSearchChange: (val: string) => void
  status: string
  onStatusChange: (val: string) => void
  platform: string
  onPlatformChange: (val: string) => void
  platformsList: string[]
  sort: string
  onSortChange: (val: any) => void
  riskLevel: string
  onRiskLevelChange: (val: string) => void
}

export const ModerationFilters: React.FC<ModerationFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  platform,
  onPlatformChange,
  platformsList,
  sort,
  onSortChange,
  riskLevel,
  onRiskLevelChange,
}) => {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-card md:grid-cols-12 text-xs">
      
      {/* Search text */}
      <div className="relative md:col-span-4">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-405" />
        <input
          type="text"
          placeholder="Search listing title, platform, seller ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Platform Select */}
      <div className="md:col-span-2">
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-2.5 text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
        >
          <option value="all">All Networks</option>
          {platformsList.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Status filter */}
      <div className="md:col-span-2">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-2.5 text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Audit</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived/Paused</option>
        </select>
      </div>

      {/* Risk Select filter */}
      <div className="md:col-span-2">
        <select
          value={riskLevel}
          onChange={(e) => onRiskLevelChange(e.target.value)}
          className="w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-2.5 text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>
      </div>

      {/* Sort selection */}
      <div className="md:col-span-2">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-2.5 text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
        >
          <option value="newest">Newest Submitted</option>
          <option value="oldest">Oldest Submitted</option>
        </select>
      </div>
    </div>
  )
}
