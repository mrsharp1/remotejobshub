import React, { useState } from 'react'
import { FileWarning, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/utils/currency'
import { Dispute } from '@/types'
import { disputeService } from '@/services/marketplace/dispute.service'

interface RefundRequestsProps {
  disputes: (Dispute & { order?: any; opened_by_profile?: any })[]
  onRefresh: () => void
}

export const RefundRequests: React.FC<RefundRequestsProps> = ({ disputes, onRefresh }) => {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleDecision = async (id: string, decision: 'buyer' | 'seller') => {
    try {
      setProcessingId(id)
      const notes = prompt('Enter resolution notes for audit trail:') || 'Administrative resolution'
      
      if (decision === 'buyer') {
        await disputeService.resolveBuyer(id, notes)
        toast.success(`Dispute resolved in favor of Buyer (Refunded)`)
      } else {
        await disputeService.resolveSeller(id, notes)
        toast.success(`Dispute resolved in favor of Seller (Released)`)
      }
      
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve dispute')
    } finally {
      setProcessingId(null)
    }
  }

  // Active disputes that require administrative attention
  const activeDisputes = disputes.filter(d => d.status === 'pending' || d.status === 'under_review')

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-indigo-400" />
            <h3 className="font-heading text-base font-bold text-foreground">Refund Disputes</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">Review buyer escrow refund requests & claims</p>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-bold text-rose-400 uppercase">
          {activeDisputes.length} Active Disputes
        </span>
      </div>

      <div className="space-y-4">
        {disputes.length === 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No active refund requests.
          </div>
        )}
        {disputes.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-indigo-400">{d.id.split('-')[0]}...</span>
                <h4 className="font-bold text-foreground text-xs">{d.order?.listing?.title || 'Unknown Listing'}</h4>
                <p className="text-[10px] text-muted-foreground">
                  Buyer: {d.opened_by_profile?.full_name || 'Buyer'} • Amount: {formatCurrency(Number(d.order?.amount || 0))}
                </p>
              </div>
              <span className={`rounded-xl px-2 py-0.5 text-[9px] font-bold uppercase ${
                d.status === 'pending' || d.status === 'under_review'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : d.status === 'resolved_buyer'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {d.status.replace('_', ' ')}
              </span>
            </div>

            <div className="rounded-lg bg-white dark:bg-slate-950 p-3 border border-border/50 text-[10.5px] text-foreground italic leading-relaxed">
              &ldquo;{d.reason}&rdquo;
            </div>

            {(d.status === 'pending' || d.status === 'under_review') && processingId !== d.id && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(d.id, 'buyer')}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/10 border border-emerald-500/20 px-3 py-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-600 hover:text-white"
                >
                  <Check className="h-3.5 w-3.5" /> Approve Refund
                </button>
                <button
                  onClick={() => handleDecision(d.id, 'seller')}
                  className="inline-flex items-center gap-1 rounded-lg bg-rose-600/10 border border-rose-500/20 px-3 py-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 transition-all hover:bg-rose-600 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" /> Reject Claim
                </button>
              </div>
            )}
            
            {processingId === d.id && (
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
