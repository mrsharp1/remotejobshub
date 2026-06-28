import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bookmark,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Loader2,
  Calendar,
  XCircle,
  Download,
  MessageSquare,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/marketplace/order.service'
import { Order } from '@/types'
import { EscrowProgress } from '@/components/marketplace/EscrowProgress'

const MARKETPLACE_PLATFORMS = [
  'Outlier',
  'Handshake',
  'DataAnnotation',
  'TELUS',
  'Scale AI',
  'Appen',
  'OneForma',
]

export const BuyerOrdersPage: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Filters & Sorting state variables
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc')
  const [priceSort, setPriceSort] = useState<'desc' | 'asc' | ''>('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [chartPeriod, setChartPeriod] = useState<'spending' | 'volume'>(
    'spending'
  )

  // Fetch Buyer Orders
  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['buyer-orders', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('No user authenticated')
      return orderService.getBuyerOrders(user.id)
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
      console.error('Failed to change order status:', err)
    }
  }

  // Download invoice simulation
  const handleDownloadInvoice = (order: Order) => {
    const receiptContent = `
=========================================
      REMOTE JOBS HUB - ESCROW INVOICE
=========================================
Order Reference: #${order.id}
Purchase Date: ${new Date(order.created_at).toLocaleDateString()}
Platform Category: ${order.listing?.platform}
Item Title: ${order.listing?.title}
Seller Reference: #${order.seller_id}
Buyer Reference: #${order.buyer_id}
-----------------------------------------
Subtotal: $${Number(order.amount).toLocaleString()} USD
Escrow Fees: $0.00 USD
Total Paid: $${Number(order.amount).toLocaleString()} USD
-----------------------------------------
Status: ${order.status.toUpperCase()}
Thank you for using Remote Jobs Hub secure Escrow!
=========================================
`
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Invoice_Order_${order.id.slice(0, 8)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Telemetry statistics aggregates
  const stats = useMemo(() => {
    const totalCount = orders.length
    const spent = orders
      .filter(
        (o) =>
          o.status === 'completed' ||
          o.status === 'buyer_review' ||
          o.status === 'seller_processing' ||
          o.status === 'payment_received'
      )
      .reduce((acc, o) => acc + Number(o.amount), 0)

    const active = orders.filter(
      (o) =>
        o.status !== 'completed' &&
        o.status !== 'cancelled' &&
        o.status !== 'disputed'
    )
    const completed = orders.filter((o) => o.status === 'completed')
    const disputes = orders.filter((o) => o.status === 'disputed')

    // Find favorite platform counts
    const platformCounts: { [key: string]: number } = {}
    orders.forEach((o) => {
      if (o.listing?.platform) {
        platformCounts[o.listing.platform] =
          (platformCounts[o.listing.platform] || 0) + 1
      }
    })
    let favPlatform = 'N/A'
    let maxCount = 0
    Object.entries(platformCounts).forEach(([plat, count]) => {
      if (count > maxCount) {
        maxCount = count
        favPlatform = plat
      }
    })

    return {
      total: totalCount,
      spent,
      active: active.length,
      completed: completed.length,
      disputes: disputes.length,
      favPlatform,
    }
  }, [orders])

  // Analytics Chart datasets
  const chartData = useMemo(() => {
    if (chartPeriod === 'volume') {
      return [
        { label: 'Jan', value: 1 },
        { label: 'Feb', value: 2 },
        { label: 'Mar', value: 0 },
        { label: 'Apr', value: 3 },
        {
          label: 'May',
          value: stats.total > 0 ? Math.round(stats.total * 0.4) : 2,
        },
        {
          label: 'Jun',
          value: stats.total > 0 ? Math.round(stats.total * 0.6) : 4,
        },
      ]
    }
    return [
      { label: 'Jan', value: stats.spent * 0.05 },
      { label: 'Feb', value: stats.spent * 0.1 },
      { label: 'Mar', value: stats.spent * 0.0 },
      { label: 'Apr', value: stats.spent * 0.15 },
      { label: 'May', value: stats.spent * 0.3 },
      { label: 'Jun', value: stats.spent * 0.4 },
    ]
  }, [chartPeriod, stats.total, stats.spent])

  const maxChartVal = useMemo(() => {
    const vals = chartData.map((d) => d.value)
    return Math.max(...vals, 10)
  }, [chartData])

  // Client Filter Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Tab Status Filter mapping
        if (activeTab !== 'all') {
          // Tab maps
          if (
            activeTab === 'payment_received' &&
            order.status !== 'payment_received'
          )
            return false
          if (
            activeTab === 'seller_processing' &&
            order.status !== 'seller_processing'
          )
            return false
          if (activeTab === 'buyer_review' && order.status !== 'buyer_review')
            return false
          if (activeTab === 'completed' && order.status !== 'completed')
            return false
          if (activeTab === 'cancelled' && order.status !== 'cancelled')
            return false
          if (activeTab === 'disputed' && order.status !== 'disputed')
            return false
          if (
            activeTab === 'pending' &&
            order.status !== 'pending' &&
            order.status !== 'payment_pending'
          )
            return false
        }

        // Search Input filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const sellerName = order.seller?.full_name?.toLowerCase() || ''
          const listingTitle = order.listing?.title?.toLowerCase() || ''
          if (!sellerName.includes(query) && !listingTitle.includes(query)) {
            return false
          }
        }

        // Selected Platform filter
        if (selectedPlatform && order.listing?.platform !== selectedPlatform) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        let result = dateSort === 'desc' ? dateB - dateA : dateA - dateB

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
            Secure Purchasing Center
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Buyer Dashboard
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          {
            title: 'Total Purchases',
            value: stats.total,
            desc: 'All purchase invoices',
            icon: Bookmark,
            color: 'text-primary',
          },
          {
            title: 'Total Spent',
            value: `$${stats.spent.toLocaleString()}`,
            desc: 'Secured in escrow',
            icon: CreditCard,
            color: 'text-emerald-500',
          },
          {
            title: 'Active Orders',
            value: stats.active,
            desc: 'Milestones pending',
            icon: Clock,
            color: 'text-yellow-500',
          },
          {
            title: 'Completed Orders',
            value: stats.completed,
            desc: 'Fully transferred assets',
            icon: CheckCircle,
            color: 'text-emerald-500',
          },
          {
            title: 'Escrow Disputes',
            value: stats.disputes,
            desc: 'Under moderation review',
            icon: AlertTriangle,
            color: 'text-orange-500',
          },
          {
            title: 'Favorite Platform',
            value: stats.favPlatform,
            desc: 'Most purchased category',
            icon: TrendingUp,
            color: 'text-primary',
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
            <div className="truncate font-heading text-lg font-bold text-foreground">
              {card.value}
            </div>
            <p className="text-[9px] text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Analytics Graph Row */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-heading text-sm font-bold text-foreground">
            Purchase Analytics
          </h3>
          <div className="flex rounded-lg bg-muted p-0.5 text-[10px] font-semibold">
            <button
              onClick={() => setChartPeriod('spending')}
              className={`rounded-md px-3 py-1 transition-all ${
                chartPeriod === 'spending'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Spending Graph
            </button>
            <button
              onClick={() => setChartPeriod('volume')}
              className={`rounded-md px-3 py-1 transition-all ${
                chartPeriod === 'volume'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Volume Graph
            </button>
          </div>
        </div>

        <div className="flex h-44 items-end gap-3 px-2 pt-6">
          {chartData.map((d, idx) => {
            const pct = (d.value / maxChartVal) * 100
            return (
              <div
                key={idx}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[9px] font-bold text-foreground">
                  {chartPeriod === 'spending'
                    ? `$${Math.round(d.value)}`
                    : d.value}
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

      {/* Tabs list navigation */}
      <div className="scrollbar-none border-border/40 flex gap-2 overflow-x-auto whitespace-nowrap border-b pb-1">
        {[
          { key: 'all', label: 'All Purchases' },
          { key: 'pending', label: 'Pending / Unpaid' },
          { key: 'payment_received', label: 'Payment Sent' },
          { key: 'seller_processing', label: 'Processing' },
          { key: 'buyer_review', label: 'Delivered' },
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

      {/* Filters Search Dropdowns */}
      <div className="bg-muted/30 border-border/50 flex flex-col items-center justify-between gap-4 rounded-xl border p-4 md:flex-row">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search seller or listing title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-xs text-foreground focus:outline-none"
          />
        </div>

        {/* Sorting Dropdowns */}
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
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

          <button
            onClick={() =>
              setDateSort((prev) => (prev === 'desc' ? 'asc' : 'desc'))
            }
            className="flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground hover:bg-muted"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Date: {dateSort === 'desc' ? 'Newest' : 'Oldest'}
          </button>

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

      {/* Grid listing content */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="hover:border-border/80 space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm transition-colors"
            >
              <div className="flex flex-col justify-between gap-6 lg:flex-row">
                {/* Product/Listing description block */}
                <div className="max-w-md space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 rounded px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                      {order.listing?.platform}
                    </span>
                    <span className="bg-secondary/80 rounded px-2.5 py-0.5 text-[9px] font-bold capitalize text-secondary-foreground">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold leading-snug text-foreground">
                    {order.listing?.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
                    <div>
                      <span>Seller: </span>
                      <span className="font-bold text-foreground">
                        {order.seller?.full_name || 'Verified Seller'}
                      </span>
                    </div>
                    <div>
                      <span>Purchase Price: </span>
                      <span className="font-bold text-foreground">
                        ${Number(order.amount).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span>Purchased: </span>
                      <span>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone tracking component */}
                <div className="border-border/40 max-w-xl flex-1 border-l pl-0 lg:pl-6">
                  <span className="mb-3 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Milestone Progress
                  </span>
                  <EscrowProgress status={order.status} />
                </div>
              </div>

              {/* Action Buttons row */}
              <div className="border-border/40 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View Escrow Panel
                  </button>

                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Chat Seller
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'buyer_review' && (
                    <>
                      <button
                        onClick={() =>
                          handleOrderStatusChange(
                            order.id,
                            'completed',
                            'Buyer approved delivery. Escrow transaction completed successfully.'
                          )
                        }
                        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        Confirm Delivery
                      </button>
                      <button
                        onClick={() =>
                          handleOrderStatusChange(
                            order.id,
                            'disputed',
                            'Buyer opened dispute claim for transaction.'
                          )
                        }
                        className="rounded-lg border border-orange-500 px-3.5 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-500/10"
                      >
                        Open Dispute
                      </button>
                    </>
                  )}

                  {/* Receipt downloader */}
                  {(order.status === 'completed' ||
                    order.status === 'buyer_review') && (
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="bg-primary/10 hover:bg-primary/20 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-primary transition-all"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-dashed py-16 text-center">
          <XCircle className="text-muted-foreground/60 mx-auto h-12 w-12" />
          <h3 className="font-heading text-base font-bold text-foreground">
            No purchases matching filters
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            There are no purchase records found matching your status or platform
            settings.
          </p>
        </div>
      )}
    </div>
  )
}
export default BuyerOrdersPage
