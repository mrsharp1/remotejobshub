import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  Loader2,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  FileText,
} from 'lucide-react'
import { walletService } from '@/services/marketplace/wallet.service'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/utils/currency'
import { WithdrawalRequest } from '@/types'

export const SellerWalletPage: React.FC = () => {
  const { user } = useAuthStore()

  // Withdrawal Form state
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNum, setAccountNum] = useState('')
  const [accountName, setAccountName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Wallet details
  const {
    data: wallet,
    isLoading: isWalletLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['seller-wallet', user?.id],
    queryFn: () => (user?.id ? walletService.getWallet(user.id) : null),
    enabled: !!user?.id,
  })

  // Fetch withdrawal requests list
  const {
    data: withdrawals = [],
    isLoading: isWithdrawLoading,
    refetch: refetchWithdrawals,
  } = useQuery({
    queryKey: ['seller-withdrawals', user?.id],
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

  // Submit Withdrawal request
  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !wallet || !withdrawAmount || Number(withdrawAmount) <= 0)
      return

    if (Number(wallet.available_balance) < Number(withdrawAmount)) {
      alert('Insufficient wallet available balance')
      return
    }

    setIsSubmitting(true)
    try {
      await walletService.requestWithdrawal(
        user.id,
        Number(withdrawAmount),
        bankName,
        accountNum,
        accountName
      )
      setWithdrawAmount('')
      setBankName('')
      setAccountNum('')
      setAccountName('')
      await refetchWallet()
      await refetchWithdrawals()
      alert('Withdrawal request submitted successfully!')
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to submit withdrawal request'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const stats = [
    {
      title: 'Available for Withdrawal',
      amount: wallet?.available_balance || 0,
      icon: DollarSign,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      title: 'Pending Clearances',
      amount: wallet?.pending_balance ?? 0,
      icon: Briefcase,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Escrow Holdings',
      amount: wallet?.escrow_balance || 0,
      icon: WalletIcon,
      color: 'text-green-500 bg-green-500/10 border-green-500/20',
    },
    {
      title: 'Bonus Allocation',
      amount: wallet?.bonus_balance ?? 0,
      icon: Layers,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Earnings & Wallet Center
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Request payouts and inspect your platform balance ledgers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl text-primary">
              <WalletIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {isWalletLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((c, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl dark:bg-card"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${c.color
                    .split(' ')
                    .find((cls) => cls.startsWith('bg-'))
                    ?.replace('bg-', 'from-')
                    .replace('/10', '/5')} via-transparent to-transparent`}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {c.title}
                    </span>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${c.color}`}
                    >
                      <c.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                      {formatCurrency(Number(c.amount))}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left Column: Withdrawals tracking list */}
            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-4">
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                    Withdrawal requests logs
                  </h3>
                </div>

                <div className="divide-border/50 divide-y">
                  {isWithdrawLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : withdrawals.length === 0 ? (
                    <div className="py-12 text-center text-xs italic text-muted-foreground">
                      No withdrawal requests submitted yet.
                    </div>
                  ) : (
                    withdrawals.map((req: WithdrawalRequest) => (
                      <div
                        key={req.id}
                        className="hover:bg-muted/10 flex items-center justify-between p-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted font-bold text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">
                              Payout to {req.bank_name} (
                              {req.account_number.slice(-4)})
                            </p>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              Recipient Name: {req.account_name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block font-mono font-bold text-foreground">
                            {formatCurrency(Number(req.amount))}
                          </span>
                          <span
                            className={`mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase ${
                              req.status === 'approved'
                                ? 'bg-green-500/10 text-green-600'
                                : req.status === 'rejected'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-amber-500/10 text-amber-500'
                            }`}
                          >
                            {req.status}
                          </span>
                          <span className="mt-1.5 flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
                            <Calendar className="h-2.5 w-2.5" />
                            {new Date(req.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Withdrawal form */}
            <div className="space-y-4 lg:col-span-4">
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                    Request Withdrawal
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Request payout to your local bank account.
                  </p>
                </div>

                <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Access Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="focus:ring-primary/20 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-base text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-4 dark:bg-background"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="0123456789"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      className="focus:ring-primary/20 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-base text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-4 dark:bg-background"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
                      Account Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="focus:ring-primary/20 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-base text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-4 dark:bg-background"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-muted-foreground">
                      Amount (₦)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        ₦
                      </span>
                      <input
                        type="number"
                        placeholder="5000.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="focus:ring-primary/20 w-full rounded-xl border border-input bg-white py-2.5 pl-8 pr-4 text-base text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-4 dark:bg-background"
                        min="1"
                        step="any"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="hover:bg-primary/90 group flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ArrowDownLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />{' '}
                        Request Cashout
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
export default SellerWalletPage
