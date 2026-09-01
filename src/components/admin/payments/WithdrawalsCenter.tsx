import React, { useState } from 'react'
import { Landmark, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { WithdrawalRequest } from '@/types'
import { walletService } from '@/services/marketplace/wallet.service'

interface WithdrawalsCenterProps {
  withdrawals: (WithdrawalRequest & { user?: any })[]
  onRefresh: () => void
}

export const WithdrawalsCenter: React.FC<WithdrawalsCenterProps> = ({ withdrawals, onRefresh }) => {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      setProcessingId(id)
      if (action === 'approve') {
        await walletService.approveWithdrawal(id)
        toast.success(`Withdrawal request approved`)
      } else {
        const reason = prompt('Enter rejection reason:') || 'Administrative rejection'
        await walletService.rejectWithdrawal(id, reason)
        toast.success(`Withdrawal request rejected`)
      }
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || `Failed to ${action} withdrawal`)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-indigo-400" />
            <h3 className="font-heading text-base font-bold text-foreground">Withdrawals Center</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">Approve payout requests from vendor balances</p>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[9px] font-bold text-indigo-400 uppercase">
          {withdrawals.filter((r) => r.status === 'pending').length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {withdrawals.length === 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No withdrawal requests found.
          </div>
        )}
        {withdrawals.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-4 rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-foreground truncate max-w-[100px]">{r.id.split('-')[0]}...</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{r.bank_name} • {r.account_number}</span>
              </div>
              <p className="text-xs font-bold text-foreground">{r.user?.full_name || r.account_name}</p>
              <span className="block font-mono text-xs font-bold text-indigo-400">
                ₦{Number(r.amount).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {r.status === 'pending' && processingId !== r.id && (
                <>
                  <button
                    onClick={() => handleAction(r.id, 'approve')}
                    className="rounded-lg bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white px-3 py-1.5 text-[10px] font-bold text-emerald-400 transition-all"
                  >
                    Approve Payout
                  </button>
                  <button
                    onClick={() => handleAction(r.id, 'reject')}
                    className="rounded-lg bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 hover:text-white px-3 py-1.5 text-[10px] font-bold text-rose-400 transition-all"
                  >
                    Reject
                  </button>
                </>
              )}
              {processingId === r.id && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing
                </span>
              )}
              {r.status === 'approved' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                </span>
              )}
              {r.status === 'rejected' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-2.5 py-1">
                  <XCircle className="h-3.5 w-3.5" /> Rejected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
