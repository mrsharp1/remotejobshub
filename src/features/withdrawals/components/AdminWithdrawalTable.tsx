import React, { useState } from 'react'
import { CheckCircle, XCircle, Loader2, Calendar } from 'lucide-react'
import { withdrawalService } from '../services/withdrawal.service'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatCurrency } from '@/utils/currency'
import type { WithdrawalRequest } from '../types'

interface AdminWithdrawalTableProps {
  withdrawals: WithdrawalRequest[]
  isLoading: boolean
}

export const AdminWithdrawalTable: React.FC<AdminWithdrawalTableProps> = ({
  withdrawals,
  isLoading,
}) => {
  const queryClient = useQueryClient()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal request?')) {
      return
    }

    setProcessingId(id)
    setActionType('approve')
    try {
      await withdrawalService.adminApproveWithdrawal(id)
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['admin-wallets'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      
      toast.success('Withdrawal request approved successfully!')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve withdrawal request.')
    } finally {
      setProcessingId(null)
      setActionType(null)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Please enter the reason for rejecting this withdrawal request:')
    if (reason === null) return // cancelled prompt
    if (!reason.trim()) {
      toast.error('Rejection reason is required.')
      return
    }

    setProcessingId(id)
    setActionType('reject')
    try {
      await withdrawalService.adminRejectWithdrawal(id, reason.trim())
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['admin-wallets'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      
      toast.success('Withdrawal request rejected successfully.')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject withdrawal request.')
    } finally {
      setProcessingId(null)
      setActionType(null)
    }
  }



  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (withdrawals.length === 0) {
    return (
      <div className="py-12 text-center text-xs italic text-muted-foreground">
        No withdrawal requests found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
          <tr>
            <th className="p-4">Reference ID / Date</th>
            <th className="p-4">User</th>
            <th className="p-4">Bank Details</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-border/50 divide-y bg-white dark:bg-card">
          {withdrawals.map((req) => {
            const isCancelled = req.status === 'rejected' && req.rejection_reason === 'Cancelled by user'
            const isPending = req.status === 'pending'
            
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

            const isProcessingThis = processingId === req.id

            return (
              <tr
                key={req.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="p-4">
                  <span className="block font-mono text-xs text-muted-foreground font-semibold max-w-[120px] truncate">
                    {req.id}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(req.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-bold text-foreground">
                    {req.profile?.full_name || 'Anonymous User'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {req.profile?.email || 'N/A'}
                  </div>
                </td>
                <td className="p-4 text-xs space-y-2">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bank:</span>
                    <span className="font-semibold text-foreground">{req.bank_name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account Name:</span>
                    <span className="font-semibold text-foreground">{req.account_name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account Number:</span>
                    <span className="font-mono font-bold text-foreground">{req.account_number}</span>
                  </div>
                </td>
                <td className="p-4 font-mono font-bold text-base text-foreground">
                  {formatCurrency(Number(req.amount))}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass}`}
                  >
                    {statusLabel}
                  </span>
                  {req.rejection_reason && !isCancelled && (
                    <span className="mt-1 block text-[10px] text-destructive max-w-[150px] truncate" title={req.rejection_reason}>
                      Reason: {req.rejection_reason}
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {isPending ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={isProcessingThis}
                        onClick={() => handleApprove(req.id)}
                        className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isProcessingThis && actionType === 'approve' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={isProcessingThis}
                        onClick={() => handleReject(req.id)}
                        className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20 hover:border-destructive/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isProcessingThis && actionType === 'reject' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] italic text-muted-foreground font-semibold uppercase tracking-wider">
                      Read-Only
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
