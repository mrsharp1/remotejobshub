import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

interface ModerationTimelineProps {
  status: string
}

export const ModerationTimeline: React.FC<ModerationTimelineProps> = ({ status }) => {
  const steps = [
    { label: 'Submitted', ok: true },
    { label: 'AI Scan complete', ok: true },
    { label: 'Document Review done', ok: true },
    { label: 'Vault Verification', ok: ['approved', 'rejected', 'archived'].includes(status) },
    { label: 'Risk Assessment', ok: ['approved', 'rejected', 'archived'].includes(status) },
    { label: 'Decision Locked', ok: ['approved', 'rejected', 'archived'].includes(status) },
  ]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-xs">
      <div>
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Audit Workflow Timeline</h4>
        <p className="text-[9.5px] text-slate-400 mt-0.5">Moderation step sequence log</p>
      </div>

      <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
        {steps.map((s, idx) => (
          <div key={idx} className="flex gap-4 items-center relative z-10">
            <div className={`rounded-full p-1 shrink-0 ${s.ok ? 'bg-purple-500/10 text-purple-650' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
              {s.ok ? (
                <CheckCircle2 className="h-4.5 w-4.5" />
              ) : (
                <Circle className="h-4.5 w-4.5" />
              )}
            </div>
            <span className={`font-bold text-[10px] ${s.ok ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
