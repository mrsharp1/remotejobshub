import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Wallet as WalletIcon,
  Shield,
  Loader2,
  DollarSign,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { walletService } from '@/services/marketplace/wallet.service'
import { Wallet, WithdrawalRequest } from '@/types'

export const AdminWalletsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null)

  // Adjust balance states
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustReason, setAdjustReason] = useState('')
  const [isAdjusting, setIsAdjusting] = useState(false)

  // Rejection state
  const [rejectionReason, setRejectionReason] = useState('')
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null)

  // Fetch all wallets
  const {
    data: wallets = [],
    isLoading,
    refetch: refetchWallets,
  } = useQuery({
    queryKey: ['admin-all-wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*, profile:profiles(*)')
        .order('available_balance', { ascending: false })

      if (error) throw error
      return (data || []) as Wallet[]
    },
  })

  // Fetch all payout requests
  const {
    data: payouts = [],
    isLoading: isPayoutsLoading,
    refetch: refetchPayouts,
  } = useQuery({
    queryKey: ['admin-all-payouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as WithdrawalRequest[]
    },
  })

  // Adjust Wallet Balance
  const handleAdjustBalance = async (type: 'credit' | 'debit') => {
    if (!selectedWalletId || !adjustAmount) return
    const amt = parseFloat(adjustAmount)
    if (isNaN(amt) || amt <= 0) return

    const activeWallet = wallets.find((w) => w.id === selectedWalletId)
    if (!activeWallet) return

    setIsAdjusting(true)
    try {
      await walletService.adminAdjustBalance(
        activeWallet.user_id,
        type,
        amt,
        adjustReason.trim() || `Admin manual balance adjustment`
      )
      alert(`Wallet balance adjusted successfully!`)
      setAdjustAmount('')
      setAdjustReason('')
      refetchWallets()
    } catch {
      alert('Balance adjustment failed.')
    } finally {
      setIsAdjusting(false)
    }
  }

  // Payout actions
  const handleApprovePayout = async (id: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal request?'))
      return
    try {
      await walletService.approveWithdrawal(id)
      alert('Withdrawal request approved successfully!')
      refetchWallets()
      refetchPayouts()
    } catch {
      alert('Payout approval failed.')
    }
  }

  const handleRejectPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayoutId || !rejectionReason.trim()) return
    try {
      await walletService.rejectWithdrawal(
        selectedPayoutId,
        rejectionReason.trim()
      )
      alert('Withdrawal request rejected.')
      setSelectedPayoutId(null)
      setRejectionReason('')
      refetchWallets()
      refetchPayouts()
    } catch {
      alert('Payout rejection failed.')
    }
  }

  // Filtered list
  const filteredWallets = wallets.filter((w) => {
    const fullName = w.profile?.full_name || ''
    const email = w.profile?.email || ''
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const activeWallet = wallets.find((w) => w.id === selectedWalletId)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
          Security Administrator Control Panel
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Platform Wallets & Payout Control
        </h1>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Left Column: Wallets Auditing List */}
        <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border bg-card shadow-sm lg:col-span-4">
          <div className="bg-muted/10 space-y-2 border-b p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              User Wallets
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background py-1.5 pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          <div className="divide-border/40 flex-1 divide-y overflow-y-auto bg-background">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredWallets.length === 0 ? (
              <div className="py-10 text-center text-xs italic text-muted-foreground">
                No active wallets found.
              </div>
            ) : (
              filteredWallets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWalletId(w.id)}
                  className={`flex w-full items-center justify-between p-3.5 text-left transition-colors ${
                    selectedWalletId === w.id
                      ? 'bg-primary/5 border-l-4 border-primary'
                      : 'hover:bg-muted/30 bg-background'
                  }`}
                >
                  <div className="truncate text-xs">
                    <span className="block truncate font-bold text-foreground">
                      {w.profile?.full_name || 'User'}
                    </span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {w.profile?.email || 'N/A'}
                    </span>
                  </div>
                  <span className="shrink-0 pl-2 text-xs font-bold text-foreground">
                    ${w.available_balance.toFixed(2)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Wallet Auditor Workspace */}
        <div className="space-y-6 lg:col-span-8">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
            {/* Balance adjuster forms */}
            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="flex items-center gap-1.5 border-b pb-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <Shield className="h-4.5 w-4.5 text-primary" /> Wallet Adjuster
              </h3>
              {activeWallet ? (
                <div className="space-y-4 text-xs">
                  <div className="bg-muted/30 flex items-center justify-between rounded-lg p-3">
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-muted-foreground">
                        Selected Wallet Balance
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        ${activeWallet.available_balance.toFixed(2)}
                      </span>
                    </div>
                    <span className="max-w-[150px] truncate text-[10px] font-semibold text-muted-foreground">
                      Owner: {activeWallet.profile?.full_name}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">
                      Adjust Amount ($USD)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 50.00"
                      step="0.01"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">
                      Audit Reason
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Promo reward, account correction"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-xs text-foreground"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdjustBalance('credit')}
                      disabled={isAdjusting}
                      className="flex flex-1 items-center justify-center gap-1 rounded bg-emerald-600 py-2 text-[10px] font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                      <Plus className="h-3.5 w-3.5" /> Credit Wallet
                    </button>
                    <button
                      onClick={() => handleAdjustBalance('debit')}
                      disabled={isAdjusting}
                      className="hover:bg-destructive/90 flex flex-1 items-center justify-center gap-1 rounded bg-destructive py-2 text-[10px] font-bold text-white transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" /> Debit Wallet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs italic text-muted-foreground">
                  Select a user wallet from the left pane to adjust balances.
                </div>
              )}
            </div>

            {/* Reject Request Form box */}
            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="flex items-center gap-1.5 border-b pb-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <XCircle className="h-4.5 w-4.5 text-destructive" /> Reject
                Payout Request
              </h3>
              {selectedPayoutId ? (
                <form
                  onSubmit={handleRejectPayout}
                  className="space-y-4 text-xs"
                >
                  <div className="bg-destructive/5 border-destructive/20 rounded-lg border p-3 text-[10px] leading-relaxed text-muted-foreground">
                    Rejecting withdrawal request{' '}
                    <span className="font-bold text-destructive">
                      #{selectedPayoutId.slice(0, 8)}
                    </span>
                    . This will automatically restore the requested amount to
                    the seller's available balance index.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">
                      Reason for Rejection
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Invalid bank details or pending dispute resolution checks"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-xs text-foreground"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="hover:bg-destructive/90 w-full rounded bg-destructive py-2 text-[10px] font-bold text-white transition-colors"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayoutId(null)}
                      className="rounded border px-3 py-2 text-[10px] hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-12 text-center text-xs italic text-muted-foreground">
                  Select a payout request reject button below to write rejection
                  reasons.
                </div>
              )}
            </div>
          </div>

          {/* Withdrawal requests log history */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="bg-muted/10 flex items-center gap-2 border-b p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Payout Approvals Queue
              </h3>
            </div>
            <div className="overflow-x-auto">
              {isPayoutsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : payouts.length === 0 ? (
                <div className="bg-background py-8 text-center text-xs italic text-muted-foreground">
                  No payout requests currently queued.
                </div>
              ) : (
                <table className="w-full divide-y text-left text-xs">
                  <thead className="bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Bank Information</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-background text-foreground">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/10">
                        <td className="p-3.5">
                          <div className="font-bold">
                            {p.profile?.full_name}
                          </div>
                          <div className="text-[9px] text-muted-foreground">
                            {p.profile?.email}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold">{p.bank_name}</div>
                          <div className="text-[9px] text-muted-foreground">
                            {p.account_number} ({p.account_name})
                          </div>
                        </td>
                        <td className="p-3.5 font-bold">
                          ${p.amount.toFixed(2)}
                        </td>
                        <td className="p-3.5 text-muted-foreground">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                              p.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : p.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {p.status === 'pending' && (
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => handleApprovePayout(p.id)}
                                className="flex items-center gap-0.5 rounded bg-emerald-600 px-2 py-1.5 text-[9px] font-bold text-white hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Approve
                              </button>
                              <button
                                onClick={() => setSelectedPayoutId(p.id)}
                                className="hover:bg-destructive/90 flex items-center gap-0.5 rounded bg-destructive px-2 py-1.5 text-[9px] font-bold text-white"
                              >
                                <XCircle className="h-3 w-3" /> Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminWalletsPage
