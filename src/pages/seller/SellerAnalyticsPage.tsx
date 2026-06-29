import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp,
  DollarSign,
  Activity,
  Award,
  Users,
  Eye,
  Heart,
  Loader2,
} from 'lucide-react'
import { analyticsService } from '@/services/marketplace/analytics.service'
import { useAuthStore } from '@/stores/authStore'

export const SellerAnalyticsPage: React.FC = () => {
  const { user } = useAuthStore()

  // Fetch Seller Analytics data
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['seller-bi-metrics', user?.id],
    queryFn: () =>
      user?.id ? analyticsService.getSellerAnalytics(user.id) : null,
    enabled: !!user?.id,
  })

  if (isLoading || !metrics) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Seller Performance Workspace
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Seller Analytics Hub
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Detailed metrics of your listings conversion rates, page views, and
          monthly performance.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Total Sales
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {metrics.totalSales}
            </h3>
          </div>
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Earnings Earned
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              ₦{metrics.earnings.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Conversion Rate
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {metrics.conversionRate}%
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Listing Views
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {metrics.listingViews}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Eye className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Weekly Perf Chart */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Weekly Revenue Growth
              </span>
              <span className="text-[10px] text-muted-foreground">
                Volume earned during previous 7 days
              </span>
            </div>
            {/* SVG area chart */}
            <div className="relative h-44 w-full">
              <svg
                className="h-full w-full"
                viewBox="0 0 500 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="sellerChartGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
                  d="M 0 85 Q 80 50 160 70 T 320 40 T 500 20 L 500 100 L 0 100 Z"
                  fill="url(#sellerChartGrad)"
                />
                <path
                  d="M 0 85 Q 80 50 160 70 T 320 40 T 500 20"
                  fill="none"
                  stroke="var(--color-primary, #6366f1)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 font-mono text-[9px] text-muted-foreground">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Best performing listings list */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Best Performing Listings
            </h3>
            <div className="space-y-3">
              {metrics.bestListings.map((l, i) => (
                <div
                  key={i}
                  className="bg-muted/20 flex items-center justify-between rounded-lg border p-3 text-xs"
                >
                  <div>
                    <span className="block font-bold text-foreground">
                      {l.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {l.views} views • {l.sales} sales
                    </span>
                  </div>
                  <span className="font-mono font-bold text-primary">
                    ₦{l.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini metrics */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Popularity Logs
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Listing Favorites</span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />{' '}
                  {metrics.favorites}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Profile Visits</span>
                <span className="font-semibold text-foreground">
                  {metrics.profileVisits}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Average Conversion
                </span>
                <span className="font-semibold text-green-500">
                  {metrics.conversionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SellerAnalyticsPage
