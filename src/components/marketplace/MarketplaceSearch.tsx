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
  activeFiltersCount?: number
  selectedPlatforms?: string[]
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  keyword,
  onKeywordChange,
  platform,
  onPlatformChange,
  country,
  onCountryChange,
  onToggleFilterDrawer,
  activeFiltersCount = 0,
  selectedPlatforms = [],
}) => {
  return (
    <div className="relative mx-auto max-w-4xl rounded-2xl border border-white/10 bg-slate-900/60 p-2 shadow-xl backdrop-blur-2xl transition-all hover:border-white/20 md:rounded-[2rem] md:p-3">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Keyword Search */}
        <div className="group relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-400 md:left-5 md:h-5 md:w-5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search listings..."
            className="h-11 w-full rounded-xl border border-transparent bg-slate-950/50 py-2 pl-10 pr-10 text-sm font-medium text-white transition-all placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 sm:h-12 md:h-14 md:rounded-2xl md:py-3 md:pl-14 md:pr-24 md:text-base"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 md:right-4">
            {!keyword && (
              <div className="hidden items-center gap-1 rounded-md border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400 md:flex">
                <span className="text-sm leading-none">⌘</span>K
              </div>
            )}
            {keyword && (
              <button
                onClick={() => onKeywordChange('')}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white md:h-8 md:w-8"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Platform Filter (Desktop) */}
        <div className="relative hidden w-full md:block md:w-56">
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

        {/* Country Filter (Desktop) */}
        <div className="relative hidden w-full md:block md:w-56">
          <CountrySelect value={country} onChange={onCountryChange} />
        </div>

        {/* Mobile Filter Toggle */}
        {onToggleFilterDrawer && (
          <button
            onClick={onToggleFilterDrawer}
            className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-700 active:scale-95 sm:h-12 sm:px-4 sm:text-sm md:hidden"
            aria-label="Open filter options"
          >
            <Filter className="h-4 w-4 text-indigo-400" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Mobile Active Filter Chips */}
      {(platform || country || selectedPlatforms.length > 0) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 px-0.5 pt-0.5 md:hidden">
          {platform && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-200">
              <span>Platform: <strong className="font-bold text-white">{platform}</strong></span>
              <button
                type="button"
                onClick={() => onPlatformChange('')}
                className="ml-0.5 rounded p-0.5 text-indigo-300 transition-colors hover:bg-indigo-500/30 hover:text-white"
                aria-label={`Remove ${platform} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {country && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-xs font-medium text-slate-200">
              <span>Country: <strong className="font-bold text-white">{country}</strong></span>
              <button
                type="button"
                onClick={() => onCountryChange('')}
                className="ml-0.5 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                aria-label="Remove country filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
