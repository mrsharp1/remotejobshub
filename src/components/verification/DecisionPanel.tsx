import React from 'react'
import { CheckCircle2, ShieldAlert } from 'lucide-react'

interface DecisionPanelProps {
  onRelease: () => void
  onDispute: () => void
  canRelease: boolean
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ onRelease, onDispute, canRelease }) => {
  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-6 font-heading text-xl font-bold text-white text-center sm:text-left">
        Final Decision
      </h3>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={onRelease}
          disabled={!canRelease}
          className="group flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-6 text-white shadow-xl transition-all hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:hover:bg-emerald-500"
        >
          <CheckCircle2 className="h-8 w-8" />
          <div className="text-center">
            <span className="block font-heading text-lg font-bold">Everything Works</span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-emerald-100">Release Escrow</span>
          </div>
        </button>

        <button
          onClick={onDispute}
          className="group flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
        >
          <ShieldAlert className="h-8 w-8" />
          <div className="text-center">
            <span className="block font-heading text-lg font-bold">Open Dispute</span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-rose-500">Keep Funds Locked</span>
          </div>
        </button>
      </div>

      {!canRelease && (
        <p className="mt-4 text-center text-xs text-slate-500">
          * You must mark all checklist items as completed or failed before releasing escrow.
        </p>
      )}
    </div>
  )
}
