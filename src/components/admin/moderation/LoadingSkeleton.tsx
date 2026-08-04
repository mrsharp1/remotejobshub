import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:border-slate-800 dark:bg-card shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4.5 w-44 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3.5 w-24 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
