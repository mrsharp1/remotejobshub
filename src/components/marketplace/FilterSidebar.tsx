import React from 'react'
import { X, RotateCcw, ShieldCheck } from 'lucide-react'

const MARKETPLACE_PLATFORMS = [
  'Outlier',
  'Handshake',
  'DataAnnotation',
  'TELUS',
  'Scale AI',
  'Appen',
  'OneForma',
]

interface FilterSidebarProps {
  selectedPlatforms: string[]
  onTogglePlatform: (platform: string) => void
  minPrice: string
  onMinPriceChange: (val: string) => void
  maxPrice: string
  onMaxPriceChange: (val: string) => void
  sellerVerified: boolean
  onSellerVerifiedChange: (val: boolean) => void
  sortBy: string
  onSortByChange: (val: string) => void
  onClearFilters: () => void
  isOpen?: boolean
  onClose?: () => void
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedPlatforms,
  onTogglePlatform,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sellerVerified,
  onSellerVerifiedChange,
  sortBy,
  onSortByChange,
  onClearFilters,
  isOpen = false,
  onClose,
}) => {
  const content = (
    <div className="space-y-6">
      {/* Sort By */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="newest">Newest First</option>
          <option value="income-desc">Highest Income</option>
          <option value="price-asc">Lowest Price</option>
          <option value="price-desc">Highest Price</option>
        </select>
      </div>

      {/* Platform Checklist */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Platforms
        </label>
        <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
          {MARKETPLACE_PLATFORMS.map((p) => {
            const isChecked = selectedPlatforms.includes(p)
            return (
              <label
                key={p}
                className="flex cursor-pointer select-none items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onTogglePlatform(p)}
                  className="rounded border-input text-primary focus:ring-ring"
                />
                {p}
              </label>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Min"
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Max"
            className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Seller Verification status */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Verification
        </label>
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={sellerVerified}
            onChange={(e) => onSellerVerifiedChange(e.target.checked)}
            className="rounded border-input text-primary focus:ring-ring"
          />
          <ShieldCheck className="h-4 w-4 text-primary" /> Verified Sellers Only
        </label>
      </div>

      {/* Reset Filters */}
      <button
        onClick={onClearFilters}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-xs font-semibold text-foreground hover:bg-muted"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Clear All Filters
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer Layout */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col space-y-4 border-r border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading text-base font-bold text-foreground">
                Filter Listings
              </h3>
              <button
                onClick={onClose}
                className="rounded p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">{content}</div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Layout */}
      <div className="sticky top-24 hidden w-64 self-start rounded-xl border border-border bg-card p-6 shadow-sm md:block">
        <h3 className="mb-4 border-b pb-3 font-heading text-sm font-bold text-foreground">
          Filters
        </h3>
        {content}
      </div>
    </>
  )
}
