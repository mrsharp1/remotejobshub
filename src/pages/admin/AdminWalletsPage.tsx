import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { walletService } from '@/services/marketplace/wallet.service'
import { Wallet, WithdrawalRequest } from '@/types'

export const AdminWalletsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallets' | 'withdrawals'>(
    'wallets'
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Balance adjustment modal / inputs
  const [adjustingUserId, setAdjustingUserId] = useState<string | null>(null)
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit')
  const [adjustDesc, setAdjustDesc] = useState('')
  const [isAdjusting, setIsAdjusting] = useState(false)

  // Fetch all wallets
  const {
    data: wallets = [],
    isLoading: isWalletsLoading,
    refetch: refetchWallets,
  } = useQuery({
    queryKey: ['admin-wallets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*, profile:profiles(*)')

      if (error) throw error
      return (data || []) as Wallet[]
    },
  })

  // Fetch all withdrawal requests
  const {
    data: withdrawals = [],
    isLoading: isWithdrawalsLoading,
    refetch: refetchWithdrawals,
  } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as WithdrawalRequest[]
    },
  })

  // Adjustment submit
  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustingUserId || !adjustAmount || Number(adjustAmount) <= 0) return
    setIsAdjusting(true)
    try {
      const targetWallet = wallets.find((w) => w.user_id === adjustingUserId)
      if (!targetWallet) throw new Error('Target user wallet not found')

      if (adjustType === 'credit') {
        await walletService.creditWallet(
          targetWallet.id,
          Number(adjustAmount),
          adjustDesc || 'Admin Adjustment'
        )
      } else {
        await walletService.debitWallet(
          targetWallet.id,
          Number(adjustAmount),
          adjustDesc || 'Admin Adjustment'
        )
      }

      setAdjustingUserId(null)
      setAdjustAmount('')
      setAdjustDesc('')
      await refetchWallets()
      alert('Wallet balance adjusted successfully!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to adjust balance')
    } finally {
      setIsAdjusting(false)
    }
  }

  // Approval
  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal payout?'))
      return
    try {
      await walletService.approveWithdrawal(id)
      await refetchWithdrawals()
      await refetchWallets()
      alert('Withdrawal approved and paid!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve withdrawal')
    }
  }

  // Rejection
  const handleReject = async (id: string) => {
    const reason = prompt('Enter reason for rejecting this withdrawal:')
    if (!reason) return
    try {
      await walletService.rejectWithdrawal(id, reason)
      await refetchWithdrawals()
      await refetchWallets()
      alert('Withdrawal request rejected.')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject withdrawal')
    }
  }

  // Filters
  const filteredWallets = wallets.filter((w) => {
    const fullName = w.profile?.full_name || ''
    const email = w.profile?.email || ''
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const filteredWithdrawals = withdrawals.filter((req) => {
    const fullName = req.profile?.full_name || ''
    return fullName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Platform Treasury Department
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Wallet Management Console
          </h1>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-border/60 flex border-b">
        <button
          onClick={() => {
            setActiveTab('wallets')
            setSearchQuery('')
          }}
          className={`-mb-px border-b-2 px-4 py-2 text-xs font-bold transition-colors ${
            activeTab === 'wallets'
              ? 'border-primary font-black text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          User Wallets ({filteredWallets.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('withdrawals')
            setSearchQuery('')
          }}
          className={`-mb-px border-b-2 px-4 py-2 text-xs font-bold transition-colors ${
            activeTab === 'withdrawals'
              ? 'border-primary font-black text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Withdrawal Requests ({filteredWithdrawals.length})
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by profile names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border bg-background py-1.5 pl-9 pr-3 text-xs"
        />
      </div>

      {activeTab === 'wallets' ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Wallets List Grid */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm lg:col-span-8">
            {isWalletsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredWallets.length === 0 ? (
              <div className="py-12 text-center text-xs italic text-muted-foreground">
                No user wallets found.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/30 border-b text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-3">User</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">Pending</th>
                    <th className="p-3">Escrow</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredWallets.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/10">
                      <td className="p-3">
                        <div className="font-bold text-foreground">
                          {w.profile?.full_name || 'Anonymous User'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {w.profile?.email}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold">
                        ${Number(w.available_balance).toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">
                        ${Number(w.pending_balance).toFixed(2)}
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-500">
                        ${Number(w.escrow_balance).toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setAdjustingUserId(w.user_id)}
                          className="rounded border px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-muted"
                        >
                          Adjust Balance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Adjustment Drawer Box */}
          {adjustingUserId && (
            <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:col-span-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                  <ShieldAlert className="h-4 w-4 text-primary" /> Adjust Wallet
                  Balance
                </h3>
                <button
                  onClick={() => setAdjustingUserId(null)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAdjustBalance} className="space-y-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Adjustment Type
                  </label>
                  <select
                    value={adjustType}
                    onChange={(e) =>
                      setAdjustType(e.target.value as 'credit' | 'debit')
                    }
                    className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
                  >
                    <option value="credit">Credit Balance (+)</option>
                    <option value="debit">Debit Balance (-)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    placeholder="100.00"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
                    min="1"
                    step="any"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Reason / Description
                  </label>
                  <input
                    type="text"
                    placeholder="Admin manual override"
                    value={adjustDesc}
                    onChange={(e) => setAdjustDesc(e.target.value)}
                    className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-bold text-white transition-colors disabled:opacity-60"
                >
                  {isAdjusting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <ArrowUpRight className="h-3.5 w-3.5" /> Submit Adjustment
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          {isWithdrawalsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="py-12 text-center text-xs italic text-muted-foreground">
              No withdrawal requests pending approval.
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-muted/30 border-b text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-3">User</th>
                  <th className="p-3">Bank Details</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/10">
                    <td className="p-3">
                      <div className="font-bold text-foreground">
                        {req.profile?.full_name || 'Anonymous User'}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {req.profile?.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-foreground">
                        {req.bank_name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {req.account_number} ({req.account_name})
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold">
                      ${Number(req.amount).toFixed(2)}
                    </td>
                    <td className="p-3 font-bold capitalize text-muted-foreground">
                      {req.status}
                    </td>
                    <td className="space-x-2 p-3 text-right">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="inline-flex items-center gap-1 rounded border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-[10px] font-bold text-green-600 hover:bg-green-500/20"
                          >
                            <CheckCircle className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="border-destructive/25 bg-destructive/10 hover:bg-destructive/20 inline-flex items-center gap-1 rounded border px-2.5 py-1 text-[10px] font-bold text-destructive"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] italic text-muted-foreground">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
export default AdminWalletsPage
