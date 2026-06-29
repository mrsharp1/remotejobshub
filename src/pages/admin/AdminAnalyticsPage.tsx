import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp,
  DollarSign,
  Activity,
  Award,
  Users,
  Calendar,
  Download,
  Percent,
  Clock,
  Heart,
  Loader2,
} from 'lucide-react'
import { analyticsService } from '@/services/marketplace/analytics.service'
import { orderService } from '@/services/marketplace/order.service'
import { listingService } from '@/services/marketplace/listing.service'

export const AdminAnalyticsPage: React.FC = () => {
  const [refreshCountdown, setRefreshCountdown] = useState(30)

  // Fetch Analytics data
  const {
    data: metrics,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-bi-metrics'],
    queryFn: () => analyticsService.getAdminAnalytics(),
  })

  // Fetch Live Feeds data
  const { data: recentOrders = [] } = useQuery({
    queryKey: ['live-feed-orders'],
    queryFn: () => orderService.getAllOrders(),
  })

  const { data: recentListings = [] } = useQuery({
    queryKey: ['live-feed-listings'],
    queryFn: () => listingService.getListings(),
  })

  // Auto-refresh logic (every 30s)
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          refetch()
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [refetch])

  // Export report to CSV
  const handleExportCSV = () => {
    if (!metrics) return
    let csv = 'Metric,Value\n'
    csv += `Total Platform Revenue,₦${metrics.totalRevenue}\n`
    csv += `Escrow Balance,₦${metrics.escrowBalance}\n`
    csv += `Wallet Balance,₦${metrics.walletBalance}\n`
    csv += `Active UsersCount,${metrics.activeUsers}\n`
    csv += `New Registrations,${metrics.newUsers}\n`
    csv += `Dispute Rate,${metrics.disputeRate.toFixed(2)}%\n`
    csv += `Refund Rate,${metrics.refundRate.toFixed(2)}%\n`
    csv += `Conversion Rate,${metrics.conversionRate.toFixed(2)}%\n`
    csv += `Average Order Value,₦${metrics.averageOrderValue.toFixed(2)}\n`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute(
      'download',
      `admin_bi_report_${new Date().toISOString().slice(0, 10)}.csv`
    )
    a.click()
  }

  if (isLoading || !metrics) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Calculated Net Revenue (mock 10% escrow fees cuts)
  const netRevenue = metrics.totalRevenue * 0.1

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Marketplace Intelligence Control Room
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Business Intelligence Console
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Real-time transactional metrics and user conversion graphs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-muted/30 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground">
            <Clock className="h-3.5 w-3.5 animate-pulse text-primary" />{' '}
            Refreshes in {refreshCountdown}s
          </div>
          <button
            onClick={handleExportCSV}
            className="hover:bg-primary/95 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-colors"
          >
            <Download className="h-4 w-4" /> Export Report CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Gross Volume
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              ₦{metrics.totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Net Fees Collected
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              ₦{netRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Hold in Escrow
            </span>
            <h3 className="mt-1 text-xl font-bold text-amber-500">
              ₦{metrics.escrowBalance.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Conversion efficiency
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {metrics.conversionRate.toFixed(1)}%
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: SVG Charts */}
        <div className="space-y-6 lg:col-span-8">
          {/* Revenue Trend Chart Card */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Revenue Trendline
              </span>
              <span className="text-[10px] text-muted-foreground">
                Year-to-date monthly gross volume
              </span>
            </div>
            {/* SVG line chart */}
            <div className="relative h-44 w-full">
              <svg
                className="h-full w-full"
                viewBox="0 0 500 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary, #6366f1)"
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary, #6366f1)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 80 Q 100 40 200 60 T 300 20 T 400 30 T 500 10 L 500 100 L 0 100 Z"
                  fill="url(#chartGrad)"
                />
                <path
                  d="M 0 80 Q 100 40 200 60 T 300 20 T 400 30 T 500 10"
                  fill="none"
                  stroke="var(--color-primary, #6366f1)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 font-mono text-[9px] text-muted-foreground">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          {/* User registrations charts */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  New Registrations
                </span>
                <span className="text-[10px] font-bold text-emerald-500">
                  +18% increase
                </span>
              </div>
              <div className="flex h-32 items-end justify-between gap-1 pt-4">
                {[45, 60, 52, 70, 85, 90, 110].map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div
                      className="bg-primary/20 w-full rounded-t transition-all duration-300 hover:bg-primary"
                      style={{ height: `${h}%` }}
                    />
                    <span className="font-mono text-[9px] text-muted-foreground">
                      Day {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Escrow Activity Logs
                </span>
                <span className="text-[10px] font-bold text-amber-500">
                  ₦{metrics.escrowBalance.toLocaleString()} pending
                </span>
              </div>
              <div className="flex h-32 items-end justify-between gap-1 pt-4">
                {[60, 45, 80, 55, 95, 75, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-full rounded-t bg-amber-500/20 transition-all duration-300 hover:bg-amber-500"
                      style={{ height: `${h}%` }}
                    />
                    <span className="font-mono text-[9px] text-muted-foreground">
                      Week {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Platform Metrics & Live feeds */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Health Monitor
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Dispute Rate</span>
                <span className="font-semibold text-foreground">
                  {metrics.disputeRate.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Refund Rate</span>
                <span className="font-semibold text-foreground">
                  {metrics.refundRate.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">
                  Platform Health Score
                </span>
                <span className="font-semibold text-green-500">
                  {metrics.healthScore}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AOV</span>
                <span className="font-semibold text-foreground">
                  ₦{metrics.averageOrderValue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Live Feed component */}
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <Activity className="h-4 w-4 animate-pulse text-primary" /> Live
              Activity Feed
            </h3>
            <div className="divide-border/40 max-h-56 space-y-2 divide-y overflow-y-auto text-[11px]">
              {recentOrders.slice(0, 3).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between pt-2"
                >
                  <div>
                    <span className="font-bold text-foreground">
                      Order Placed
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      Status: {o.status}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    ₦{Number(o.amount).toLocaleString()}
                  </span>
                </div>
              ))}
              {recentListings.slice(0, 2).map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between pt-2"
                >
                  <div>
                    <span className="font-bold text-foreground">
                      New Listing
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      {l.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-primary">
                    ₦{Number(l.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminAnalyticsPage
