import React from 'react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Thumbnail placeholder */}
      <div className="aspect-video w-full bg-muted" />

      {/* Info details */}
      <div className="flex flex-1 flex-col justify-between space-y-4 p-4">
        <div className="space-y-2">
          {/* Platform Tag */}
          <div className="h-3 w-16 rounded bg-muted" />
          {/* Title */}
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>

        {/* Price & Date Row */}
        <div className="border-border/50 flex items-center justify-between border-t pt-3">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-4 w-12 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}
