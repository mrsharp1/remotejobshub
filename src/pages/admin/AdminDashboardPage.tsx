import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Loader2,
  Search,
  Send,
  Trash2,
  Download,
  CheckSquare,
  Square,
  Smartphone,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Profile, Order, Notification } from '@/types'
import { ExecutiveHero } from '@/components/admin/dashboard/ExecutiveHero'
import { getOrderStatusDisplayLabel } from '@/utils/OrderStatusMapper'
import { useEventSubscriber } from '@/hooks/useEventSubscriber'
import { MetricsGrid } from '@/components/admin/dashboard/MetricsGrid'
import { AnalyticsSection } from '@/components/admin/dashboard/AnalyticsSection'
import { QuickActions } from '@/components/admin/dashboard/QuickActions'
import { ActivityTimeline } from '@/components/admin/dashboard/ActivityTimeline'
import { SystemHealth } from '@/components/admin/dashboard/SystemHealth'
import { ResponsiveTableWrapper } from '@/components/ui/ResponsiveTableWrapper'

export const AdminDashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const view = searchParams.get('view')

  const [chartMetric, setChartMetric] = useState<
    'users' | 'orders' | 'revenue' | 'listings'
  >('revenue')

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])


  // Notification Builder state
  const [targetUserId, setTargetUserId] = useState('')
  const [notifTitle, setNotifTitle] = useState('')
  const [notifMessage, setNotifMessage] = useState('')
  const [notifType, setNotifType] = useState('system')
  const [isSendingNotif, setIsSendingNotif] = useState(false)

  // Settings mock state
  const [commissionRate, setCommissionRate] = useState(10)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Selection states for User Console
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'buyer' | 'seller'>('all')

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
        .select('*, buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*)')
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
  
  useEventSubscriber('ORDER_CREATED', () => { refetchOrders(); refetchNotifications() })
  useEventSubscriber('ESCROW_RELEASED', () => { refetchOrders() })
  useEventSubscriber('DISPUTE_OPENED', () => { refetchOrders(); refetchNotifications() })
  useEventSubscriber('DISPUTE_RESOLVED', () => { refetchOrders() })
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
      pendingKyc: 0,
      pendingWithdrawals: 0,
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

      // 5. Fetch Pending KYC Verifications count
      const { count: pendingKyc } = await supabase
        .from('seller_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // 6. Fetch Pending Withdrawals count
      const { count: pendingWithdrawals } = await supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

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
        pendingKyc: pendingKyc || 0,
        pendingWithdrawals: pendingWithdrawals || 0,
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

  // Bulk Actions
  const handleBulkToggleVerification = async () => {
    if (selectedUserIds.length === 0) return
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ seller_verified: true })
        .in('id', selectedUserIds)
      if (error) throw error
      refetchProfiles()
      setSelectedUserIds([])
      alert('Bulk verification complete!')
    } catch {
      alert('Failed to complete bulk verification')
    }
  }

  const handleBulkExportJSON = () => {
    const selectedProfiles = allProfiles.filter((p) => selectedUserIds.includes(p.id))
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedProfiles, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'exported_users.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
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

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-destructive" />
      </div>
    )
  }

  // --- View: Platform Users Console ---
  if (view === 'users') {
    const filteredProfiles = allProfiles.filter((p) => {
      const matchesSearch =
        (p.full_name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        (p.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
      const matchesRole =
        userRoleFilter === 'all' || p.role === userRoleFilter
      return matchesSearch && matchesRole
    })

    const isAllSelected = filteredProfiles.length > 0 && filteredProfiles.every((p) => selectedUserIds.includes(p.id))

    const handleSelectAll = () => {
      if (isAllSelected) {
        setSelectedUserIds([])
      } else {
        setSelectedUserIds(filteredProfiles.map((p) => p.id))
      }
    }

    const handleToggleSelectUser = (id: string) => {
      setSelectedUserIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      )
    }

    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            User Management Console
          </span>
          <h1 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
            Platform Users Registry
          </h1>
        </div>

        {/* Filters and Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, identifier..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-base focus:outline-none dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            {/* Role filter */}
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-base focus:outline-none dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyers Only</option>
              <option value="seller">Sellers Only</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedUserIds.length > 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 rounded-xl bg-destructive/10 p-1.5 text-xs text-destructive border border-destructive/20"
            >
              <span className="px-2 font-bold">{selectedUserIds.length} Selected</span>
              <button
                onClick={handleBulkToggleVerification}
                className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1 font-bold text-white hover:bg-destructive/90"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Bulk Verify
              </button>
              <button
                onClick={handleBulkExportJSON}
                className="flex items-center gap-1 rounded-lg border border-destructive bg-transparent px-3 py-1 font-bold hover:bg-destructive/10"
              >
                <Download className="h-3.5 w-3.5" /> Export JSON
              </button>
            </motion.div>
          )}
        </div>

        {/* Desktop Table View */}
        <ResponsiveTableWrapper className="hidden md:block border-slate-200 dark:border-slate-800">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
              <tr>
                <th className="p-4 w-10">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {isAllSelected ? (
                      <CheckSquare className="h-4.5 w-4.5 text-destructive" />
                    ) : (
                      <Square className="h-4.5 w-4.5" />
                    )}
                  </button>
                </th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Seller Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-card">
              {filteredProfiles.map((p) => {
                const isSelected = selectedUserIds.includes(p.id)
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-destructive/[0.02]' : ''}`}
                  >
                    <td className="p-4">
                      <button onClick={() => handleToggleSelectUser(p.id)} className="text-slate-400">
                        {isSelected ? (
                          <CheckSquare className="h-4.5 w-4.5 text-destructive" />
                        ) : (
                          <Square className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{p.full_name || 'N/A'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{p.email || 'N/A'}</td>
                    <td className="p-4 capitalize">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.role === 'seller' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {p.seller_verified ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-500">
                          <ShieldCheck className="h-4 w-4" /> Verified
                        </span>
                      ) : (
                        <span className="text-slate-400">Unverified</span>
                      )}
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleUserRole(p.id, p.role)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        Toggle Verify
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ResponsiveTableWrapper>

        {/* Mobile Stacked Card View */}
        <div className="grid gap-4 md:hidden">
          {filteredProfiles.map((p) => {
            const isSelected = selectedUserIds.includes(p.id)
            return (
              <div
                key={p.id}
                className={`premium-card p-5 relative space-y-4 ${isSelected ? 'border-destructive/35 bg-destructive/[0.02]' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleSelectUser(p.id)} className="text-slate-400">
                      {isSelected ? (
                        <CheckSquare className="h-5 w-5 text-destructive" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <span className="font-bold text-slate-900 dark:text-white">{p.full_name || 'N/A'}</span>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.role === 'seller' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}`}>
                    {p.role}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="block">{p.email}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  {p.seller_verified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                      <ShieldCheck className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Unverified</span>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleUserRole(p.id, p.role)}
                      className="rounded-lg border bg-white px-3 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 min-h-[44px]"
                    >
                      Role
                    </button>
                    <button
                      onClick={() =>
                        handleToggleUserVerification(p.id, p.seller_verified || false)
                      }
                      className="rounded-lg border bg-white px-3 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 min-h-[44px]"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // --- View: Escrow Transactions Auditor ---
  if (view === 'orders') {
    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Escrow Transactions Auditor
          </span>
          <h1 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
            Escrow Orders Management
          </h1>
        </div>

        <ResponsiveTableWrapper className="border-slate-200 dark:border-slate-800">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-card">
              {allOrders.map((o) => (
                <tr
                  key={o.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="p-4 font-mono font-bold text-slate-400">
                    {o.id.slice(0, 8)}...
                  </td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">
                    {o.buyer?.full_name || 'buyer'}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    ₦{Number(o.amount).toLocaleString()}
                  </td>
                  <td className="p-4 capitalize">
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                      {getOrderStatusDisplayLabel(o.status as any)}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(o.id, e.target.value)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-base font-medium focus:outline-none dark:border-slate-800 dark:bg-slate-900"
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
        </ResponsiveTableWrapper>
      </div>
    )
  }

  // --- View: System Alerts & Messages Console ---
  if (view === 'notifications') {
    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            System Alerts & Messages Console
          </span>
          <h1 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
            Global Push Broadcasts
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Notification Send Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card lg:col-span-4 space-y-6">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Create Broadcast Payload
            </h3>
            <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-bold text-slate-500">
                  Target User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter profile user UUID"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full rounded-xl border bg-slate-50 p-3 text-base focus:outline-none dark:bg-slate-900"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-bold text-slate-500">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Notification Title"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full rounded-xl border bg-slate-50 p-3 text-base focus:outline-none dark:bg-slate-900"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-bold text-slate-500">
                  Message Details
                </label>
                <textarea
                  placeholder="Notification message body details..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="h-24 w-full rounded-xl border bg-slate-50 p-3 text-base focus:outline-none dark:bg-slate-900"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block font-bold text-slate-500">
                  Delivery Type
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                  className="w-full rounded-xl border bg-slate-50 p-3 text-base focus:outline-none dark:bg-slate-900"
                >
                  <option value="system">System Push Alert</option>
                  <option value="order">Order Transaction Alert</option>
                  <option value="promotion">Marketing Broadcast</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSendingNotif}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-destructive py-3 font-bold text-white transition hover:bg-destructive/90 disabled:opacity-50"
              >
                {isSendingNotif ? 'Sending...' : (
                  <>
                    <Send className="h-4 w-4" /> Send Notification
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Real-time Notification Preview & History */}
          <div className="lg:col-span-8 space-y-6">
            {/* Real-time Mock Previews */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Push Preview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 space-y-3">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Smartphone className="h-4 w-4 text-indigo-400" /> Push Device Mockup
                </span>
                <div className="relative mx-auto h-[130px] w-full max-w-[280px] rounded-3xl border-8 border-slate-800 bg-slate-900 p-2 shadow-xl">
                  {notifTitle || notifMessage ? (
                    <div className="rounded-xl bg-white/95 p-2 text-[10px] text-slate-900 shadow-lg dark:bg-slate-950 dark:text-white border border-slate-100 dark:border-slate-850 animate-bounce">
                      <span className="block font-bold">{notifTitle || 'Notification Header'}</span>
                      <p className="line-clamp-2 mt-0.5 text-slate-500">{notifMessage || 'Notification description text goes here...'}</p>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] italic text-slate-500">
                      Input title to preview push
                    </div>
                  )}
                </div>
              </div>

              {/* Email Mock Preview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 space-y-3">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Mail className="h-4 w-4 text-emerald-400" /> Email Template Mockup
                </span>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[10px] dark:border-slate-800 dark:bg-slate-900/60 max-h-[130px] overflow-y-auto">
                  <div className="border-b border-slate-200/50 pb-2 mb-2">
                    <span className="block font-bold text-slate-700 dark:text-slate-300">From: RJH Security System</span>
                    <span className="block text-slate-500">Subject: {notifTitle || 'Warning Notification Alert'}</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                    {notifMessage || 'Hello, this is a platform security alert regarding your transaction pipeline. Action required.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card">
              <h3 className="mb-4 font-heading text-sm font-bold text-slate-900 dark:text-white">
                Sent Alerts Registry
              </h3>
              <div className="max-h-[300px] divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto">
                {allNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start justify-between py-4 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                      <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                        {n.message}
                      </p>
                      <span className="block font-mono text-[9px] text-slate-400">
                        Recipient ID: {n.user_id}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(n.id)}
                      className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- View: Platform Settings Config ---
  if (view === 'settings') {
    return (
      <div className="space-y-6">
        <div className="border-border/40 border-b pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
            Global Configuration Center
          </span>
          <h1 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
            System Configurations
          </h1>
        </div>

        <div className="max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card text-xs">
          <div>
            <label className="mb-1 block font-bold text-slate-500">
              Escrow Commission Rate (%)
            </label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full rounded-xl border bg-slate-50 p-3 text-base font-bold dark:bg-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-y border-slate-100 py-4 dark:border-slate-800">
            <div>
              <span className="block font-bold text-slate-900 dark:text-white">
                Platform Maintenance Mode
              </span>
              <span className="text-[10px] text-slate-500">
                Prevent listings deployment and transactions execution globally
              </span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-4.5 w-4.5 accent-destructive cursor-pointer"
            />
          </div>

          <button
            onClick={() =>
              alert('Platform config settings saved successfully!')
            }
            className="w-full rounded-xl bg-destructive py-3 font-bold text-white transition hover:bg-destructive/90"
          >
            Save Configuration Settings
          </button>
        </div>
      </div>
    )
  }  // --- View: Main Command Overview (Default Dashboard) ---
  const formattedDate = currentTime.toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = currentTime.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className="space-y-12 pb-14 text-slate-900 dark:text-slate-100">
      <ExecutiveHero
        fullName="Alex Mercer"
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        pendingKyc={telemetry.pendingKyc}
        disputes={telemetry.disputes}
        pendingListings={telemetry.pendingListings}
        pendingWithdrawals={telemetry.pendingWithdrawals}
      />

      <MetricsGrid telemetry={telemetry} />

      <AnalyticsSection
        telemetry={telemetry}
        chartMetric={chartMetric}
        setChartMetric={setChartMetric}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <QuickActions />

        <ActivityTimeline activity={activity} />
      </div>

      <SystemHealth />
    </div>
  )
}
export default AdminDashboardPage
