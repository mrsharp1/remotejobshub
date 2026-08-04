import React from 'react'
import { Users, UserPlus, Activity, ArrowUpRight } from 'lucide-react'

interface GrowthAnalyticsProps {
  totalUsers: number
  newUsers: number
  activeUsers: number
}

export const GrowthAnalytics: React.FC<GrowthAnalyticsProps> = ({
  totalUsers,
  newUsers,
  activeUsers
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Growth & Adoption</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">New This Week</p>
            <p className="text-2xl font-bold">{newUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Users (7d)</p>
            <p className="text-2xl font-bold">{activeUsers.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/50 p-4">
        <div>
          <p className="text-sm font-semibold">User Acquisition Velocity</p>
          <p className="text-xs text-muted-foreground">Platform is growing faster than last month</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-500">
          <ArrowUpRight className="h-4 w-4" />
          <span className="text-sm font-bold">+12.4%</span>
        </div>
      </div>
    </div>
  )
}
