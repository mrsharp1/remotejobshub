import React from 'react'
import { Lock, Unlock, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface EscrowAnalyticsProps {
  totalInEscrow: number
  averageReleaseTimeHours: number
  pendingReleases: number
  disputedEscrow: number
}

export const EscrowAnalytics: React.FC<EscrowAnalyticsProps> = ({
  totalInEscrow,
  averageReleaseTimeHours,
  pendingReleases,
  disputedEscrow
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Escrow Operations</h3>
        <Lock className="h-5 w-5 text-indigo-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="text-xs font-semibold uppercase text-indigo-500">Currently Locked</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(totalInEscrow)}</p>
        </div>
        
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Avg Release
          </p>
          <p className="mt-1 text-2xl font-bold">{averageReleaseTimeHours.toFixed(1)}h</p>
        </div>
        
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
            <Unlock className="h-3 w-3" /> Pending
          </p>
          <p className="mt-1 text-2xl font-bold">{pendingReleases}</p>
        </div>
        
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-xs font-semibold uppercase text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Disputed
          </p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(disputedEscrow)}</p>
        </div>
      </div>
    </div>
  )
}
