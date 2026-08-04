import React from 'react'
import { Plus, Sparkles, Wallet, BarChart3, ShieldCheck } from 'lucide-react'

interface ListingHeroProps {
  sellerName: string
  onCreateListing: () => void
  onOpenWallet: () => void
  onOpenEscrow: () => void
  onOpenAnalytics: () => void
  hasDrafts: boolean
  onContinueDraft: () => void
}

export const ListingHero: React.FC<ListingHeroProps> = ({
  sellerName,
  onCreateListing,
  onOpenWallet,
  onOpenEscrow,
  onOpenAnalytics,
  hasDrafts,
  onContinueDraft,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl md:p-10 border border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/20">
              Verified Merchant Console
            </span>
          </div>
          <h1 className="font-heading text-2xl font-black md:text-3xl">
            Good Morning, <span className="text-purple-400">{sellerName || 'Partner'}</span>
          </h1>
          <p className="max-w-md text-xs text-slate-400 leading-relaxed">
            Manage your publishing pipeline, verify escrow handovers, and track payments from one unified cockpit.
          </p>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:flex md:items-center">
          <button
            type="button"
            onClick={onCreateListing}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-650 px-4.5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-950/40 hover:bg-purple-700 transition"
          >
            <Plus className="h-4 w-4" /> Create Listing
          </button>

          {hasDrafts && (
            <button
              type="button"
              onClick={onContinueDraft}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4.5 py-3 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition"
            >
              <Sparkles className="h-4 w-4" /> Continue Draft
            </button>
          )}

          <button
            type="button"
            onClick={onOpenWallet}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            <Wallet className="h-4 w-4 text-purple-400" /> Wallet
          </button>

          <button
            type="button"
            onClick={onOpenEscrow}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Escrow
          </button>

          <button
            type="button"
            onClick={onOpenAnalytics}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            <BarChart3 className="h-4 w-4 text-indigo-400" /> Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
