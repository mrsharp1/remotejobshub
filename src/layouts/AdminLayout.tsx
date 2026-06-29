import React, { useState } from 'react'
import { Link, Outlet, Navigate } from 'react-router-dom'
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
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export const AdminLayout: React.FC = () => {
  const { user, profile, loading } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Secure Route Authorization: Check profile.role
  if (!user || profile?.role !== 'admin') {
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
    { label: 'Notifications', to: '/admin?view=notifications', icon: Bell },
    { label: 'Analytics', to: '/admin?view=analytics', icon: BarChart2 },
    { label: 'Settings', to: '/admin?view=settings', icon: Settings },
  ]

  return (
    <div className="bg-muted/30 flex min-h-screen text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Shield className="h-6 w-6 animate-pulse text-destructive" />
          <span className="font-heading text-lg font-bold text-destructive">
            Secure Portal
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <link.icon className="h-4.5 w-4.5" />
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="border-border/40 mt-4 border-t pt-4">
            <Link
              to="/"
              className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Home className="h-4.5 w-4.5" />
              <span>Main Platform</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-50 flex w-64 flex-col space-y-4 bg-background p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="flex items-center gap-1.5 font-heading font-bold text-destructive">
                <Shield className="h-5 w-5" /> Secure Console
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <link.icon className="h-4.5 w-4.5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="border-border/40 mt-4 border-t pt-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Home className="h-4.5 w-4.5" />
                  <span>Main Platform</span>
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Panel Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded p-2 hover:bg-muted md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="border-destructive/20 bg-destructive/5 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive">
            <Lock className="h-3 w-3" /> SECURE CONSOLE
          </div>
          <div className="text-xs font-bold capitalize text-muted-foreground">
            {profile?.full_name || 'Administrator'}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default AdminLayout
