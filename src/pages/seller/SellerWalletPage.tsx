import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet as WalletIcon,
  DollarSign,
  TrendingUp,
  History,
  Loader2,
  Plus,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { walletService } from '@/services/marketplace/wallet.service'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { WithdrawalRequest } from '@/types'

export const SellerWalletPage: React.FC = () => {
  const { user } = useAuthStore()

  // Withdrawal States
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNum, setAccountNum] = useState('')
  const [accountName, setAccountName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch current user wallet details
  const { data: wallet, isLoading, refetch: refetchWallet } = useQuery({
    queryKey: ['seller-wallet', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('No user authenticated')
      return walletService.getWallet(user.id)
    },
    enabled: !!user?.id,
  })

  // Fetch transactions list
  const { data: transactions = [], refetch: refetchTxs } = useQuery({
    queryKey: ['seller-wallet-transactions', wallet?.id],
    queryFn: () => {
      if (!wallet?.id) return []
      return walletService.getTransactions(wallet.id)
    },
    enabled: !!wallet?.id,
  })

  // Fetch withdrawal requests history
  const { data: payouts = [], isLoading: isPayoutsLoading, refetch: refetchPayouts } = useQuery({
    queryKey: ['seller-payouts', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as WithdrawalRequest[]
    },
    enabled: !!user?.id,
  })

  // Handle request payout
  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !wallet) return
    const amt = parseFloat(withdrawAmount)
    if (isNaN(amt) || amt <= 0) {
      alert('Please input a valid positive amount.')
      return
    }
    if (amt > wallet.available_balance) {
      alert('Insufficient available balance.')
      return
    }

    setIsSubmitting(true)
    try {
      await walletService.requestWithdrawal(
        user.id,
        amt,
        bankName.trim(),
        accountNum.trim(),
        accountName.trim()
      )
      alert('Withdrawal request submitted successfully for approval!')
      setWithdrawAmount('')
      setBankName('')
      setAccountNum('')
      setAccountName('')
      refetchWallet()
      refetchTxs()
      refetchPayouts()
    } catch {
      alert('Withdrawal request submission failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b pb-4 border-border/40">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Earnings & Payout Wallet
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Request cashouts, review pending earnings allocations, and track payout timelines.
        </p>
      </div>

      {/* Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card border p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Available for Payout</span>
            <WalletIcon className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              ${wallet?.available_balance.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">Can be withdrawn to bank account immediately.</p>
          </div>
        </div>

        <div className="bg-card border p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Pending Earnings</span>
            <DollarSign className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              ${wallet?.pending_balance.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">Funds currently undergoing approval checks.</p>
          </div>
        </div>

        <div className="bg-card border p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Escrow Holdings</span>
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              ${wallet?.escrow_balance.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">Funds locked in orders escrow.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Withdrawal Requests & Transactions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Payout History */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-2 bg-muted/10">
              <History className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Withdrawal Requests History
              </h3>
            </div>
            <div className="overflow-x-auto">
              {isPayoutsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground italic bg-background">
                  No withdrawal requests found.
                </div>
              ) : (
                <table className="w-full text-left text-xs divide-y">
                  <thead className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase">
                    <tr>
                      <th className="p-3.5">Bank Details</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-background text-foreground">
                    {payouts.map((req) => (
                      <tr key={req.id} className="hover:bg-muted/10">
                        <td className="p-3.5">
                          <div className="font-bold">{req.bank_name}</div>
                          <div className="text-[10px] text-muted-foreground">{req.account_number} ({req.account_name})</div>
                        </td>
                        <td className="p-3.5 font-bold">${req.amount.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            req.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : req.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</td>
                        <td className="p-3.5 text-muted-foreground max-w-xs truncate">{req.rejection_reason || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Transactions list */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/10">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Wallet Transaction Logs
              </h3>
            </div>
            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground italic bg-background">
                  No recorded transactions.
                </div>
              ) : (
                <table className="w-full text-left text-xs divide-y">
                  <thead className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase">
                    <tr>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-background text-foreground">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/10">
                        <td className="p-3.5 capitalize font-bold">{tx.type}</td>
                        <td className="p-3.5 font-bold">${tx.amount.toFixed(2)}</td>
                        <td className="p-3.5 capitalize text-muted-foreground">{tx.status}</td>
                        <td className="p-3.5 text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right: Request Payout Cashout Form */}
        <div className="lg:col-span-4 bg-card border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Plus className="h-4.5 w-4.5 text-primary" /> Request Withdrawal
          </h3>
          <form onSubmit={handleRequestWithdrawal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Amount ($USD)</label>
              <input
                type="number"
                placeholder="e.g. 500.00"
                step="0.01"
                min="10"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-xs text-foreground font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. Chase Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-xs text-foreground"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Account Number</label>
              <input
                type="text"
                placeholder="e.g. 123456789"
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-xs text-foreground"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Account Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe Account"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-xs text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Submit Payout Request'}
            </button>
          </form>

          <div className="bg-muted/20 border p-3 rounded-lg text-[9px] text-muted-foreground space-y-1.5 leading-relaxed">
            <h4 className="font-bold text-foreground flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-primary" /> Processing Times
            </h4>
            <p>Payout requests are audited manually by platform administrators and are typically settled within 1 to 2 business banking days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SellerWalletPage
