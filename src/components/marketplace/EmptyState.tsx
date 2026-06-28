import React from 'react'
import { Inbox, RotateCcw } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No listings found',
  description = 'Try adjusting your search terms or filter constraints to discover more verified work assets.',
  actionLabel = 'Reset Filters',
  onAction,
}) => {
  return (
    <div className="border-border/80 flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 font-heading text-lg font-bold text-foreground">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
