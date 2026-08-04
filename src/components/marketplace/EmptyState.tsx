import React from 'react'
import { Inbox, RotateCcw, Globe, LayoutGrid } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  onResetFilters?: () => void
  onTryAnotherPlatform?: () => void
  onTryAnotherCountry?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No listings found',
  description = 'Try adjusting your search terms or filter constraints to discover more verified work assets.',
  onResetFilters,
  onTryAnotherPlatform,
  onTryAnotherCountry,
}) => {
  return (
    <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 text-center shadow-2xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60" />
      
      <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)]">
        <Inbox className="h-8 w-8 text-indigo-400" />
      </div>
      
      <h3 className="relative z-10 mb-3 font-heading text-2xl font-black text-white">
        {title}
      </h3>
      <p className="relative z-10 mb-8 max-w-sm text-sm font-medium leading-relaxed text-slate-400">
        {description}
      </p>
      
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
        {onTryAnotherPlatform && (
          <button
            onClick={onTryAnotherPlatform}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/50 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700 hover:border-white/20"
          >
            <LayoutGrid className="h-4 w-4 text-indigo-400" />
            Try another platform
          </button>
        )}
        
        {onTryAnotherCountry && (
          <button
            onClick={onTryAnotherCountry}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/50 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-700 hover:border-white/20"
          >
            <Globe className="h-4 w-4 text-blue-400" />
            Try another country
          </button>
        )}
        
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.8)]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  )
}
