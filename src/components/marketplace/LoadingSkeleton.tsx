import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-[24px] border border-white/5 bg-slate-900/40 shadow-2xl backdrop-blur-xl">
      {/* Thumbnail placeholder */}
      <div className="aspect-[4/3] w-full bg-slate-800/50" />

      {/* Info details */}
      <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
        <div className="space-y-3">
          {/* Platform Tag */}
          <div className="h-4 w-20 rounded-md bg-slate-800/50" />
          {/* Title */}
          <div className="h-5 w-5/6 rounded-lg bg-slate-800/50" />
          <div className="h-5 w-2/3 rounded-lg bg-slate-800/50" />
        </div>

        {/* Price & Date Row */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="h-4 w-24 rounded-lg bg-slate-800/50" />
          <div className="h-8 w-24 rounded-xl bg-indigo-500/20" />
        </div>
      </div>
    </div>
  )
}
