import React, { useState } from 'react'
import { FileWarning, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/utils/currency'

export const RefundRequests: React.FC = () => {
  const [requests, setRequests] = useState([
    {
      id: 'REF-048',
      buyer: 'Amara Nwosu',
      listing: 'Enterprise Python Script Refactor',
      amount: 450,
      reason: 'Seller delivered code with incomplete database triggers and schema mismatch.',
      status: 'pending',
    },
    {
      id: 'REF-047',
      buyer: 'Kenji Sato',
      listing: 'Tailwind React Frontend Integration',
      amount: 800,
      reason: 'Standard components missing responsive states. Seller is unresponsive.',
      status: 'approved',
    },
  ])

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: decision } : r))
    )
    toast.success(`Refund request ${id} status updated to ${decision.toUpperCase()}`)
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-indigo-400" />
            <h3 className="font-heading text-base font-bold text-white">Refund Disputes</h3>
          </div>
          <p className="text-[11px] text-slate-400">Review buyer escrow refund requests & claims</p>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-bold text-rose-400 uppercase">
          {requests.filter((r) => r.status === 'pending').length} Active Disputes
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-white/5 bg-slate-950/40 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-indigo-400">{r.id}</span>
                <h4 className="font-bold text-white text-xs">{r.listing}</h4>
                <p className="text-[10px] text-slate-400">Buyer: {r.buyer} • Amount: {formatCurrency(r.amount)}</p>
              </div>
              <span className={`rounded-xl px-2 py-0.5 text-[9px] font-bold uppercase ${
                r.status === 'pending'
                  ? 'bg-amber-500/10 text-amber-400'
                  : r.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="rounded-lg bg-slate-900/40 p-3 border border-white/5 text-[10.5px] text-slate-300 italic leading-relaxed">
              &ldquo;{r.reason}&rdquo;
            </div>

            {r.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(r.id, 'approved')}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> Approve Refund
                </button>
                <button
                  onClick={() => handleDecision(r.id, 'rejected')}
                  className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-rose-700"
                >
                  <X className="h-3.5 w-3.5" /> Reject Claim
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
