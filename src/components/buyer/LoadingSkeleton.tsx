import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-4 py-8 pb-40">
      <div className="h-48 w-full rounded-[24px] bg-white/5" />
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 w-full rounded-2xl bg-white/5" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 w-full rounded-2xl bg-white/5" />
          ))}
        </div>
        <div className="space-y-6 lg:col-span-4">
          <div className="h-64 w-full rounded-2xl bg-white/5" />
          <div className="h-48 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  )
}
