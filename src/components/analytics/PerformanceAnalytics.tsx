import React from 'react'
import { Zap, Clock, Activity } from 'lucide-react'

interface PerformanceAnalyticsProps {
  avgSettlementTimeHours: number
  avgVerificationTimeHours: number
  avgResponseTimeMins: number
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  avgSettlementTimeHours,
  avgVerificationTimeHours,
  avgResponseTimeMins
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Platform Performance</h3>
        <Zap className="h-5 w-5 text-amber-500" />
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-4 text-center">
          <Clock className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-2xl font-bold">{avgSettlementTimeHours.toFixed(1)}h</p>
          <p className="mt-1 text-xs font-semibold uppercase text-muted-foreground">Avg Settlement</p>
        </div>
        
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-4 text-center">
          <ShieldIcon />
          <p className="text-2xl font-bold">{avgVerificationTimeHours.toFixed(1)}h</p>
          <p className="mt-1 text-xs font-semibold uppercase text-muted-foreground">Avg Verification</p>
        </div>
        
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-4 text-center">
          <Activity className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-2xl font-bold">{avgResponseTimeMins.toFixed(0)}m</p>
          <p className="mt-1 text-xs font-semibold uppercase text-muted-foreground">Avg Response Time</p>
        </div>
      </div>
    </div>
  )
}

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mb-2 h-6 w-6 text-muted-foreground"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)
