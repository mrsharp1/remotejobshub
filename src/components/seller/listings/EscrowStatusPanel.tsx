import React from 'react'
import { CheckCircle2, ShieldCheck, HelpCircle, AlertOctagon, XCircle } from 'lucide-react'

interface EscrowStatusPanelProps {
  escrowStatus: 'waiting' | 'locked' | 'verifying' | 'released' | 'disputed' | 'cancelled'
}

export const EscrowStatusPanel: React.FC<EscrowStatusPanelProps> = ({ escrowStatus }) => {
  const checkpoints = [
    { key: 'waiting', label: '1. Awaiting Buyer Purchase', desc: 'Listing visible on marketplace feed', ok: true },
    { key: 'locked', label: '2. Escrow Locked', desc: 'Buyer payment verified and secured in vault', ok: ['locked', 'verifying', 'released', 'disputed'].includes(escrowStatus) },
    { key: 'verifying', label: '3. Credentials Inspection', desc: 'Buyer confirming login integrity', ok: ['verifying', 'released', 'disputed'].includes(escrowStatus) },
    { key: 'released', label: '4. Funds Released', desc: 'Payout transferred to seller wallet', ok: escrowStatus === 'released' },
  ]

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 space-y-4 shadow-xl">
      <div>
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">Escrow Progression Dashboard</h4>
        <p className="text-[10px] text-slate-450 mt-0.5">Real-time smart contract state tracker</p>
      </div>

      <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-950">
        {checkpoints.map((c, idx) => (
          <div key={idx} className="flex gap-4 items-start relative z-10">
            <div className={`rounded-full p-1.5 shrink-0 ${c.ok ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-950 text-slate-700'}`}>
              {c.key === 'released' && escrowStatus === 'released' ? (
                <ShieldCheck className="h-4.5 w-4.5" />
              ) : c.ok ? (
                <CheckCircle2 className="h-4.5 w-4.5" />
              ) : (
                <HelpCircle className="h-4.5 w-4.5" />
              )}
            </div>
            <div>
              <span className={`block text-xs font-bold leading-tight ${c.ok ? 'text-white' : 'text-slate-500'}`}>
                {c.label}
              </span>
              <span className="block text-[9.5px] text-slate-400 mt-0.5 leading-relaxed">{c.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {escrowStatus === 'disputed' && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-550/5 p-4 flex gap-3 animate-in fade-in">
          <AlertOctagon className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-white leading-none">Order Disputed</h5>
            <p className="text-[9.5px] text-slate-450 mt-1.5 leading-relaxed">
              Buyer flagged credential matching mismatches. Mediation officers will inspect vault details in 24 hours.
            </p>
          </div>
        </div>
      )}

      {escrowStatus === 'cancelled' && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-550/5 p-4 flex gap-3 animate-in fade-in">
          <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-white leading-none">Order Cancelled</h5>
            <p className="text-[9.5px] text-slate-455 mt-1.5 leading-relaxed">
              Escrow funds have been refunded to the buyer and the listing has been reactivated.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
