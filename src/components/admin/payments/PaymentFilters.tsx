import React from 'react'
import { Search, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react'

interface PaymentFiltersProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  selectedStatus: string
  setSelectedStatus: (val: string) => void
  count: number
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  count,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl md:flex-row md:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search reference, buyer, seller, order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/5 bg-slate-950 py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
        />
      </div>

      {/* Select status dropdown */}
      <div className="relative min-w-[180px]">
        <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-white/5 bg-slate-950 py-3 pl-10 pr-8 text-xs text-white focus:border-indigo-500/50 focus:outline-none"
        >
          <option value="all">All Transactions</option>
          <option value="pending">Escrow Held</option>
          <option value="released">Released Payouts</option>
          <option value="refunded">Refunded Buyers</option>
          <option value="failed">Failed Attempts</option>
        </select>
        <ArrowDownWideNarrow className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
      </div>

      {/* Matches counter */}
      <div className="flex items-center justify-center rounded-xl border border-white/5 bg-slate-950 px-4 py-3 text-xs font-bold text-slate-400">
        {count} Transactions matched
      </div>
    </div>
  )
}
