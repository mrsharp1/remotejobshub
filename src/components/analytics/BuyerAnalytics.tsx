import React, { useState, useEffect } from 'react'
import { LayoutDashboard, ShoppingBag, ShieldCheck } from 'lucide-react'
import { AnalyticsHero } from './AnalyticsHero'
import { AnalyticsSidebar } from './AnalyticsSidebar'
import { LoadingAnalytics } from './LoadingAnalytics'
import { formatCurrency } from '@/utils/currency'

const fetchBuyerData = async () => {
  await new Promise(r => setTimeout(r, 600))
  return {
    spent: 12500,
    purchases: 5,
    saved: 12,
    disputes: 0,
    avgSettlement: 48, // hours
  }
}

export const BuyerAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    fetchBuyerData().then(d => {
      setData(d)
      setLoading(false)
    })
  }, [])

  const sidebarItems = [
    { id: 'overview', label: 'Purchasing Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'history', label: 'Purchase History', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 'trust', label: 'Trust & Verification', icon: <ShieldCheck className="h-4 w-4" /> }
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <AnalyticsHero 
        title="Buyer Dashboard"
        subtitle="Manage your acquisitions, saved listings, and transaction history."
      />

      <div className="flex flex-col gap-8 md:flex-row">
        <AnalyticsSidebar 
          items={sidebarItems}
          activeId={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex-1 min-w-0 space-y-6">
          {loading || !data ? (
            <LoadingAnalytics />
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Total Invested</p>
                  <p className="mt-2 text-2xl font-bold">{formatCurrency(data.spent)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Assets Acquired</p>
                  <p className="mt-2 text-2xl font-bold">{data.purchases}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">Saved Listings</p>
                  <p className="mt-2 text-2xl font-bold">{data.saved}</p>
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <p className="text-sm font-medium text-emerald-500">Successful Purchases</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-500">100%</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-bold">Acquisition Insights</h3>
                <p className="mt-2 text-sm text-muted-foreground">You typically complete your credential verifications in {data.avgSettlement} hours, which is faster than 80% of buyers.</p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
