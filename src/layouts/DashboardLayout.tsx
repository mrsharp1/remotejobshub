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
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { NotificationBell } from '@/components/shared/NotificationBell'

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
    to: '/seller',
    icon: Settings,
    roles: ['seller', 'admin'],
  },
]

export const DashboardLayout: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore()
  const { profile, user, loading } = useAuthStore()
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

  const role = profile?.role ?? 'buyer'
  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  )

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path))

  const NavLinks = ({ onClickLink }: { onClickLink?: () => void }) => (
    <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
      {visibleNav.map((item) => {
        const Icon = item.icon
        const active = isActive(item.to)
        return (
          <Link
            key={item.to + item.label}
            to={item.to}
            onClick={onClickLink}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span
              className={`truncate transition-all ${isSidebarOpen ? 'opacity-100' : 'hidden'}`}
            >
              {item.label}
            </span>
            {active && isSidebarOpen && (
              <ChevronRight className="ml-auto h-3 w-3 opacity-60" />
            )}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="bg-muted/20 flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden flex-col border-r bg-background transition-all duration-300 md:flex ${
          isSidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-3">
          {isSidebarOpen && (
            <span className="font-heading text-sm font-bold text-foreground">
              {role === 'seller' ? 'Seller Hub' : 'Buyer Hub'}
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto rounded-md p-1.5 hover:bg-muted"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        <NavLinks />

        <div className="border-t p-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Home className="h-4 w-4 shrink-0" />
            {isSidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex w-64 flex-col bg-background shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <span className="font-heading font-bold">
                {role === 'seller' ? 'Seller Hub' : 'Buyer Hub'}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <NavLinks onClickLink={() => setMobileOpen(false)} />
              <div className="border-t p-2">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Home className="h-4 w-4 shrink-0" />
                  <span>Back to Site</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 hover:bg-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <NotificationBell />
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

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
