import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { DollarSign, Compass, CheckCircle, Loader2 } from 'lucide-react'
import { analyticsService } from '@/services/marketplace/analytics.service'
import { useAuthStore } from '@/stores/authStore'

export const BuyerAnalyticsPage: React.FC = () => {
  const { user } = useAuthStore()

  // Fetch Buyer Analytics data
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['buyer-bi-metrics', user?.id],
    queryFn: () =>
      user?.id ? analyticsService.getBuyerAnalytics(user.id) : null,
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
          Buyer Insights Control
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Buyer Analytics Hub
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Review your purchase volume history, spending behaviors, and order
          success rates.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Total Purchases
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {metrics.purchases}
            </h3>
          </div>
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg text-primary">
            <Compass className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Amount Spent
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              ₦{metrics.spending.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Order Success Rate
            </span>
            <h3 className="mt-1 text-xl font-bold text-green-500">
              {metrics.successRate.toFixed(1)}%
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Spending SVG chart */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Spending History
              </span>
              <span className="text-[10px] text-muted-foreground">
                Monthly purchasing spend logs
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
                    id="buyerSpendGrad"
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
                  d="M 0 90 Q 120 70 240 80 T 360 40 T 500 30 L 500 100 L 0 100 Z"
                  fill="url(#buyerSpendGrad)"
                />
                <path
                  d="M 0 90 Q 120 70 240 80 T 360 40 T 500 30"
                  fill="none"
                  stroke="var(--color-primary, #6366f1)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 font-mono text-[9px] text-muted-foreground">
                <span>Month 1</span>
                <span>Month 2</span>
                <span>Month 3</span>
                <span>Month 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Prefs */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Favorite Platforms
            </h3>
            <div className="space-y-3.5 text-xs">
              {metrics.favoritePlatforms.map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>{f.name}</span>
                    <span>{f.value}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${f.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BuyerAnalyticsPage
