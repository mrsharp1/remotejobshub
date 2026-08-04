import React from 'react'
import { Inbox } from 'lucide-react'

interface EmptyDashboardStateProps {
  explanation: string;
  actionLabel: string;
  actionUrl: string;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = React.memo(({
  explanation,
  actionLabel,
  actionUrl,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-900/20 rounded-3xl border border-dashed border-slate-800 space-y-4 shadow-inner">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-destructive/10 blur-md" />
        <div className="relative h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
          <Inbox className="h-7 w-7 text-destructive" />
        </div>
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h5 className="font-heading text-sm font-bold text-white">Registry Log Empty</h5>
        <p className="text-[11px] text-slate-500 leading-relaxed">{explanation}</p>
      </div>
      <a
        href={actionUrl}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-destructive px-5 text-[11px] font-bold text-white shadow-lg shadow-destructive/20 transition hover:bg-destructive/90"
      >
        {actionLabel}
      </a>
    </div>
  )
})
