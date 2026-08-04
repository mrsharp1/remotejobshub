import React from 'react'
import { X, RotateCcw, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { springs } from '@/lib/framer-physics'

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
    <div className="space-y-8">
      {/* Sort By */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Sort By
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white transition-all focus:border-indigo-500/50 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="newest">Newest First</option>
            <option value="income-desc">Highest Income</option>
            <option value="price-asc">Lowest Price</option>
            <option value="price-desc">Highest Price</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            ▼
          </span>
        </div>
      </div>

      {/* Platform Checklist */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Platforms
        </label>
        <div className="max-h-56 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {MARKETPLACE_PLATFORMS.map((p) => {
            const isChecked = selectedPlatforms.includes(p)
            return (
              <label
                key={p}
                className="group flex cursor-pointer select-none items-center gap-3 rounded-lg p-1 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                <div className="relative flex h-5 w-5 items-center justify-center rounded border border-white/20 bg-slate-900/50 transition-colors group-hover:border-indigo-500/50">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onTogglePlatform(p)}
                    className="peer absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className={`pointer-events-none absolute inset-0 rounded transition-colors ${isChecked ? 'bg-indigo-500' : 'bg-transparent'}`} />
                  {isChecked && <svg className="pointer-events-none relative z-10 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                {p}
              </label>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Min"
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white transition-all placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Max"
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white transition-all placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* Seller Verification status */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Trust & Security
        </label>
        <label className="group flex cursor-pointer select-none items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm font-bold text-white transition-colors hover:bg-emerald-500/10">
          <div className="relative flex h-5 w-5 items-center justify-center rounded border border-emerald-500/40 bg-emerald-500/20 transition-colors">
            <input
              type="checkbox"
              checked={sellerVerified}
              onChange={(e) => onSellerVerifiedChange(e.target.checked)}
              className="peer absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className={`pointer-events-none absolute inset-0 rounded transition-colors ${sellerVerified ? 'bg-emerald-500' : 'bg-transparent'}`} />
            {sellerVerified && <svg className="pointer-events-none relative z-10 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Verified Sellers Only
          </div>
        </label>
      </div>

      {/* Reset Filters */}
      <div className="pt-2">
        <button
          onClick={onClearFilters}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800/50 py-3.5 text-sm font-bold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" /> Clear All Filters
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Bottom Sheet Layout */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={springs.snappy}
              className="relative z-50 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[2.5rem] border-t border-white/10 bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                <h3 className="font-heading text-lg font-black text-white">
                  Filters
                </h3>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6 pb-20">{content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Floating Sidebar Layout */}
      <div className="sticky top-24 hidden w-full rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl transition-all md:block lg:w-[280px]">
        <h3 className="mb-6 font-heading text-lg font-black text-white">
          Filters
        </h3>
        {content}
      </div>
    </>
  )
}
