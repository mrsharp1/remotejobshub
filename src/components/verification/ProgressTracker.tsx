import React from 'react'

interface ProgressTrackerProps {
  percentage: number
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ percentage }) => {
  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <div className="flex items-end justify-between mb-4">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
          Verification Progress
        </h3>
        <span className="font-heading text-3xl font-black text-white">
          {percentage}%
        </span>
      </div>
      
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-950">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
