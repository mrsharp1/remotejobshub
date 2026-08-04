import React from 'react'

export const LoadingSettlement: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-4 py-8 pb-32">
      <div className="h-48 w-full rounded-[24px] bg-white/5" />
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="h-32 w-full rounded-[24px] bg-white/5" />
          <div className="h-96 w-full rounded-[24px] bg-white/5" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <div className="h-64 w-full rounded-[24px] bg-white/5" />
          <div className="h-48 w-full rounded-[24px] bg-white/5" />
        </div>
      </div>
    </div>
  )
}
