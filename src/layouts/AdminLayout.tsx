import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Shield, Home, Users, BarChart } from 'lucide-react'
export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 border-r bg-background flex flex-col">
        <div className="flex h-16 items-center px-6 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-destructive" />
            <span className="font-heading font-bold text-lg">Admin Portal</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link to="/admin" className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Shield className="h-5 w-5" />
            <span>Admin Center</span>
          </Link>
          <Link to="/" className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Home className="h-5 w-5" />
            <span>Main Platform</span>
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="font-bold text-destructive">SECURE CONSOLE</div>
          <div className="text-sm font-medium">Administrator</div>
        </header>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  )
}