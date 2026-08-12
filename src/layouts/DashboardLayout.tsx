import React, { useState } from 'react'
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  LayoutDashboard,
  Settings,
  Home,
  Wallet,
  MessageSquare,
  Bell,
  Award,
  ShieldCheck,
  BarChart2,
  Ticket,
  ShieldAlert,
  ShoppingBag,
  Package,
  CreditCard,
  Loader2,
  ChevronRight,
  Briefcase,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  roles?: ('buyer' | 'seller' | 'admin')[]
}

const navItems: NavItem[] = [
  // Common
  {
    label: 'Overview',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  // Buyer section
  {
    label: 'My Orders',
    to: '/dashboard/orders',
    icon: ShoppingBag,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Messages',
    to: '/dashboard/messages',
    icon: MessageSquare,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Wallet',
    to: '/dashboard/wallet',
    icon: Wallet,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Payments',
    to: '/dashboard/payments',
    icon: CreditCard,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Offers & Coupons',
    to: '/dashboard/promotions',
    icon: Ticket,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Referrals',
    to: '/dashboard/referrals',
    icon: Award,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Analytics',
    to: '/dashboard/analytics',
    icon: BarChart2,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Security',
    to: '/dashboard/security',
    icon: ShieldAlert,
    roles: ['buyer', 'admin'],
  },
  {
    label: 'Notifications',
    to: '/dashboard/settings/notifications',
    icon: Bell,
    roles: ['buyer', 'admin'],
  },
  // Seller section
  {
    label: 'Seller Studio',
    to: '/seller',
    icon: Package,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Orders',
    to: '/seller/orders',
    icon: ShoppingBag,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Messages',
    to: '/seller/messages',
    icon: MessageSquare,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Wallet',
    to: '/seller/wallet',
    icon: Wallet,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Payments',
    to: '/seller/payments',
    icon: CreditCard,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Boost Listings',
    to: '/seller/promotions',
    icon: Ticket,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Referrals',
    to: '/seller/referrals',
    icon: Award,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Analytics',
    to: '/seller/analytics',
    icon: BarChart2,
    roles: ['seller', 'admin'],
  },
  {
    label: 'KYC Verification',
    to: '/seller/verification',
    icon: ShieldCheck,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Security',
    to: '/seller/security',
    icon: ShieldAlert,
    roles: ['seller', 'admin'],
  },
  {
    label: 'Seller Settings',
    to: '/seller/settings',
    icon: Settings,
    roles: ['seller', 'admin'],
  },
]

export const DashboardLayout: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore()
  const { profile, user, loading, sandboxSession } = useAuthStore()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  const role =
    import.meta.env.DEV && sandboxSession.enabled
      ? sandboxSession.role
      : (profile?.role ?? 'buyer')

  // Prevent buyers from accessing nested seller pages without accepting the agreement
  if (
    role === 'buyer' &&
    location.pathname.startsWith('/seller') &&
    location.pathname !== '/seller'
  ) {
    return <Navigate to="/seller" replace />
  }

  // Seller KYC gate
  const isKycApproved =
    import.meta.env.DEV && sandboxSession.enabled
      ? sandboxSession.kycStatus === 'approved'
      : (profile?.seller_verified || false)

  if (role === 'seller' && !isKycApproved && location.pathname !== '/seller/verification') {
    return <Navigate to="/seller/verification" replace />
  }
  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  )

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path))

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-background">
      {/* Desktop Sidebar (Premium Deep Navy) */}
      <aside
        className={`hidden flex-col bg-slate-900 transition-all duration-300 ease-in-out md:flex ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } border-r border-slate-800 shadow-2xl`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="to-primary/80 shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary shadow-lg">
                <Briefcase className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-lg font-black tracking-tight text-white">
                RJH{' '}
                <span className="ml-1 text-sm font-bold tracking-wide text-primary">
                  {role === 'seller' ? 'STUDIO' : 'HUB'}
                </span>
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-3">
          {visibleNav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)
            return (
              <Link
                key={item.to + item.label}
                to={item.to}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'shadow-primary/20 bg-primary text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                    active ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                <span
                  className={`truncate transition-all ${isSidebarOpen ? 'opacity-100' : 'hidden'}`}
                >
                  {item.label}
                </span>
                {active && isSidebarOpen && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
          >
            <Home className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
            {isSidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-50 flex w-[80%] max-w-sm flex-col bg-slate-900 shadow-2xl"
            >
              <div className="flex min-h-[64px] items-center justify-between border-b border-slate-800 px-4">
                <div className="flex items-center gap-2">
                  <div className="shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-heading text-sm font-bold tracking-wide text-white">
                    {role === 'seller' ? 'Seller Studio' : 'Buyer Hub'}
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white active:scale-95"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-4">
                {visibleNav.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.to)
                  return (
                    <Link
                      key={item.to + item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-base font-medium transition-all duration-200 ${
                        active
                          ? 'shadow-primary/20 bg-primary text-white shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                          active ? 'scale-110' : 'group-hover:scale-110'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="border-t border-slate-800 p-4">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="group flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-base font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                >
                  <Home className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>Back to Site</span>
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <NotificationBell userId={user?.id} />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <div className="hidden text-sm md:block">
                <p className="font-semibold leading-none">
                  {profile?.full_name ?? 'Welcome'}
                </p>
                <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                  {role}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-32 pb-safe md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
