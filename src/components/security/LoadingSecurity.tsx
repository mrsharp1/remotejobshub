import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingSecurity: React.FC = () => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center rounded-2xl border border-border bg-card/50">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Verifying Security Protocols...</p>
      </div>
    </div>
  )
}
