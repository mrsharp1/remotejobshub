import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
  Menu,
  X,
  LayoutDashboard,
  Settings,
  Home,
  Wallet,
  MessageSquare,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { NotificationBell } from '@/components/shared/NotificationBell'
export const DashboardLayout: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore()
  const { profile } = useAuthStore()
  return (
    <div className="bg-muted/20 flex min-h-screen">
      <aside
        className={`border-r bg-background transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} hidden flex-col md:flex`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span
            className={`font-heading font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}
          >
            Hub Dashboard
          </span>
          <button
            onClick={toggleSidebar}
            className="rounded p-1 hover:bg-muted"
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className={isSidebarOpen ? 'inline' : 'hidden'}>
              Overview
            </span>
          </Link>
          <Link
            to="/dashboard/messages"
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <MessageSquare className="h-5 w-5" />
            <span className={isSidebarOpen ? 'inline' : 'hidden'}>
              Buyer Messages
            </span>
          </Link>
          <Link
            to="/dashboard/wallet"
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Wallet className="h-5 w-5" />
            <span className={isSidebarOpen ? 'inline' : 'hidden'}>
              Buyer Wallet
            </span>
          </Link>
          <Link
            to="/seller/wallet"
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Wallet className="h-5 w-5 text-amber-500" />
            <span className={isSidebarOpen ? 'inline' : 'hidden'}>
              Seller Wallet
            </span>
          </Link>
          <Link
            to="/seller/messages"
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <MessageSquare className="h-5 w-5 text-amber-500" />
            <span className={isSidebarOpen ? 'inline' : 'hidden'}>
              Seller Messages
            </span>
          </Link>
          <Link
            to="/seller"
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Settings className="h-5 w-5" />
            <span className={isSidebarOpen ? 'inline' : 'hidden'}>
              Seller Settings
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Home className="h-5 w-5" />
            <span className={isSidebarOpen ? 'inline' : 'hidden'}>
              Back to Site
            </span>
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:justify-end">
          <button
            onClick={toggleSidebar}
            className="rounded p-2 hover:bg-muted md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="text-sm">
              {profile?.full_name
                ? `Welcome back, ${profile.full_name} 👋`
                : 'Welcome back!'}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
