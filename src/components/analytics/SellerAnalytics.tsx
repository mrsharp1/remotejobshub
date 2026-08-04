import React, { useState, useEffect } from 'react'
import { LayoutDashboard, TrendingUp, BarChart2 } from 'lucide-react'
import { AnalyticsHero } from './AnalyticsHero'
import { AnalyticsSidebar } from './AnalyticsSidebar'
import { AnalyticsFilters, DateRange } from './AnalyticsFilters'
import { RevenueChart, RevenueDataPoint } from './RevenueChart'
import { LoadingAnalytics } from './LoadingAnalytics'
import { formatCurrency } from '@/utils/currency'

const fetchSellerData = async () => {
  await new Promise(r => setTimeout(r, 600))
  return {
    revenue: 45000,
    profit: 40500, // minus fee
    pending: 5000,
    conversion: 3.2, // %
    views: 12400,
    clicks: 850,
    revenueData: [
      { date: 'Mon', revenue: 1200 },
      { date: 'Tue', revenue: 800 },
      { date: 'Wed', revenue: 2100 },
      { date: 'Thu', revenue: 1500 },
      { date: 'Fri', revenue: 3000 },
      { date: 'Sat', revenue: 4500 },
      { date: 'Sun', revenue: 3200 }
    ] as RevenueDataPoint[]
  }
}

export const SellerAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    fetchSellerData().then(d => {
      setData(d)
      setLoading(false)
    })
  }, [dateRange])

  const sidebarItems = [
    { id: 'overview', label: 'Business Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'sales', label: 'Sales & Revenue', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'listings', label: 'Listing Performance', icon: <BarChart2 className="h-4 w-4" /> }
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <AnalyticsHero 
        title="Seller Intelligence"
        subtitle="Track your business performance and optimize your listings."
      />

      <div className="flex flex-col gap-8 md:flex-row">
        <AnalyticsSidebar 
          items={sidebarItems}
          activeId={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex-1 min-w-0 space-y-6">
          <AnalyticsFilters 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          {loading || !data ? (
            <LoadingAnalytics />
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="mt-2 text-2xl font-bold">{formatCurrency(data.revenue)}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <p className="text-sm font-medium text-emerald-500">Net Profit</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-500">{formatCurrency(data.profit)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Pending in Escrow</p>
                  <p className="mt-2 text-2xl font-bold">{formatCurrency(data.pending)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="mt-2 text-2xl font-bold">{data.conversion}%</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-heading text-lg font-bold">Revenue Trend</h3>
                <RevenueChart data={data.revenueData} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-bold">Traffic</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span>Total Views</span>
                    <span className="font-bold">{data.views.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Click-Through Rate</span>
                    <span className="font-bold">{((data.clicks / data.views) * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-bold">Top Performing Niche</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Based on your recent sales, SaaS startups are converting 40% faster than your average listing.</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
