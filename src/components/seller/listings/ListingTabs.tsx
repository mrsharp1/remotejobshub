import React from 'react'

interface ListingTabsProps {
  activeTab: string
  onTabChange: (status: string) => void
  counts: Record<string, number>
}

export const ListingTabs: React.FC<ListingTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs = [
    { key: 'all', label: 'All Listings' },
    { key: 'draft', label: 'Draft' },
    { key: 'submitted', label: 'Pending Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'paused', label: 'Paused' },
    { key: 'sold', label: 'Sold' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <div className="flex gap-2 border-b border-white/5 pb-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
      {tabs.map((tab) => {
        const isCurrent = activeTab === tab.key
        const count = counts[tab.key] || 0
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-bold transition shrink-0 ${
              isCurrent
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                isCurrent ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-900 text-slate-500'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
