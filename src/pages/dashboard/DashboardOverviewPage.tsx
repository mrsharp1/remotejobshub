import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ShoppingBag,
  Wallet,
  MessageSquare,
  Bell,
  ArrowRight,
  TrendingUp,
  Package,
  ShieldCheck,
  Loader2,
  BarChart2,
  Award,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/marketplace/order.service'
import { walletService } from '@/services/marketplace/wallet.service'
import { notificationService } from '@/services/marketplace/notification.service'
import type { Notification } from '@/types'

export const DashboardOverviewPage: React.FC = () => {
  const { profile, user } = useAuthStore()
  const role = profile?.role ?? 'buyer'
  const userId = user?.id ?? ''

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboard-overview-orders', userId],
    queryFn: () =>
      role === 'seller'
        ? orderService.getSellerOrders(userId)
        : orderService.getBuyerOrders(userId),
    enabled: !!userId,
  })

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['dashboard-overview-wallet', userId],
    queryFn: () => walletService.getWallet(userId),
    enabled: !!userId,
  })

  const { data: notifications, isLoading: notifsLoading } = useQuery({
    queryKey: ['dashboard-overview-notifications', userId],
    queryFn: () => notificationService.getNotifications(userId),
    enabled: !!userId,
  })

  const unread = (notifications ?? []).filter((n: Notification) => !n.is_read).length
  const activeOrders = (orders ?? []).filter(
    (o) =>
      o.status !== 'completed' &&
      o.status !== 'cancelled' &&
      o.status !== 'disputed'
  ).length
  const balance = wallet?.available_balance ?? 0

  const isBuyer = role === 'buyer'
  const isSeller = role === 'seller'

  const quickLinks = [
    ...(isBuyer
      ? [
          {
            label: 'My Orders',
            to: '/dashboard/orders',
            icon: ShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Wallet',
            to: '/dashboard/wallet',
            icon: Wallet,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Messages',
            to: '/dashboard/messages',
            icon: MessageSquare,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
          },
          {
            label: 'Notifications',
            to: '/dashboard/settings/notifications',
            icon: Bell,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Analytics',
            to: '/dashboard/analytics',
            icon: BarChart2,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
          },
          {
            label: 'Referrals',
            to: '/dashboard/referrals',
            icon: Award,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
          },
        ]
      : []),
    ...(isSeller
      ? [
          {
            label: 'Seller Studio',
            to: '/seller',
            icon: Package,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Seller Orders',
            to: '/seller/orders',
            icon: ShoppingBag,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Seller Wallet',
            to: '/seller/wallet',
            icon: Wallet,
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
          },
          {
            label: 'Analytics',
            to: '/seller/analytics',
            icon: TrendingUp,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'KYC Verification',
            to: '/seller/verification',
            icon: ShieldCheck,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
          },
          {
            label: 'Referrals',
            to: '/seller/referrals',
            icon: Award,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
          },
        ]
      : []),
  ]

  const isLoading = ordersLoading || walletLoading || notifsLoading

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="to-primary/80 rounded-2xl bg-gradient-to-br from-primary px-6 py-8 shadow">
        <p className="text-primary-foreground/70 text-sm font-medium">
          Welcome back
        </p>
        <h1 className="mt-1 font-heading text-2xl font-extrabold text-primary-foreground">
          {profile?.full_name ?? 'User'} 👋
        </h1>
        <p className="text-primary-foreground/80 mt-1 text-sm capitalize">
          {role} Account
          {profile?.seller_verified && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </p>
      </div>

      {/* Stats Row */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">
              Active Orders
            </p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-foreground">
              {activeOrders}
            </p>
            <Link
              to={isSeller ? '/seller/orders' : '/dashboard/orders'}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">
              Wallet Balance
            </p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-foreground">
              ${balance.toFixed(2)}
            </p>
            <Link
              to={isSeller ? '/seller/wallet' : '/dashboard/wallet'}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View wallet <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="col-span-2 rounded-2xl border bg-card p-4 shadow-sm md:col-span-1">
            <p className="text-xs font-medium text-muted-foreground">
              Unread Notifications
            </p>
            <p className="mt-1 font-heading text-2xl font-extrabold text-foreground">
              {unread}
            </p>
            <Link
              to="/dashboard/notifications"
              className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View notifications <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="mb-4 font-heading text-lg font-bold">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.to + link.label}
                to={link.to}
                className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${link.bg} transition-transform group-hover:scale-110`}
                >
                  <Icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <span className="text-center text-xs font-medium leading-tight">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Orders Preview */}
      {!isLoading && (orders ?? []).length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Recent Orders</h2>
            <Link
              to={isSeller ? '/seller/orders' : '/dashboard/orders'}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(orders ?? []).slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-primary hover:underline"
                        >
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            order.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : order.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-600'
                                : order.status === 'disputed'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-blue-500/10 text-blue-600'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty state for new users */}
      {!isLoading && (orders ?? []).length === 0 && (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <ShoppingBag className="text-muted-foreground/40 mx-auto mb-3 h-10 w-10" />
          <p className="font-semibold text-muted-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isBuyer
              ? 'Browse the marketplace to find your first account.'
              : 'Create your first listing to start selling.'}
          </p>
          <Link
            to={isBuyer ? '/marketplace' : '/seller'}
            className="hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow"
          >
            {isBuyer ? 'Browse Marketplace' : 'Go to Seller Studio'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
