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
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Left Column: Form Content */}
      <div className="relative z-10 flex w-full flex-col justify-center px-4 py-12 md:w-1/2 lg:w-[45%] xl:px-24">
        <Link
          to="/"
          className="absolute left-8 top-8 z-20 flex items-center gap-3 text-foreground transition-transform hover:scale-105 active:scale-95"
        >
          <div className="shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-2xl font-extrabold tracking-tight">
            Remote Jobs Hub
          </span>
        </Link>
        <div className="mx-auto w-full max-w-md pt-12 md:pt-0">
          <Outlet />
          <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
            &copy; {new Date().getFullYear()} Remote Jobs Hub &mdash; Secure
            Marketplace
          </p>
        </div>
      </div>

      {/* Right Column: Premium Visuals */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-950 md:flex lg:w-[55%]">
        {/* Animated Orbs */}
        <div className="bg-primary/20 absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full mix-blend-screen blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/20 mix-blend-screen blur-[120px]" />

        {/* Subtle mesh background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        {/* Trust Messaging */}
        <div className="relative z-10 flex h-full flex-col justify-center px-12 lg:px-24">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Trusted by 35,000+ Buyers
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight text-white lg:text-5xl">
              Buy & Sell Remote Assets with{' '}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Zero Risk
              </span>
              .
            </h2>
            <p className="text-lg text-slate-300">
              Military-grade escrow, rigorous KYC, and instant transfers.
              Experience the new standard in digital asset acquisitions.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <div className="rounded-full bg-white/10 p-2">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                Verified Listings
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <div className="rounded-full bg-white/10 p-2">
                  <Loader2 className="h-4 w-4 text-white" />
                </div>
                Fast Escrow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
