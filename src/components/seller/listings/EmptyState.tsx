import React from 'react'
import { Inbox, Plus } from 'lucide-react'

interface EmptyStateProps {
  onCreateClick: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-12 text-center animate-in fade-in duration-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-heading text-sm font-bold text-white">No Accounts Listed Yet</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">
        Start selling your verified remote work accounts or freelancer profiles. Publish now with secure escrow gates.
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-purple-650 px-4.5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-purple-700 transition"
      >
        <Plus className="h-4 w-4" /> Create First Listing
      </button>
    </div>
  )
}
