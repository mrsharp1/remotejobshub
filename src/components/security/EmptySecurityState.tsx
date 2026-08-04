import React from 'react'
import { ShieldAlert } from 'lucide-react'

interface EmptySecurityStateProps {
  title?: string
  message?: string
}

export const EmptySecurityState: React.FC<EmptySecurityStateProps> = ({ 
  title = "No Security Data", 
  message = "There are no security events to display at this time." 
}) => {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <ShieldAlert className="h-8 w-8 text-muted-foreground opacity-50" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
