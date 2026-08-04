import React, { useState, useEffect } from 'react'
import { LayoutDashboard, DollarSign, Users, ShieldAlert, Zap } from 'lucide-react'
import { AnalyticsHero } from './AnalyticsHero'
import { AnalyticsSidebar } from './AnalyticsSidebar'
import { AnalyticsFilters, DateRange } from './AnalyticsFilters'
import { AnalyticsExport } from './AnalyticsExport'
import { RevenueOverview } from './RevenueOverview'
import { RevenueChart, RevenueDataPoint } from './RevenueChart'
import { MarketplaceAnalytics, MarketplaceMetric } from './MarketplaceAnalytics'
import { EscrowAnalytics } from './EscrowAnalytics'
import { GrowthAnalytics } from './GrowthAnalytics'
import { FraudAnalytics } from './FraudAnalytics'
import { PerformanceAnalytics } from './PerformanceAnalytics'
import { LoadingAnalytics } from './LoadingAnalytics'

// Mock fetching function
const fetchAdminData = async () => {
  // Simulate network
  await new Promise(r => setTimeout(r, 600))
  
  // Return mocked rich dataset based on "range"
  return {
    gmv: 1245000,
    platformRevenue: 124500,
    dailyRevenue: 4500,
    escrowBalance: 350000,
    revenueData: [
      { date: 'Mon', revenue: 3200 },
      { date: 'Tue', revenue: 4100 },
      { date: 'Wed', revenue: 3800 },
      { date: 'Thu', revenue: 5200 },
      { date: 'Fri', revenue: 4800 },
      { date: 'Sat', revenue: 6100 },
      { date: 'Sun', revenue: 4500 }
    ] as RevenueDataPoint[],
    marketplace: {
      trending: [
        { id: '1', name: 'YouTube Channels', value: '₦450k', trend: 12 },
        { id: '2', name: 'SaaS Micro-startups', value: '₦320k', trend: 8 },
        { id: '3', name: 'Instagram Pages', value: '₦150k', trend: -2 }
      ] as MarketplaceMetric[],
      fastest: [
        { id: '1', name: 'TikTok Accounts', value: '1.2 days', trend: 5 },
        { id: '2', name: 'Newsletters', value: '2.5 days', trend: 15 },
        { id: '3', name: 'E-commerce Stores', value: '4.1 days', trend: 0 }
      ] as MarketplaceMetric[],
      topSellers: [
        { id: '1', name: 'Alex M.', value: '42 Sales', trend: 20 },
        { id: '2', name: 'MediaEmpire', value: '38 Sales', trend: 5 },
        { id: '3', name: 'GrowthHacker', value: '25 Sales', trend: -1 }
      ] as MarketplaceMetric[]
    },
    escrow: {
      total: 350000,
      avgReleaseTime: 48.5,
      pending: 124,
      disputed: 15000
    },
    growth: {
      totalUsers: 45200,
      newUsers: 1250,
      activeUsers: 8400
    },
    fraud: {
      kycSuccess: 94.5,
      fraudDetected: 2.1,
      disputes: 1.8,
      verificationSuccess: 98.2
    },
    performance: {
      avgSettlement: 52.4,
      avgVerification: 1.2,
      avgResponse: 15
    }
  }
}

export const AdminAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    fetchAdminData().then(d => {
      setData(d)
      setLoading(false)
    })
  }, [dateRange])

  const sidebarItems = [
    { id: 'overview', label: 'Executive Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'revenue', label: 'Revenue & Escrow', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'growth', label: 'Market & Growth', icon: <Users className="h-4 w-4" /> },
    { id: 'trust', label: 'Trust & Safety', icon: <ShieldAlert className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance', icon: <Zap className="h-4 w-4" /> }
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <AnalyticsHero 
        title="Executive Command Center"
        subtitle="Real-time insights across revenue, escrow, and platform health."
        action={<AnalyticsExport />}
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
              
              {/* OVERVIEW TAB */}
              {(activeTab === 'overview' || activeTab === 'revenue') && (
                <>
                  <RevenueOverview 
                    gmv={data.gmv}
                    platformRevenue={data.platformRevenue}
                    dailyRevenue={data.dailyRevenue}
                    escrowBalance={data.escrowBalance}
                    gmvTrend={12.5}
                    revenueTrend={15.2}
                  />
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 font-heading text-lg font-bold">Revenue Trend</h3>
                    <RevenueChart data={data.revenueData} />
                  </div>
                </>
              )}

              {(activeTab === 'overview' || activeTab === 'revenue') && (
                <EscrowAnalytics 
                  totalInEscrow={data.escrow.total}
                  averageReleaseTimeHours={data.escrow.avgReleaseTime}
                  pendingReleases={data.escrow.pending}
                  disputedEscrow={data.escrow.disputed}
                />
              )}

              {/* GROWTH & MARKET TAB */}
              {(activeTab === 'overview' || activeTab === 'growth') && (
                <>
                  <GrowthAnalytics 
                    totalUsers={data.growth.totalUsers}
                    newUsers={data.growth.newUsers}
                    activeUsers={data.growth.activeUsers}
                  />
                  <MarketplaceAnalytics 
                    trendingPlatforms={data.marketplace.trending}
                    fastestSelling={data.marketplace.fastest}
                    topSellers={data.marketplace.topSellers}
                  />
                </>
              )}

              {/* TRUST TAB */}
              {(activeTab === 'overview' || activeTab === 'trust') && (
                <FraudAnalytics 
                  kycSuccessRate={data.fraud.kycSuccess}
                  fraudDetectionRate={data.fraud.fraudDetected}
                  disputeRate={data.fraud.disputes}
                  verificationSuccess={data.fraud.verificationSuccess}
                />
              )}

              {/* PERFORMANCE TAB */}
              {(activeTab === 'overview' || activeTab === 'performance') && (
                <PerformanceAnalytics 
                  avgSettlementTimeHours={data.performance.avgSettlement}
                  avgVerificationTimeHours={data.performance.avgVerification}
                  avgResponseTimeMins={data.performance.avgResponse}
                />
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
