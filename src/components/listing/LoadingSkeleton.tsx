import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-32 rounded bg-white/5" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-8">
          {/* Hero skeleton */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-white/5" />
              <div className="h-6 w-32 rounded-full bg-white/5" />
            </div>
            <div className="h-12 w-3/4 rounded bg-white/5" />
            <div className="h-4 w-1/2 rounded bg-white/5" />
          </div>

          {/* Gallery skeleton */}
          <div className="aspect-[16/9] w-full rounded-[24px] bg-white/5" />

          {/* Analytics blocks */}
          <div className="h-48 w-full rounded-[24px] bg-white/5" />
          
          <div className="h-64 w-full rounded-[24px] bg-white/5" />
        </div>

        {/* Right Column (Sticky Panel) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="h-[400px] w-full rounded-[24px] bg-white/5" />
        </div>
      </div>
    </div>
  )
}
