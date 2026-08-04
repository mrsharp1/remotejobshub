import React from 'react'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, ShieldCheck } from 'lucide-react'

interface KPIProps {
  title: string
  value: string
  trend?: number
  icon: React.ReactNode
}

const KPICard: React.FC<KPIProps> = ({ title, value, trend, icon }) => (
  <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="font-heading text-2xl font-bold">{value}</h3>
      {trend !== undefined && (
        <span className={`flex items-center text-xs font-semibold ${trend >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
          {trend >= 0 ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
)

interface RevenueOverviewProps {
  gmv: number
  platformRevenue: number
  dailyRevenue: number
  escrowBalance: number
  gmvTrend?: number
  revenueTrend?: number
}

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  gmv,
  platformRevenue,
  dailyRevenue,
  escrowBalance,
  gmvTrend,
  revenueTrend
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard 
        title="Gross Merchandise Value"
        value={`₦${gmv.toLocaleString()}`}
        trend={gmvTrend}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KPICard 
        title="Platform Commission"
        value={`₦${platformRevenue.toLocaleString()}`}
        trend={revenueTrend}
        icon={<CreditCard className="h-4 w-4" />}
      />
      <KPICard 
        title="Daily Revenue"
        value={`₦${dailyRevenue.toLocaleString()}`}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <KPICard 
        title="Escrow Held"
        value={`₦${escrowBalance.toLocaleString()}`}
        icon={<ShieldCheck className="h-4 w-4" />}
      />
    </div>
  )
}
