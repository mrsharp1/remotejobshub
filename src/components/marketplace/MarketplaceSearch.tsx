import React from 'react'
import { Search, Globe, Filter } from 'lucide-react'

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
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm md:flex md:items-center md:gap-3 md:space-y-0">
      {/* Keyword Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Search listings by title, seller or description..."
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Platform Filter */}
      <div className="relative w-full md:w-48">
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-input bg-background py-2 pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Platforms</option>
          {MARKETPLACE_PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          ▼
        </span>
      </div>

      {/* Country Filter */}
      <div className="relative w-full md:w-48">
        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          placeholder="Country..."
          className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Mobile Filter Toggle */}
      {onToggleFilterDrawer && (
        <button
          onClick={onToggleFilterDrawer}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-sm font-semibold text-foreground hover:bg-muted md:hidden"
        >
          <Filter className="h-4 w-4" /> Filters
        </button>
      )}
    </div>
  )
}
