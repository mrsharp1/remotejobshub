import React from 'react'
import { Link, Outlet, Navigate } from 'react-router-dom'
import {
  Shield,
  Home,
  Users,
  FileText,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Bell,
  TrendingUp,
  Settings,
  LayoutDashboard,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

export const AdminLayout: React.FC = () => {
  const { profile, loading } = useAuthStore()

  if (loading) {
    return <LoadingScreen />
  }

  // Authorize only users where profile role is admin
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/marketplace" replace />
  }

  return (
    <div className="bg-muted/30 flex min-h-screen">
      {/* Sidebar navigation */}
      <aside className="flex w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-destructive" />
            <span className="font-heading text-lg font-bold">Admin Portal</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {[
            { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/admin/users', label: 'Users', icon: Users },
            { to: '/admin/listings', label: 'Listings', icon: FileText },
            { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
            { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
            { to: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
            { to: '/admin/notifications', label: 'Notifications', icon: Bell },
            { to: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
            { to: '/admin/settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={(e) => {
                // Prevent routing for mocked placeholders except main dashboard
                if (item.to !== '/admin') {
                  e.preventDefault()
                  alert(`${item.label} section console is coming soon!`)
                }
              }}
              className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <item.icon className="h-4.5 w-4.5 text-muted-foreground" />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="border-border/40 my-4 border-t pt-4">
            <Link
              to="/"
              className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Home className="h-4.5 w-4.5 text-muted-foreground" />
              <span>Main Platform</span>
            </Link>
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-1.5 font-bold text-destructive">
            <Shield className="h-4.5 w-4.5" /> SECURE CONSOLE
          </div>
          <div className="text-sm font-medium">
            Administrator ({profile.full_name})
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
