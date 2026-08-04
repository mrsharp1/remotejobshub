import React from 'react'
import { BarChart3 } from 'lucide-react'

interface EmptyAnalyticsProps {
  title?: string
  message?: string
}

export const EmptyAnalytics: React.FC<EmptyAnalyticsProps> = ({ 
  title = "No Data Available", 
  message = "There isn't enough data to generate these insights yet." 
}) => {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <BarChart3 className="h-8 w-8 text-muted-foreground opacity-50" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
