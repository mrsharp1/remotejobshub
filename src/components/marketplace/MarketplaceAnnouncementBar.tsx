import React, { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

export const MarketplaceAnnouncementBar: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpandedMobile, setIsExpandedMobile] = useState(false)

  if (isDismissed) return null

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDismissed(true)
  }

  const handleToggleMobile = () => {
    setIsExpandedMobile((prev) => !prev)
  }

  return (
    <aside
      role="region"
      aria-label="Marketplace announcement"
      className="sticky top-16 z-30 w-full border-b border-amber-500/30 bg-slate-950/95 shadow-md shadow-black/40 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Mobile View (collapsed by default, ~44px height) */}
        <div className="block md:hidden">
          <div
            onClick={handleToggleMobile}
            className="flex min-h-[44px] cursor-pointer items-center justify-between py-2 text-xs select-none"
            role="button"
            tabIndex={0}
            aria-expanded={isExpandedMobile}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggleMobile()
              }
            }}
          >
            <div className="flex items-center gap-2 font-black tracking-wide text-amber-400">
              <span>🔥 LAST BATCH OF THE YEAR!</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                className="flex items-center justify-center p-1 text-slate-400 transition-transform duration-200"
                aria-label={isExpandedMobile ? 'Collapse announcement' : 'Expand announcement'}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isExpandedMobile ? 'rotate-180 text-amber-400' : 'text-slate-400'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="flex items-center justify-center rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Expanded content on mobile */}
          {isExpandedMobile && (
            <div className="border-t border-white/10 pb-3 pt-2 text-xs leading-relaxed text-slate-300">
              <p>
                Our final seller batch for this year. Once these accounts are sold out, the next batch is expected around March next year (date not guaranteed).
              </p>
              <p className="mt-1.5 font-bold text-amber-400">
                Don’t miss out!
              </p>
            </div>
          )}
        </div>

        {/* Desktop / Tablet View (compact, professional, single or 2-line layout) */}
        <div className="hidden md:flex items-center justify-between gap-4 py-2.5 text-xs lg:text-sm">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-3 gap-y-1 min-w-0 flex-1">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-black tracking-wide text-amber-400">
              🔥 LAST BATCH OF THE YEAR!
            </span>
            <span className="text-slate-300 leading-snug">
              Our final seller batch for this year. Once these accounts are sold out, the next batch is expected around March next year (date not guaranteed).{' '}
              <strong className="font-bold text-amber-400">Don’t miss out!</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
