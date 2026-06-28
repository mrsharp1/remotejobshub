import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Loader2,
  Calendar,
  XCircle,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/marketplace/order.service'
import { Order, OrderTimeline } from '@/types'

const MARKETPLACE_PLATFORMS = [
  'Outlier',
  'Handshake',
  'DataAnnotation',
  'TELUS',
  'Scale AI',
  'Appen',
  'OneForma',
]

export const SellerOrdersPage: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Filter & Search States
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc')
  const [priceSort, setPriceSort] = useState<'desc' | 'asc' | ''>('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [chartPeriod, setChartPeriod] = useState<
    'daily' | 'weekly' | 'monthly'
  >('monthly')

  // Fetch Seller Orders
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['seller-orders', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('No user authenticated')
      return orderService.getSellerOrders(user.id)
    },
    enabled: !!user?.id,
  })

  // Action status changes
  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: Order['status'],
    notes: string
  ) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, notes)
      refetch()
    } catch (err) {
      console.error('Failed to change status:', err)
    }
  }

  // Activity feed timeline compilation
  const [activityLogs, setActivityLogs] = useState<OrderTimeline[]>([])
  const [loadingActivity, setLoadingActivity] = useState(false)

  const loadActivityLogs = useCallback(async () => {
    if (!orders.length) return
    setLoadingActivity(true)
    try {
      const logsPromises = orders
        .slice(0, 5)
        .map((o) => orderService.getTimeline(o.id))
      const results = await Promise.all(logsPromises)
      const flatLogs = results
        .flat()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      setActivityLogs(flatLogs.slice(0, 6))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingActivity(false)
    }
  }, [orders])

  useEffect(() => {
    if (orders.length > 0) {
      loadActivityLogs()
    }
  }, [orders, loadActivityLogs])

  // Statistics Computations
  const stats = useMemo(() => {
    const total = orders.length
    const completed = orders.filter((o) => o.status === 'completed')
    const pending = orders.filter(
      (o) => o.status === 'pending' || o.status === 'payment_pending'
    )
    const disputes = orders.filter((o) => o.status === 'disputed')
    const revenue = completed.reduce((acc, o) => acc + Number(o.amount), 0)

    return {
      total,
      revenue,
      pending: pending.length,
      completed: completed.length,
      disputes: disputes.length,
      rating: 4.8, // Placeholder rating
    }
  }, [orders])

  // Revenue chart dataset placeholders
  const chartData = useMemo(() => {
    if (chartPeriod === 'daily') {
      return [
        { label: 'Mon', amount: stats.revenue * 0.15 },
        { label: 'Tue', amount: stats.revenue * 0.1 },
        { label: 'Wed', amount: stats.revenue * 0.2 },
        { label: 'Thu', amount: stats.revenue * 0.15 },
        { label: 'Fri', amount: stats.revenue * 0.3 },
        { label: 'Sat', amount: stats.revenue * 0.05 },
        { label: 'Sun', amount: stats.revenue * 0.05 },
      ]
    }
    if (chartPeriod === 'weekly') {
      return [
        { label: 'Week 1', amount: stats.revenue * 0.2 },
        { label: 'Week 2', amount: stats.revenue * 0.35 },
        { label: 'Week 3', amount: stats.revenue * 0.15 },
        { label: 'Week 4', amount: stats.revenue * 0.3 },
      ]
    }
    return [
      { label: 'Jan', amount: stats.revenue * 0.05 },
      { label: 'Feb', amount: stats.revenue * 0.1 },
      { label: 'Mar', amount: stats.revenue * 0.08 },
      { label: 'Apr', amount: stats.revenue * 0.12 },
      { label: 'May', amount: stats.revenue * 0.25 },
      { label: 'Jun', amount: stats.revenue * 0.4 },
    ]
  }, [chartPeriod, stats.revenue])

  // Max value for chart sizing
  const maxChartVal = useMemo(() => {
    const vals = chartData.map((d) => d.amount)
    return Math.max(...vals, 100)
  }, [chartData])

  // Client-Side Search and Filter Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Tab Status Filter
        if (activeTab !== 'all' && order.status !== activeTab) {
          return false
        }
        // Buyer Query Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const buyerName = order.buyer?.full_name?.toLowerCase() || ''
          const buyerEmail = order.buyer?.email?.toLowerCase() || ''
          const listingTitle = order.listing?.title?.toLowerCase() || ''
          if (
            !buyerName.includes(query) &&
            !buyerEmail.includes(query) &&
            !listingTitle.includes(query)
          ) {
            return false
          }
        }
        // Platform Filter
        if (selectedPlatform && order.listing?.platform !== selectedPlatform) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        // Date sorting
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        let result = dateSort === 'desc' ? dateB - dateA : dateA - dateB

        // Price sorting overrides if selected
        if (priceSort) {
          const priceA = Number(a.amount)
          const priceB = Number(b.amount)
          result = priceSort === 'desc' ? priceB - priceA : priceA - priceB
        }
        return result
      })
  }, [orders, activeTab, searchQuery, selectedPlatform, dateSort, priceSort])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4">
      {/* Title Header */}
      <div className="border-border/40 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Seller Command Workspace
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Seller Orders Hub
          </h1>
        </div>
      </div>

      {/* Telemetry Dashboard Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          {
            title: 'Total Orders',
            value: stats.total,
            desc: 'All listings orders',
            icon: TrendingUp,
            color: 'text-primary',
          },
          {
            title: 'Gross Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            desc: 'Completed sales only',
            icon: DollarSign,
            color: 'text-emerald-500',
          },
          {
            title: 'Pending Orders',
            value: stats.pending,
            desc: 'Awaiting checks/payments',
            icon: Clock,
            color: 'text-yellow-500',
          },
          {
            title: 'Completed Sales',
            value: stats.completed,
            desc: 'Dispatched successfully',
            icon: CheckCircle,
            color: 'text-emerald-500',
          },
          {
            title: 'Disputes Opened',
            value: stats.disputes,
            desc: 'Awaiting review',
            icon: AlertTriangle,
            color: 'text-orange-500',
          },
          {
            title: 'Seller Rating',
            value: `${stats.rating} / 5.0`,
            desc: 'Buyer review score',
            icon: Star,
            color: 'text-amber-500',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="font-heading text-lg font-bold text-foreground">
              {card.value}
            </div>
            <p className="text-[9px] text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Revenue Graph & Activity logs row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CSS Chart */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-heading text-sm font-bold text-foreground">
              Revenue Analytics
            </h3>
            <div className="flex rounded-lg bg-muted p-0.5 text-[10px] font-semibold">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`rounded-md px-3 py-1 capitalize transition-all ${
                    chartPeriod === period
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="flex h-48 items-end gap-3 px-2 pt-6">
            {chartData.map((d, idx) => {
              const pct = (d.amount / maxChartVal) * 100
              return (
                <div
                  key={idx}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[9px] font-bold text-foreground">
                    ${Math.round(d.amount)}
                  </span>
                  <div
                    className="bg-primary/25 w-full cursor-pointer rounded-t-sm transition-all hover:bg-primary"
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

        {/* Activity feed */}
        <div className="flex flex-col space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-4">
          <h3 className="border-b pb-3 font-heading text-sm font-bold text-foreground">
            Recent Timeline Activities
          </h3>
          <div className="max-h-[190px] flex-1 space-y-4 overflow-y-auto">
            {loadingActivity ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-2.5 text-[10px] leading-relaxed"
                >
                  <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <div>
                    <span className="font-bold capitalize text-foreground">
                      {log.status.replace('_', ' ')}
                    </span>
                    <p className="mt-0.5 text-muted-foreground">
                      {log.notes || 'Order log updated.'}
                    </p>
                    <span className="text-muted-foreground/75 mt-0.5 block text-[8px]">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No recent timeline records found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs list navigation */}
      <div className="scrollbar-none border-border/40 flex gap-2 overflow-x-auto whitespace-nowrap border-b pb-1">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'pending', label: 'Pending' },
          { key: 'payment_received', label: 'Payment Received' },
          { key: 'seller_processing', label: 'Processing' },
          { key: 'buyer_review', label: 'Buyer Review' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
          { key: 'disputed', label: 'Disputed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Query Filters */}
      <div className="bg-muted/30 border-border/50 flex flex-col items-center justify-between gap-4 rounded-xl border p-4 md:flex-row">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search buyer or listing title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Sorting Dropdowns */}
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {/* Platform */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="">All Platforms</option>
            {MARKETPLACE_PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>

          {/* Date sort */}
          <button
            onClick={() =>
              setDateSort((prev) => (prev === 'desc' ? 'asc' : 'desc'))
            }
            className="flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground hover:bg-muted"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Date: {dateSort === 'desc' ? 'Newest' : 'Oldest'}
          </button>

          {/* Price sort */}
          <button
            onClick={() =>
              setPriceSort((prev) => {
                if (prev === '') return 'desc'
                if (prev === 'desc') return 'asc'
                return ''
              })
            }
            className="flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground hover:bg-muted"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            Price:{' '}
            {priceSort === ''
              ? 'Unsorted'
              : priceSort === 'desc'
                ? 'Highest'
                : 'Lowest'}
          </button>
        </div>
      </div>

      {/* Orders list grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="hover:border-border/80 flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors"
            >
              <div className="space-y-3">
                {/* Platform tag and Status */}
                <div className="flex items-center justify-between">
                  <span className="bg-primary/10 rounded px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                    {order.listing?.platform || 'Asset'}
                  </span>
                  <span className="bg-secondary/80 rounded-full px-2.5 py-0.5 text-[9px] font-bold capitalize text-secondary-foreground">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-heading text-sm font-bold leading-snug text-foreground">
                  {order.listing?.title}
                </h4>

                {/* Buyer & Price grid details */}
                <div className="border-border/40 space-y-1.5 border-b border-t py-3 text-[11px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Buyer Profile:</span>
                    <span className="font-bold text-foreground">
                      {order.buyer?.full_name || 'Anonymous User'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purchase Date:</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purchase price:</span>
                    <span className="font-bold text-foreground">
                      ${Number(order.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                {order.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleOrderStatusChange(
                          order.id,
                          'seller_processing',
                          'Seller accepted order. Status updated to processing.'
                        )
                      }
                      className="flex-1 rounded bg-primary py-1.5 text-[10px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() =>
                        handleOrderStatusChange(
                          order.id,
                          'cancelled',
                          'Seller cancelled order transaction.'
                        )
                      }
                      className="hover:bg-destructive/10 flex-1 rounded border border-destructive py-1.5 text-[10px] font-semibold text-destructive transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {order.status === 'payment_pending' && (
                  <button
                    onClick={() =>
                      handleOrderStatusChange(
                        order.id,
                        'cancelled',
                        'Seller cancelled order transaction.'
                      )
                    }
                    className="hover:bg-destructive/10 w-full rounded border border-destructive py-1.5 text-[10px] font-semibold text-destructive transition-colors"
                  >
                    Cancel Order
                  </button>
                )}

                {order.status === 'payment_received' && (
                  <button
                    onClick={() =>
                      handleOrderStatusChange(
                        order.id,
                        'seller_processing',
                        'Seller started credentials processing.'
                      )
                    }
                    className="w-full rounded bg-primary py-1.5 text-[10px] font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Start Processing
                  </button>
                )}

                {order.status === 'seller_processing' && (
                  <button
                    onClick={() =>
                      handleOrderStatusChange(
                        order.id,
                        'buyer_review',
                        'Seller marked details as delivered. Awaiting buyer review verification.'
                      )
                    }
                    className="w-full rounded bg-emerald-600 py-1.5 text-[10px] font-semibold text-white hover:opacity-90"
                  >
                    Mark Delivered
                  </button>
                )}

                {/* Details router link */}
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="flex w-full items-center justify-center gap-1 rounded border border-border py-1.5 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-3 w-3" /> View Escrow Panel
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-dashed py-16 text-center">
          <XCircle className="text-muted-foreground/60 mx-auto h-12 w-12" />
          <h3 className="font-heading text-base font-bold text-foreground">
            No orders matching filters
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            There are no customer escrow orders found under this status tab or
            platform filter settings.
          </p>
        </div>
      )}
    </div>
  )
}
export default SellerOrdersPage
