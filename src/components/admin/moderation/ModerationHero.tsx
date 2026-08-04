import React from 'react'
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react'

export const ModerationHero: React.FC = () => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-purple-650 dark:text-purple-400 font-bold uppercase tracking-wider text-[10px]">
          <ShieldCheck className="h-4.5 w-4.5 animate-pulse" />
          <span>Security Compliance Portal</span>
        </div>
        <h1 className="font-heading text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
          Listing Moderation Center
        </h1>
        <p className="text-xs text-slate-500">
          Vet account credentials, review screenshots authenticity, audit KYC records, and approve listings.
        </p>
      </div>

      {/* Mini dashboard counters */}
      <div className="flex gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-xs">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-450">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">18</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Approved Today</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-xs">
          <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-455">
            <XCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">2</span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Rejected Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
