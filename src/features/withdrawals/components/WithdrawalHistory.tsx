import React from 'react'
import { Calendar, Loader2, FileText, Ban } from 'lucide-react'
import { useWithdrawals } from '../hooks/useWithdrawals'
import { useCancelWithdrawal } from '../hooks/useCancelWithdrawal'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface WithdrawalHistoryProps {
  userId: string
}

export const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({ userId }) => {
  const queryClient = useQueryClient()
  const { data: withdrawals = [], isLoading } = useWithdrawals(userId)
  const cancelMutation = useCancelWithdrawal()

  const handleCancel = (requestId: string) => {
    cancelMutation.mutate(
      { requestId, userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wallet', userId] })
          queryClient.invalidateQueries({ queryKey: ['seller-wallet', userId] })
          queryClient.invalidateQueries({ queryKey: ['withdrawals', userId] })
          queryClient.invalidateQueries({ queryKey: ['seller-withdrawals', userId] })
          queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
          toast.success('Withdrawal request cancelled successfully!')
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to cancel withdrawal request.')
        },
      }
    )
  }

  const formatNaira = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(val)
  }

  const maskAccountNumber = (num: string) => {
    if (!num) return ''
    if (num.length <= 4) return num
    return `••••••••${num.slice(-4)}`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (withdrawals.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground shadow-sm">
        <p className="text-sm italic">No withdrawal requests found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Withdrawal History
        </h3>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full font-medium">
          {withdrawals.length} {withdrawals.length === 1 ? 'request' : 'requests'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {withdrawals.map((req) => {
          // Detect Cancelled state from rejected status + Cancelled reason
          const isCancelled = req.status === 'rejected' && req.rejection_reason === 'Cancelled by user'
          
          let statusBadgeClass = ''
          let statusLabel = req.status as string

          if (isCancelled) {
            statusLabel = 'cancelled'
            statusBadgeClass = 'bg-slate-500/10 text-slate-500 border-slate-500/20'
          } else if (req.status === 'approved') {
            statusBadgeClass = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          } else if (req.status === 'rejected') {
            statusBadgeClass = 'bg-destructive/10 text-destructive border-destructive/20'
          } else {
            statusBadgeClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }

          return (
            <div
              key={req.id}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-muted/30 text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {req.bank_name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground truncate">
                      {req.account_name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {maskAccountNumber(req.account_number)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="block font-mono text-base font-extrabold text-foreground">
                    {formatNaira(req.amount)}
                  </span>
                  <span
                    className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass}`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>

              {/* Lower Section with Meta Details & Cancel option */}
              <div className="mt-5 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <Calendar className="h-3 w-3" />
                    {new Date(req.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="block text-[9px] font-mono text-muted-foreground/75 truncate max-w-[200px]">
                    ID: {req.id}
                  </span>
                </div>

                {req.status === 'pending' && (
                  <button
                    type="button"
                    disabled={cancelMutation.isPending}
                    onClick={() => handleCancel(req.id)}
                    className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-destructive/30 hover:border-destructive bg-destructive/5 hover:bg-destructive text-[11px] font-bold text-destructive hover:text-white transition-all px-3 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {cancelMutation.isPending && cancelMutation.variables?.requestId === req.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Ban className="h-3.5 w-3.5" />
                        Cancel Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
