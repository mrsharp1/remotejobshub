import React from 'react'
import { Check, X, ShieldAlert, Ban, Info } from 'lucide-react'

interface DecisionPanelProps {
  onApprove: () => void
  onReject: () => void
  onChangesRequested: () => void
  onArchive: () => void
  onEscalate: () => void
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  onApprove,
  onReject,
  onChangesRequested,
  onArchive,
  onEscalate,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-xs">
      <div>
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Compliance Verdict Control</h4>
        <p className="text-[9.5px] text-slate-400 mt-0.5">Admin moderation actions panel</p>
      </div>

      <div className="grid gap-2 grid-cols-2">
        <button
          type="button"
          onClick={onApprove}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 font-bold text-white shadow transition-colors"
        >
          <Check className="h-4 w-4" /> Approve Listing
        </button>

        <button
          type="button"
          onClick={onReject}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 font-bold text-white shadow transition-colors"
        >
          <X className="h-4 w-4" /> Reject Listing
        </button>

        <button
          type="button"
          onClick={onChangesRequested}
          className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 py-2.5 font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <Info className="h-4 w-4 text-purple-650" /> Request Details Fixes
        </button>
      </div>

      <div className="border-t border-slate-100 dark:border-white/5 pt-3.5 flex gap-2">
        <button
          type="button"
          onClick={onArchive}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <Ban className="h-3.5 w-3.5" /> Pause Listing
        </button>
        <button
          type="button"
          onClick={onEscalate}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-rose-500/10 bg-rose-500/5 py-2 text-[10px] font-bold text-rose-550 hover:bg-rose-500/10"
        >
          <ShieldAlert className="h-3.5 w-3.5" /> Escalate Fraud
        </button>
      </div>
    </div>
  )
}
