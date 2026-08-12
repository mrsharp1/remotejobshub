import React, { useState } from 'react'
import { Link, Outlet, Navigate, useLocation } from 'react-router-dom'
import {
  Shield,
  Home,
  Users,
  Settings,
  ListFilter,
  DollarSign,
  AlertTriangle,
  Bell,
  BarChart2,
  Lock,
  Loader2,
  Menu,
  X,
  Star,
  MessageSquare,
  Wallet,
  Megaphone,
  Award,
  ShieldCheck,
  Ticket,
  ShieldAlert,
  Activity,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'

export const AdminLayout: React.FC = () => {
  const { user, profile, loading, sandboxSession } = useAuthStore()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const effectiveRole =
    import.meta.env.DEV && sandboxSession.enabled
      ? sandboxSession.role
      : (profile?.role ?? 'buyer')

  // Secure Route Authorization: Check effectiveRole
  if (!user || effectiveRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  const sidebarLinks = [
    { label: 'Dashboard', to: '/admin', icon: Shield },
    { label: 'Users', to: '/admin?view=users', icon: Users },
    { label: 'Listings', to: '/admin/listings', icon: ListFilter },
    { label: 'Orders', to: '/admin?view=orders', icon: ListFilter },
    { label: 'Payments', to: '/admin/payments', icon: DollarSign },
    { label: 'Disputes', to: '/admin/disputes', icon: AlertTriangle },
    { label: 'Reviews', to: '/admin/reviews', icon: Star },
    { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
    { label: 'Wallets', to: '/admin/wallets', icon: Wallet },
    { label: 'Broadcasts', to: '/admin/broadcasts', icon: Megaphone },
    { label: 'Referrals', to: '/admin/referrals', icon: Award },
    { label: 'KYC Center', to: '/admin/verification', icon: ShieldCheck },
    { label: 'Campaigns & Coupons', to: '/admin/promotions', icon: Ticket },
    { label: 'Risk Control', to: '/admin/risk', icon: ShieldAlert },
    { label: 'CMS Manager', to: '/admin/cms', icon: Settings },
    { label: 'AI Insights', to: '/admin/ai-insights', icon: Shield },
    { label: 'Automation', to: '/admin/automation', icon: Activity },
    { label: 'Notifications', to: '/admin?view=notifications', icon: Bell },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart2 },
    { label: 'Settings', to: '/admin?view=settings', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 text-foreground dark:bg-background">
      {/* Desktop Sidebar (Premium Deep Navy) */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 shadow-2xl md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
          <div className="to-destructive/80 shadow-destructive/20 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-destructive shadow-lg">
            <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-black tracking-tight text-white">
            RJH{' '}
            <span className="ml-1 text-sm font-bold tracking-wide text-destructive">
              ADMIN
            </span>
          </span>
        </div>
        <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-3">
          {sidebarLinks.map((link, idx) => {
            const active =
              location.pathname === link.to ||
              (link.to !== '/admin' && location.pathname.startsWith(link.to))
            return (
              <Link
                key={idx}
                to={link.to}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-destructive/90 shadow-destructive/20 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <link.icon
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <span>{link.label}</span>
              </Link>
            )
          })}
          <div className="mt-4 border-t border-slate-800 p-3">
            <Link
              to="/"
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
            >
              <Home className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
              <span>Main Platform</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
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
                  <div className="to-destructive/80 shadow-destructive/20 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-destructive shadow-lg">
                    <Shield className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-heading text-lg font-black tracking-tight text-white">
                    RJH{' '}
                    <span className="ml-1 text-sm font-bold tracking-wide text-destructive">
                      ADMIN
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white active:scale-95"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-4">
                {sidebarLinks.map((link, idx) => {
                  const active =
                    location.pathname === link.to ||
                    (link.to !== '/admin' &&
                      location.pathname.startsWith(link.to))
                  return (
                    <Link
                      key={idx}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-base font-medium transition-all duration-200 ${
                        active
                          ? 'bg-destructive/90 shadow-destructive/20 text-white shadow-md'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <link.icon
                        className={`h-5 w-5 shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}
                      />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  )
                })}
                <div className="mt-4 border-t border-slate-800 pt-4">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-base font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                  >
                    <Home className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                    <span>Main Platform</span>
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Panel Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded p-2 hover:bg-muted md:hidden flex h-11 w-11 items-center justify-center"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="border-destructive/20 bg-destructive/5 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive hidden sm:flex">
            <Lock className="h-3 w-3" /> SECURE CONSOLE
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell userId={user?.id} />
            <div className="text-xs font-bold capitalize text-muted-foreground hidden sm:block">
              {profile?.full_name || 'Administrator'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
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
export default AdminLayout
