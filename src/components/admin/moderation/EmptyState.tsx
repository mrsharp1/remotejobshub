import React from 'react'
import { ShieldCheck } from 'lucide-react'

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-card shadow-sm animate-in fade-in duration-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-450">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-heading text-sm font-bold text-slate-900 dark:text-white">Queue Fully Cleared</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">
        All submitted listings have been moderated successfully. There are no items pending compliance review.
      </p>
    </div>
  )
}
