import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 space-y-4 animate-pulse"
        >
          <div className="aspect-video w-full rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-1/4 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <div className="h-3 w-1/3 rounded bg-muted" />
            <div className="h-4 w-1/4 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
