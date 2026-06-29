import React from 'react'
import { Outlet, Link, Navigate } from 'react-router-dom'
import { Briefcase, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export const AuthLayout: React.FC = () => {
  const { user, loading } = useAuthStore()

  // While auth is resolving, show spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Already logged in — send back to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="from-primary/5 to-secondary/10 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br via-background px-4 py-12">
      {/* Decorative blobs */}
      <div className="bg-primary/10 pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full blur-3xl" />
      <div className="bg-secondary/20 pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full blur-3xl" />

      {/* Brand Header */}
      <Link
        to="/"
        className="mb-8 flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
      >
        <Briefcase className="h-6 w-6 text-primary" />
        <span className="font-heading text-xl font-bold">Remote Jobs Hub</span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <Outlet />
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Remote Jobs Hub &mdash; Secure
        Marketplace
      </p>
    </div>
  )
}
