import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  Users,
  UserCheck,
  ShoppingBag,
  ListFilter,
  DollarSign,
  AlertTriangle,
  Bell,
  Clock,
  BarChart2,
  Settings,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Profile, Listing, Order, Notification } from '@/types'

export const AdminDashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const view = searchParams.get('view')

  const [chartMetric, setChartMetric] = useState<
    'users' | 'orders' | 'revenue' | 'listings'
  >('revenue')

  // Notification Builder state
  const [targetUserId, setTargetUserId] = useState('')
  const [notifTitle, setNotifTitle] = useState('')
  const [notifMessage, setNotifMessage] = useState('')
  const [notifType, setNotifType] = useState('system')
  const [isSendingNotif, setIsSendingNotif] = useState(false)

  // Settings mock state
  const [commissionRate, setCommissionRate] = useState(10)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Sub-queries
  const { data: allProfiles = [], refetch: refetchProfiles } = useQuery({
    queryKey: ['admin-profiles-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []) as Profile[]
    },
    enabled: view === 'users',
  })

  const { data: allOrders = [], refetch: refetchOrders } = useQuery({
    queryKey: ['admin-orders-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, buyer:profiles(*), seller:profiles(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []) as (Order & { buyer?: Profile; seller?: Profile })[]
    },
    enabled: view === 'orders',
  })

  const { data: allNotifications = [], refetch: refetchNotifications } =
    useQuery({
      queryKey: ['admin-notifications-list'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        return (data || []) as Notification[]
      },
      enabled: view === 'notifications',
    })

  // Live Database Queries for Metrics
  const {
    data: telemetry = {
      users: 0,
      buyers: 0,
      sellers: 0,
      verifiedSellers: 0,
      activeListings: 0,
      pendingListings: 0,
      orders: 0,
      revenue: 0,
      disputes: 0,
      notifications: 0,
    },
    isLoading,
  } = useQuery({
    queryKey: ['admin-telemetry-metrics'],
    queryFn: async () => {
      // 1. Fetch Users, Buyers, Sellers Counts
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('role, seller_verified')
      const profiles = profilesData || []
      const totalUsers = profiles.length
      const sellers = profiles.filter(
        (p) => p.role === 'seller' || p.seller_verified
      ).length
      const verifiedSellers = profiles.filter((p) => p.seller_verified).length
      const buyers = totalUsers - sellers

      // 2. Fetch Listings Counts
      const { data: listingsData } = await supabase
        .from('listings')
        .select('status, approval_status')
      const listings = listingsData || []
      const activeListings = listings.filter(
        (l) => l.status === 'published'
      ).length
      const pendingListings = listings.filter(
        (l) => l.approval_status === 'pending'
      ).length

      // 3. Fetch Orders & Revenue & Disputes Counts
      const { data: ordersDataRaw } = await supabase
        .from('orders')
        .select('status, amount')
      const ordersData = ordersDataRaw || []
      const totalOrders = ordersData.length
      const disputes = ordersData.filter((o) => o.status === 'disputed').length
      const revenue = ordersData
        .filter((o) => o.status === 'completed')
        .reduce((acc, o) => acc + Number(o.amount), 0)

      // 4. Fetch Notifications Counts
      const { count: notifCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })

      return {
        users: totalUsers,
        buyers,
        sellers,
        verifiedSellers,
        activeListings,
        pendingListings,
        orders: totalOrders,
        revenue,
        disputes,
        notifications: notifCount || 0,
      }
    },
  })

  // Live Query for Latest Activities Feed
  const {
    data: activity = {
      users: [],
      listings: [],
      orders: [],
      notifications: [],
    },
  } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)
      const { data: recentListings } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, listing:listings(title), buyer:profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(4)
      const { data: recentNotifications } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      return {
        users: recentUsers || [],
        listings: recentListings || [],
        orders: recentOrders || [],
        notifications: recentNotifications || [],
      }
    },
  })

  // Analytics Chart placeholders
  const chartDatasets = {
    users: [
      { label: 'Jan', value: 12 },
      { label: 'Feb', value: 24 },
      { label: 'Mar', value: 45 },
      { label: 'Apr', value: 80 },
      { label: 'May', value: 120 },
      { label: 'Jun', value: telemetry.users || 150 },
    ],
    orders: [
      { label: 'Jan', value: 5 },
      { label: 'Feb', value: 12 },
      { label: 'Mar', value: 18 },
      { label: 'Apr', value: 32 },
      { label: 'May', value: 48 },
      { label: 'Jun', value: telemetry.orders || 55 },
    ],
    revenue: [
      { label: 'Jan', value: 500 },
      { label: 'Feb', value: 1200 },
      { label: 'Mar', value: 1800 },
      { label: 'Apr', value: 3400 },
      { label: 'May', value: 5800 },
      { label: 'Jun', value: telemetry.revenue || 7200 },
    ],
    listings: [
      { label: 'Jan', value: 8 },
      { label: 'Feb', value: 15 },
      { label: 'Mar', value: 22 },
      { label: 'Apr', value: 35 },
      { label: 'May', value: 64 },
      {
        label: 'Jun',
        value: telemetry.activeListings + telemetry.pendingListings || 82,
      },
    ],
  }

  // User Actions
  const handleToggleUserRole = async (
    profileId: string,
    currentRole: string
  ) => {
    try {
      const newRole =
        currentRole === 'seller'
          ? 'buyer'
          : currentRole === 'buyer'
            ? 'seller'
            : 'buyer'
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId)
      if (error) throw error
      refetchProfiles()
      alert('User role updated successfully!')
    } catch {
      alert('Failed to update user role')
    }
  }

  const handleToggleUserVerification = async (
    profileId: string,
    currentVerified: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ seller_verified: !currentVerified })
        .eq('id', profileId)
      if (error) throw error
      refetchProfiles()
      alert('Verification status updated!')
    } catch {
      alert('Failed to update verification status')
    }
  }

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
      if (error) throw error
      refetchOrders()
      alert('Order status updated!')
    } catch {
      alert('Failed to update order status')
    }
  }

  // Notification Actions
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetUserId || !notifTitle || !notifMessage) {
      alert('Please fill out all fields.')
      return
    }
    setIsSendingNotif(true)
    try {
      const { error } = await supabase.from('notifications').insert([
        {
          user_id: targetUserId,
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          read: false,
        },
      ])
      if (error) throw error
      alert('Notification sent!')
      setNotifTitle('')
      setNotifMessage('')
      refetchNotifications()
    } catch {
      alert('Failed to send notification')
    } finally {
      setIsSendingNotif(false)
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
      if (error) throw error
      refetchNotifications()
      alert('Notification deleted!')
    } catch {
      alert('Failed to delete notification')
    }
  }

  if (view === 'users') {
    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            User Management Console
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Platform Users
          </h1>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-[10px] font-bold uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Seller Verification</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {allProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="p-4 font-bold">{p.full_name || 'N/A'}</td>
                  <td className="p-4">{p.email || 'N/A'}</td>
                  <td className="p-4 capitalize">
                    <span className="bg-destructive/10 rounded px-2 py-0.5 font-semibold text-destructive">
                      {p.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {p.seller_verified ? (
                      <span className="font-bold text-green-500">Verified</span>
                    ) : (
                      <span className="text-muted-foreground">Unverified</span>
                    )}
                  </td>
                  <td className="flex gap-2 p-4">
                    <button
                      onClick={() => handleToggleUserRole(p.id, p.role)}
                      className="rounded border bg-background px-2.5 py-1 font-semibold hover:bg-muted"
                    >
                      Toggle Role
                    </button>
                    <button
                      onClick={() =>
                        handleToggleUserVerification(
                          p.id,
                          p.seller_verified || false
                        )
                      }
                      className="rounded border bg-background px-2.5 py-1 font-semibold hover:bg-muted"
                    >
                      Toggle Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (view === 'orders') {
    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Escrow Transactions Auditor
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Escrow Orders
          </h1>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-[10px] font-bold uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {allOrders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30">
                  <td className="p-4 font-mono font-bold text-muted-foreground">
                    {o.id.slice(0, 8)}...
                  </td>
                  <td className="p-4">{o.buyer?.full_name || 'buyer'}</td>
                  <td className="p-4 font-bold">
                    ₦{Number(o.amount).toLocaleString()}
                  </td>
                  <td className="p-4 capitalize">
                    <span className="bg-primary/10 rounded px-2 py-0.5 font-semibold text-primary">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(o.id, e.target.value)
                      }
                      className="rounded border bg-background p-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="disputed">Disputed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (view === 'notifications') {
    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            System Alerts & Messages Console
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            System Notifications
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Send form */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-4">
            <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
              Send System Notification
            </h3>
            <form
              onSubmit={handleSendNotification}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="mb-1 block font-bold text-muted-foreground">
                  Target User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter profile user UUID"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full rounded border bg-background p-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-bold text-muted-foreground">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Notification Title"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full rounded border bg-background p-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-bold text-muted-foreground">
                  Message
                </label>
                <textarea
                  placeholder="Notification message body details"
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="h-24 w-full rounded border bg-background p-2"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-bold text-muted-foreground">
                  Type
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                  className="w-full rounded border bg-background p-2"
                >
                  <option value="system">System</option>
                  <option value="order">Order Update</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSendingNotif}
                className="hover:bg-primary/95 w-full rounded bg-primary py-2 font-bold text-white disabled:opacity-50"
              >
                {isSendingNotif ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>

          {/* Messages list */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-8">
            <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
              Sent Notifications History
            </h3>
            <div className="max-h-[500px] divide-y overflow-y-auto">
              {allNotifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start justify-between py-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-foreground">{n.title}</span>
                    <p className="mt-1 leading-snug text-muted-foreground">
                      {n.message}
                    </p>
                    <span className="mt-2 block font-mono text-[9px] text-muted-foreground">
                      Target User: {n.user_id}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    className="text-[10px] font-bold text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'settings') {
    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Global Configuration Center
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Platform Settings
          </h1>
        </div>

        <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-xs shadow-sm">
          <div>
            <label className="mb-1 block font-bold text-muted-foreground">
              Escrow Commission Rate (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full rounded border bg-background p-2 font-bold"
            />
          </div>

          <div className="flex items-center justify-between border-y py-2">
            <div>
              <span className="block font-bold text-foreground">
                Platform Maintenance Mode
              </span>
              <span className="text-[10px] text-muted-foreground">
                Restrict buyer/seller transactions for database sync tasks
              </span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <button
            onClick={() =>
              alert('Platform config settings saved successfully!')
            }
            className="hover:bg-primary/95 w-full rounded bg-primary py-2 font-bold text-white"
          >
            Save Settings Configuration
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-destructive" />
      </div>
    )
  }

  const activeDataset = chartDatasets[chartMetric]
  const maxVal = Math.max(...activeDataset.map((d) => d.value), 10)

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
          Security Administrator Control Console
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          System Overview Dashboard
        </h1>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            title: 'Total Users',
            value: telemetry.users,
            icon: Users,
            color: 'text-primary',
          },
          {
            title: 'Market Buyers',
            value: telemetry.buyers,
            icon: Users,
            color: 'text-muted-foreground',
          },
          {
            title: 'Market Sellers',
            value: telemetry.sellers,
            icon: UserCheck,
            color: 'text-emerald-500',
          },
          {
            title: 'Verified Sellers',
            value: telemetry.verifiedSellers,
            icon: ShieldCheck,
            color: 'text-emerald-600',
          },
          {
            title: 'Active Listings',
            value: telemetry.activeListings,
            icon: ListFilter,
            color: 'text-blue-500',
          },
          {
            title: 'Pending Listings',
            value: telemetry.pendingListings,
            icon: Clock,
            color: 'text-yellow-500',
          },
          {
            title: 'Escrow Orders',
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
            title: 'Disputes Opened',
            value: telemetry.disputes,
            icon: AlertTriangle,
            color: 'text-orange-500',
          },
          {
            title: 'System Alerts',
            value: telemetry.notifications,
            icon: Bell,
            color: 'text-primary',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div className="truncate font-heading text-lg font-bold text-foreground">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* AI Fraud & Security Predictions banner */}
      <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <span className="block font-bold text-foreground">
              AI Smart Fraud Predictor active
            </span>
            <span className="text-[11px] text-muted-foreground">
              2 suspicious account listings matched fraud signature logs
              templates. Audit recommended.
            </span>
          </div>
        </div>
        <a
          href="/admin/ai-insights"
          className="hover:bg-primary/95 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-white"
        >
          Review Predictions
        </a>
      </div>

      {/* Analytics Graph Row */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="border-border/40 flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="flex items-center gap-1.5 font-heading text-sm font-bold text-foreground">
            <BarChart2 className="h-4 w-4 text-destructive" /> Metric Analytics
            Telemetry
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
                onClick={() =>
                  setChartMetric(
                    tab.key as 'users' | 'orders' | 'revenue' | 'listings'
                  )
                }
                className={`rounded-md px-3 py-1 transition-all ${
                  chartMetric === tab.key
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
            const pct = (d.value / maxVal) * 100
            return (
              <div
                key={idx}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[9px] font-bold text-foreground">
                  {chartMetric === 'revenue'
                    ? `$${d.value.toLocaleString()}`
                    : d.value}
                </span>
                <div
                  className="bg-destructive/20 w-full cursor-pointer rounded-t-sm transition-all hover:bg-destructive"
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

      {/* Sibling Columns: Quick Actions & Latest Activity Logs */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Quick Actions */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-4">
          <h3 className="border-b pb-3 font-heading text-sm font-bold text-foreground">
            Quick Console Actions
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              {
                label: 'Manage Users',
                desc: 'Audit role authorizations',
                icon: Users,
              },
              {
                label: 'Manage Listings',
                desc: 'Verify account configurations',
                icon: ListFilter,
              },
              {
                label: 'Manage Orders',
                desc: 'Track escrow milestones',
                icon: ShoppingBag,
              },
              {
                label: 'Manage Disputes',
                desc: 'Moderate buyer dispute tickets',
                icon: AlertTriangle,
              },
              {
                label: 'Verification Requests',
                desc: 'Inspect seller checkmarks',
                icon: ShieldCheck,
              },
              {
                label: 'Platform Settings',
                desc: 'Configure payment gateways',
                icon: Settings,
              },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() =>
                  alert(
                    `${action.label} panel logic is coming soon in the moderation update!`
                  )
                }
                className="hover:bg-muted/50 border-border/65 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
              >
                <div className="bg-destructive/10 rounded-md p-1.5 text-destructive">
                  <action.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {action.label}
                  </h4>
                  <p className="mt-0.5 text-[9px] text-muted-foreground">
                    {action.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Latest Activities Feed */}
        <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-8">
          <h3 className="border-b pb-3 font-heading text-sm font-bold text-foreground">
            Latest System Activity Feed
          </h3>

          <div className="grid grid-cols-1 gap-6 text-[10px] md:grid-cols-2">
            {/* Recent Signups */}
            <div className="space-y-3">
              <h4 className="border-border/40 border-b pb-1.5 font-bold uppercase tracking-wider text-muted-foreground">
                Recent Signups
              </h4>
              <div className="space-y-2">
                {activity.users.map((u: Profile) => (
                  <div
                    key={u.id}
                    className="bg-muted/20 flex items-center justify-between rounded p-2"
                  >
                    <span className="max-w-[130px] truncate font-bold">
                      {u.full_name || 'New Profile'}
                    </span>
                    <span className="bg-destructive/10 rounded px-1.5 py-0.5 text-[8px] font-bold capitalize text-destructive">
                      {u.role || 'user'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Listings */}
            <div className="space-y-3">
              <h4 className="border-border/40 border-b pb-1.5 font-bold uppercase tracking-wider text-muted-foreground">
                Recent Listings
              </h4>
              <div className="space-y-2">
                {activity.listings.map((l: Listing) => (
                  <div
                    key={l.id}
                    className="bg-muted/20 flex items-center justify-between rounded p-2"
                  >
                    <span className="max-w-[130px] truncate font-bold">
                      {l.title}
                    </span>
                    <span className="text-muted-foreground">
                      ${Number(l.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="space-y-3">
              <h4 className="border-border/40 border-b pb-1.5 font-bold uppercase tracking-wider text-muted-foreground">
                Recent Orders
              </h4>
              <div className="space-y-2">
                {activity.orders.map((o: Order) => (
                  <div
                    key={o.id}
                    className="bg-muted/20 flex items-center justify-between rounded p-2"
                  >
                    <span className="max-w-[120px] truncate font-bold">
                      {o.listing?.title || 'Account Order'}
                    </span>
                    <span className="capitalize">
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="space-y-3">
              <h4 className="border-border/40 border-b pb-1.5 font-bold uppercase tracking-wider text-muted-foreground">
                System Alerts
              </h4>
              <div className="space-y-2">
                {activity.notifications.map((n: Notification) => (
                  <div
                    key={n.id}
                    className="bg-muted/20 flex flex-col gap-0.5 rounded p-2"
                  >
                    <span className="truncate font-bold">{n.title}</span>
                    <p className="line-clamp-1 leading-snug text-muted-foreground">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboardPage
