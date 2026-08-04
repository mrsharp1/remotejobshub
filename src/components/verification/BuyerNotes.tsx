import React from 'react'

interface BuyerNotesProps {
  notes: string
  onChange: (value: string) => void
}

export const BuyerNotes: React.FC<BuyerNotesProps> = ({ notes, onChange }) => {
  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Verification Notes
      </h3>
      <p className="mb-4 text-xs text-slate-500">
        Log any observations or steps you took. This will be preserved if you need to open a dispute.
      </p>
      
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Password worked. Recovery email changed successfully..."
        className="min-h-[120px] w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-4 text-[16px] text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  )
}
