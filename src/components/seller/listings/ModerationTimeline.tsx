import React from 'react'
import { ShieldCheck, HelpCircle, CheckCircle2, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react'

interface ModerationTimelineProps {
  status: string
  adminComment?: string
  onResubmit?: () => void
}

export const ModerationTimeline: React.FC<ModerationTimelineProps> = ({
  status,
  adminComment,
  onResubmit,
}) => {
  const steps = [
    { key: 'submitted', label: 'Listing Submitted', desc: 'Metadata successfully compiled', ok: ['submitted', 'approved', 'rejected', 'paused', 'sold', 'archived'].includes(status) },
    { key: 'review', label: 'Under Review', desc: 'Compliance agent inspecting vault fields', ok: ['submitted', 'approved', 'rejected', 'paused', 'sold', 'archived'].includes(status) },
    { key: 'approved', label: 'Moderation Clear', desc: 'Listing visible in marketplace', ok: ['approved', 'paused', 'sold', 'archived'].includes(status) && status !== 'rejected' },
  ]

  const isRejected = status === 'rejected'

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 space-y-4 shadow-xl">
      <div>
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">Moderation Timeline</h4>
        <p className="text-[10px] text-slate-450 mt-0.5">Track compliance audit milestones</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {steps.map((s, idx) => (
          <div key={idx} className="flex items-center gap-3 flex-1">
            <div className={`rounded-xl p-2 shrink-0 ${s.ok ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-950 text-slate-650'}`}>
              {s.key === 'approved' && status === 'approved' ? (
                <ShieldCheck className="h-4.5 w-4.5" />
              ) : s.ok ? (
                <CheckCircle2 className="h-4.5 w-4.5" />
              ) : (
                <HelpCircle className="h-4.5 w-4.5" />
              )}
            </div>
            <div>
              <span className={`block text-xs font-bold leading-tight ${s.ok ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
              <span className="block text-[9.5px] text-slate-400 mt-0.5 leading-relaxed">{s.desc}</span>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight className="hidden sm:block h-4 w-4 text-slate-650 shrink-0 ml-auto" />
            )}
          </div>
        ))}
      </div>

      {isRejected && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-550/5 p-4 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-start gap-2.5 text-rose-450">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-heading text-xs font-bold">Audit Action Required</h5>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Moderator has flagged details. Correct them to enable publishing.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-lg p-3 flex items-start gap-2.5 text-[10px] text-slate-300 border border-white/5 leading-relaxed">
            <MessageSquare className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Admin Comments:</strong> "{adminComment || 'Credentials verification failed. Please check recovery details and backup codes.'}"
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onResubmit}
              className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-[10px] font-bold text-white transition-all shadow"
            >
              Update and Resubmit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
