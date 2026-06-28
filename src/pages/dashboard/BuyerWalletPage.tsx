import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet as WalletIcon,
  DollarSign,
  TrendingUp,
  Award,
  History,
  Loader2,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import { walletService } from '@/services/marketplace/wallet.service'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

export const BuyerWalletPage: React.FC = () => {
  const { user } = useAuthStore()
  const [depositAmount, setDepositAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)

  // Fetch current user wallet details
  const { data: wallet, isLoading, refetch: refetchWallet } = useQuery({
    queryKey: ['buyer-wallet', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('No user authenticated')
      return walletService.getWallet(user.id)
    },
    enabled: !!user?.id,
  })

  // Fetch transactions list
  const { data: transactions = [], isLoading: isTxLoading, refetch: refetchTxs } = useQuery({
    queryKey: ['buyer-wallet-transactions', wallet?.id],
    queryFn: () => {
      if (!wallet?.id) return []
      return walletService.getTransactions(wallet.id)
    },
    enabled: !!wallet?.id,
  })

  // Deposit handler
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !wallet?.id || !depositAmount) return
    const amt = parseFloat(depositAmount)
    if (isNaN(amt) || amt <= 0) return

    setIsDepositing(true)
    try {
      // Simulate top up payment verification
      const nextBalance = wallet.available_balance + amt

      // Update available balance
      const { error } = await supabase
        .from('wallets')
        .update({
          available_balance: nextBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)

      if (error) throw error

      // Log transaction
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: wallet.id,
          amount: amt,
          type: 'deposit',
          status: 'completed',
          description: 'Deposited funds via Paystack checkout',
        }
      ])

      alert(`Successfully funded wallet with $${amt.toFixed(2)}!`)
      setDepositAmount('')
      refetchWallet()
      refetchTxs()
    } catch {
      alert('Funding transaction failed.')
    } finally {
      setIsDepositing(false)
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
          My Account Wallet
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your platform balances, referral bonus credits, and transaction timeline logs.
        </p>
      </div>

      {/* Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-card border p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Available Funds</span>
            <WalletIcon className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              ${wallet?.available_balance.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">Ready for marketplace purchases.</p>
          </div>
        </div>

        <div className="bg-card border p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Escrow Holds</span>
            <DollarSign className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              ${wallet?.escrow_balance.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">Secured in active order transactions.</p>
          </div>
        </div>

        <div className="bg-card border p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Bonus Credits</span>
            <Award className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              ${wallet?.bonus_credits.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">Promotional platform credits.</p>
          </div>
        </div>

        <div className="bg-card border p-5 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Referral Earnings</span>
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              ${wallet?.referral_earnings.toFixed(2) || '0.00'}
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1">Earned via user referrals.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Transaction History */}
        <div className="lg:col-span-8 bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2 bg-muted/10">
            <History className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Transaction Timeline History
            </h3>
          </div>

          <div className="overflow-x-auto">
            {isTxLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground italic bg-background">
                No recorded transactions.
              </div>
            ) : (
              <table className="w-full text-left text-xs divide-y">
                <thead className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-background text-foreground">
                  {transactions.map((tx) => {
                    const isCredit = ['deposit', 'escrow_release', 'bonus', 'referral', 'credit'].includes(tx.type)
                    return (
                      <tr key={tx.id} className="hover:bg-muted/10">
                        <td className="p-3.5 capitalize font-bold">{tx.type}</td>
                        <td className={`p-3.5 font-semibold ${isCredit ? 'text-emerald-600' : 'text-destructive'}`}>
                          {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : tx.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-muted-foreground max-w-xs truncate">{tx.description || 'N/A'}</td>
                        <td className="p-3.5 text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Deposit Funds Form */}
        <div className="lg:col-span-4 bg-card border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
            <Plus className="h-4.5 w-4.5 text-primary" /> Top Up Wallet
          </h3>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Amount ($USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-muted-foreground font-semibold text-xs">$</span>
                <input
                  type="number"
                  placeholder="e.g. 100.00"
                  step="0.01"
                  min="5"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border rounded-lg bg-background text-xs text-foreground font-bold"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isDepositing}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              {isDepositing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Fund with Paystack'}
            </button>
          </form>

          <div className="bg-muted/20 border p-3 rounded-lg text-[9px] text-muted-foreground space-y-1.5 leading-relaxed">
            <h4 className="font-bold text-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Secure Wallet Transfers
            </h4>
            <p>Wallet deposits are processed instantly via our payment gateway. These credits can be immediately allocated towards purchases of digital assets or escrow handoffs.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BuyerWalletPage
