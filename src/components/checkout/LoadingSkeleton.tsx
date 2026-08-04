import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 pb-40">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-8 lg:col-span-7 xl:col-span-8">
          <div className="space-y-4">
            <div className="h-10 w-3/4 rounded bg-white/5" />
            <div className="h-6 w-1/2 rounded bg-white/5" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-24 rounded-full bg-white/5" />
              <div className="h-6 w-32 rounded-full bg-white/5" />
            </div>
          </div>
          
          <div className="h-48 w-full rounded-[24px] bg-white/5" />
          <div className="h-64 w-full rounded-[24px] bg-white/5" />
        </div>

        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          <div className="h-[400px] w-full rounded-[24px] bg-white/5" />
          <div className="h-[200px] w-full rounded-[24px] bg-white/5" />
        </div>
      </div>
    </div>
  )
}
