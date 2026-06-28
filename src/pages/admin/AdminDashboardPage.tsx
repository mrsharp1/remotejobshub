import React, { useState } from 'react'
import {
  Users,
  UserCheck,
  FileText,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Bell,
  TrendingUp,
  Settings,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    'users' | 'orders' | 'revenue' | 'listings'
  >('revenue')

  // Telemetry Mock Parameters
  const telemetry = {
    totalUsers: 1420,
    buyers: 890,
    sellers: 530,
    verifiedSellers: 210,
    activeListings: 432,
    pendingListings: 18,
    orders: 312,
    revenue: 68900,
    disputes: 4,
    notifications: 2450,
  }

  // Analytics datasets
  const chartDatasets = {
    users: [
      { label: 'Jan', val: 400 },
      { label: 'Feb', val: 620 },
      { label: 'Mar', val: 780 },
      { label: 'Apr', val: 990 },
      { label: 'May', val: 1210 },
      { label: 'Jun', val: 1420 },
    ],
    orders: [
      { label: 'Jan', val: 32 },
      { label: 'Feb', val: 54 },
      { label: 'Mar', val: 41 },
      { label: 'Apr', val: 78 },
      { label: 'May', val: 91 },
      { label: 'Jun', val: 110 },
    ],
    revenue: [
      { label: 'Jan', val: 8200 },
      { label: 'Feb', val: 12400 },
      { label: 'Mar', val: 9500 },
      { label: 'Apr', val: 16800 },
      { label: 'May', val: 19100 },
      { label: 'Jun', val: 22900 },
    ],
    listings: [
      { label: 'Jan', val: 120 },
      { label: 'Feb', val: 190 },
      { label: 'Mar', val: 240 },
      { label: 'Apr', val: 310 },
      { label: 'May', val: 380 },
      { label: 'Jun', val: 432 },
    ],
  }

  const activeDataset = chartDatasets[analyticsPeriod]
  const maxVal = Math.max(...activeDataset.map((d) => d.val), 10)

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-border/40 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Superuser Control Console
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Overview Dashboard
          </h1>
        </div>
      </div>

      {/* Telemetry Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            title: 'Total Users',
            value: telemetry.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-primary',
          },
          {
            title: 'Buyers / Sellers',
            value: `${telemetry.buyers} / ${telemetry.sellers}`,
            icon: Users,
            color: 'text-indigo-500',
          },
          {
            title: 'Verified Sellers',
            value: telemetry.verifiedSellers,
            icon: UserCheck,
            color: 'text-emerald-500',
          },
          {
            title: 'Active Listings',
            value: telemetry.activeListings,
            icon: FileText,
            color: 'text-blue-500',
          },
          {
            title: 'Pending Approval',
            value: telemetry.pendingListings,
            icon: ShieldAlert,
            color: 'text-yellow-500',
          },
          {
            title: 'Total Orders',
            value: telemetry.orders,
            icon: ShoppingBag,
            color: 'text-primary',
          },
          {
            title: 'Gross Revenue',
            value: `$${telemetry.revenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-500',
          },
          {
            title: 'Active Disputes',
            value: telemetry.disputes,
            icon: AlertTriangle,
            color: 'text-orange-500',
          },
          {
            title: 'System Alerts',
            value: telemetry.notifications,
            icon: Bell,
            color: 'text-muted-foreground',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="font-heading text-lg font-bold text-foreground">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action links */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="border-b pb-3 font-heading text-sm font-bold text-foreground">
          Quick Actions Console
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Manage Users', action: 'Users moderation panel' },
            { label: 'Manage Listings', action: 'Listings review studio' },
            { label: 'Manage Orders', action: 'Orders database query' },
            { label: 'Manage Disputes', action: 'Escrow dispute escalation' },
            {
              label: 'Verification Requests',
              action: 'Sellers badge verifications',
            },
            { label: 'Platform Settings', action: 'Site parameters configs' },
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() =>
                alert(`Redirecting to: ${act.action} (Console coming soon)`)
              }
              className="flex flex-col items-center justify-center space-y-1.5 rounded-lg border border-border bg-background p-3 text-center transition-colors hover:bg-muted"
            >
              <span className="text-xs font-bold text-foreground">
                {act.label}
              </span>
              <span className="text-[9px] leading-snug text-muted-foreground">
                {act.action}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Chart layout */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-heading text-sm font-bold text-foreground">
            Platform Metrics Chart
          </h3>
          <div className="flex rounded-lg bg-muted p-0.5 text-[10px] font-semibold">
            {[
              { key: 'users', label: 'User Growth' },
              { key: 'orders', label: 'Orders' },
              { key: 'revenue', label: 'Revenue' },
              { key: 'listings', label: 'Listings' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setAnalyticsPeriod(tab.key as any)}
                className={`rounded-md px-3 py-1 transition-all ${
                  analyticsPeriod === tab.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-44 items-end gap-3 px-2 pt-6">
          {activeDataset.map((d, idx) => {
            const pct = (d.val / maxVal) * 100
            return (
              <div
                key={idx}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[9px] font-bold text-foreground">
                  {analyticsPeriod === 'revenue'
                    ? `$${d.val.toLocaleString()}`
                    : d.val}
                </span>
                <div
                  className="bg-destructive/25 w-full cursor-pointer rounded-t-sm transition-all hover:bg-destructive"
                  style={{ height: `${Math.max(pct, 5)}%` }}
                />
                <span className="mt-1 text-[9px] font-medium text-muted-foreground">
                  {d.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity grids */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest Listings and Orders */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="flex items-center justify-between border-b pb-2 font-heading text-sm font-bold text-foreground">
            <span>Recent Marketplace Orders</span>
            <span className="text-[10px] text-muted-foreground">
              Updated live
            </span>
          </h3>
          <div className="space-y-3">
            {[
              {
                id: '1',
                title: 'DataAnnotation Sandbox Account',
                buyer: 'Friday Chimobi',
                price: 450,
                status: 'payment_received',
              },
              {
                id: '2',
                title: 'Verified Outlier Contributor Profile',
                buyer: 'Alice Brown',
                price: 290,
                status: 'buyer_review',
              },
              {
                id: '3',
                title: 'Scale AI Developer Console',
                buyer: 'Bob Smith',
                price: 650,
                status: 'completed',
              },
            ].map((ord) => (
              <div
                key={ord.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded border border-transparent p-2 text-xs transition-all hover:border-border"
              >
                <div>
                  <h4 className="max-w-[240px] truncate font-bold text-foreground">
                    {ord.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    Buyer: {ord.buyer}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-foreground">
                    ${ord.price}
                  </span>
                  <span className="text-[9px] capitalize text-primary">
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Users signups and verifications */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="flex items-center justify-between border-b pb-2 font-heading text-sm font-bold text-foreground">
            <span>Recent User Signups</span>
            <span className="text-[10px] text-muted-foreground">
              Audit logs
            </span>
          </h3>
          <div className="space-y-3">
            {[
              {
                name: 'John Doe',
                email: 'john@remotejobshub.com',
                role: 'buyer',
                since: '10 mins ago',
              },
              {
                name: 'Sarah Connor',
                email: 'sarah@skynet.io',
                role: 'seller',
                since: '25 mins ago',
              },
              {
                name: 'Admin Staff',
                email: 'moderator@remotejobshub.com',
                role: 'admin',
                since: '1 hour ago',
              },
            ].map((usr, idx) => (
              <div
                key={idx}
                className="hover:bg-muted/50 flex items-center justify-between rounded p-2 text-xs transition-colors"
              >
                <div>
                  <h4 className="font-bold text-foreground">{usr.name}</h4>
                  <span className="text-[10px] text-muted-foreground">
                    {usr.email}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-semibold capitalize text-foreground">
                    {usr.role}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {usr.since}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboardPage
