import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet as WalletIcon,
  PlusCircle,
  ArrowUpRight,
  Loader2,
  Calendar,
  Tag,
  DollarSign,
  Gift,
  Users,
} from 'lucide-react'
import { walletService } from '@/services/marketplace/wallet.service'
import { useAuthStore } from '@/stores/authStore'
import { WalletTransaction } from '@/types'

export const BuyerWalletPage: React.FC = () => {
  const { user } = useAuthStore()
  const [depositAmount, setDepositAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)

  // Fetch Wallet details
  const {
    data: wallet,
    isLoading: isWalletLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['buyer-wallet', user?.id],
    queryFn: () => (user?.id ? walletService.getWallet(user.id) : null),
    enabled: !!user?.id,
  })

  // Fetch transactions list
  const {
    data: transactions = [],
    isLoading: isTxLoading,
    refetch: refetchTx,
  } = useQuery({
    queryKey: ['buyer-wallet-transactions', wallet?.id],
    queryFn: () => (wallet?.id ? walletService.getTransactions(wallet.id) : []),
    enabled: !!wallet?.id,
  })

  const handleDepositSimulator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet || !depositAmount || Number(depositAmount) <= 0) return
    setIsDepositing(true)
    try {
      await walletService.creditWallet(
        wallet.id,
        Number(depositAmount),
        'Simulated credit deposit via credit card',
        'deposit'
      )
      setDepositAmount('')
      await refetchWallet()
      await refetchTx()
      alert('Deposit processed successfully!')
    } catch {
      alert('Failed to simulate deposit')
    } finally {
      setIsDepositing(false)
    }
  }

  const statCards = [
    {
      title: 'Available Balance',
      amount: wallet?.available_balance || 0,
      icon: DollarSign,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      title: 'Escrow Funds Hold',
      amount: wallet?.escrow_balance || 0,
      icon: WalletIcon,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Bonus Credits',
      amount: wallet?.bonus_credits || 0,
      icon: Gift,
      color: 'text-green-500 bg-green-500/10 border-green-500/20',
    },
    {
      title: 'Referral Earnings',
      amount: wallet?.referral_earnings || 0,
      icon: Users,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          My Account Wallet
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Manage your cash balances, purchase credits, and transactions.
        </p>
      </div>

      {isWalletLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {statCards.map((c, i) => (
              <div
                key={i}
                className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {c.title}
                  </span>
                  <div className={`rounded-lg border p-1.5 ${c.color}`}>
                    <c.icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-black text-foreground">
                    ${Number(c.amount).toFixed(2)}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left Column: Transactions */}
            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-4">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                    Transaction Ledger
                  </h3>
                </div>

                <div className="divide-border/50 divide-y">
                  {isTxLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="py-12 text-center text-xs italic text-muted-foreground">
                      No transactions recorded.
                    </div>
                  ) : (
                    transactions.map((tx: WalletTransaction) => (
                      <div
                        key={tx.id}
                        className="hover:bg-muted/10 flex items-center justify-between p-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted font-bold text-muted-foreground">
                            <Tag className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-bold capitalize text-foreground">
                              {tx.type.replace('_', ' ')}
                            </p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              {tx.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-mono font-black ${
                              Number(tx.amount) > 0
                                ? 'text-green-600'
                                : 'text-foreground'
                            }`}
                          >
                            {Number(tx.amount) > 0 ? '+' : ''}$
                            {Number(tx.amount).toFixed(2)}
                          </span>
                          <span className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
                            <Calendar className="h-2.5 w-2.5" />
                            {new Date(tx.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Fund Wallet Deposit Panel */}
            <div className="space-y-4 lg:col-span-4">
              <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
                <div>
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                    Fund Simulator
                  </h3>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Simulate instantly adding platform credits into your wallet.
                  </p>
                </div>

                <form onSubmit={handleDepositSimulator} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                      Deposit Amount ($)
                    </label>
                    <input
                      type="number"
                      placeholder="100.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
                      min="1"
                      step="any"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isDepositing}
                    className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-bold text-white transition-colors disabled:opacity-60"
                  >
                    {isDepositing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <PlusCircle className="h-3.5 w-3.5" /> Deposit Funds
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default BuyerWalletPage
