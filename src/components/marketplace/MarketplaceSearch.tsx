import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { CountrySelect } from './CountrySelect'

const MARKETPLACE_PLATFORMS = [
  'Outlier',
  'Handshake',
  'DataAnnotation',
  'TELUS',
  'Scale AI',
  'Appen',
  'OneForma',
]

interface MarketplaceSearchProps {
  keyword: string
  onKeywordChange: (val: string) => void
  platform: string
  onPlatformChange: (val: string) => void
  country: string
  onCountryChange: (val: string) => void
  onToggleFilterDrawer?: () => void
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  keyword,
  onKeywordChange,
  platform,
  onPlatformChange,
  country,
  onCountryChange,
  onToggleFilterDrawer,
}) => {
  return (
    <div className="relative mx-auto max-w-4xl space-y-4 rounded-[2rem] border border-white/10 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-2xl transition-all hover:border-white/20 md:flex md:items-center md:gap-3 md:space-y-0">
      {/* Keyword Search */}
      <div className="group relative flex-1">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-400" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Search listings by title, seller or description..."
          className="h-14 w-full rounded-2xl border border-transparent bg-slate-950/50 py-3 pl-14 pr-24 text-base font-medium text-white transition-all placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {!keyword && (
            <div className="hidden md:flex items-center gap-1 rounded-md border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400">
              <span className="text-sm leading-none">⌘</span>K
            </div>
          )}
          {keyword && (
            <button
              onClick={() => onKeywordChange('')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Platform Filter */}
      <div className="relative w-full md:w-56">
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="h-14 w-full appearance-none rounded-2xl border border-transparent bg-slate-950/50 py-3 pl-5 pr-10 text-base font-medium text-white transition-all focus:border-purple-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
        >
          <option value="">All Platforms</option>
          {MARKETPLACE_PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          ▼
        </span>
      </div>

      {/* Country Filter */}
      <div className="relative w-full md:w-56">
        <CountrySelect value={country} onChange={onCountryChange} />
      </div>

      {/* Mobile Filter Toggle */}
      {onToggleFilterDrawer && (
        <button
          onClick={onToggleFilterDrawer}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800/50 text-base font-semibold text-white transition-colors hover:bg-slate-700 md:hidden"
        >
          <Filter className="h-5 w-5" /> Filters
        </button>
      )}
    </div>
  )
}
