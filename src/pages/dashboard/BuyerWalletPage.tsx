import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet as WalletIcon,
  PlusCircle,
  Loader2,
  Calendar,
  Tag,
  DollarSign,
  Gift,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDownLeft,
} from 'lucide-react'
import { walletService } from '@/services/marketplace/wallet.service'
import { useAuthStore } from '@/stores/authStore'
import { WalletTransaction } from '@/types'
import { DepositModal } from '@/components/wallet/DepositModal'
import { WithdrawalModal, WithdrawalHistory } from '@/features/withdrawals'

export const BuyerWalletPage: React.FC = () => {
  const { user } = useAuthStore()
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)

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

  const statCards = [
    {
      title: 'Available Balance',
      amount: wallet?.available_balance || 0,
      icon: DollarSign,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      title: 'Escrow Balance',
      amount: wallet?.escrow_balance || 0,
      icon: WalletIcon,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Bonus Balance',
      amount: wallet?.bonus_balance || 0,
      icon: Gift,
      color: 'text-green-500 bg-green-500/10 border-green-500/20',
    },
    {
      title: 'Referral Balance',
      amount: wallet?.referral_balance || 0,
      icon: Users,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
  ]

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(val)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
      case 'failed':
        return <XCircle className="h-3.5 w-3.5 text-destructive" />
      default:
        return <Clock className="h-3.5 w-3.5 text-amber-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl text-primary shadow-sm">
              <WalletIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                My Wallet
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your balances, deposit funds, and view transaction history.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[15px] font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] min-h-[44px]"
            >
              <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-90" />
              Deposit Funds
            </button>
            <button
              onClick={() => setIsWithdrawalModalOpen(true)}
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-[15px] font-bold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md active:scale-[0.98] min-h-[44px]"
            >
              <ArrowDownLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
              Withdraw Funds
            </button>
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
            {statCards.map((c, i) => (
              <div
                key={i}
                className="group premium-card relative overflow-hidden !p-6"
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
                    <h3 className="font-heading text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground truncate">
                      {formatCurrency(Number(c.amount))}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <WithdrawalHistory userId={user?.id || ''} />

          <div className="grid grid-cols-1 items-start gap-6">
            {/* Transactions Ledger - Full Width */}
            <div className="space-y-4">
              <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                <div className="border-b border-border/50 bg-muted/20 p-5">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                    Transaction History
                  </h3>
                </div>

                <div className="divide-border/50 divide-y">
                  {isTxLoading ? (
                    <div className="flex justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-5 py-24 text-center px-4">
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75"></div>
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                          <Tag className="h-10 w-10" />
                        </div>
                      </div>
                      <div className="max-w-xs">
                        <p className="font-heading text-xl font-extrabold text-foreground">
                          No transactions yet
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Your wallet is ready. Make a deposit to start enjoying premium services.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsDepositModalOpen(true)}
                        className="mt-4 text-sm font-bold text-primary hover:underline underline-offset-4"
                      >
                        Make your first deposit
                      </button>
                    </div>
                  ) : (
                    transactions.map((tx: WalletTransaction) => (
                      <div
                        key={tx.id}
                        className="hover:bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 sm:gap-0 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm text-muted-foreground">
                            {getStatusIcon(tx.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold capitalize text-foreground text-[15px]">
                                {tx.type.replace('_', ' ')}
                              </p>
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  tx.status === 'success'
                                    ? 'bg-green-500/10 text-green-600'
                                    : tx.status === 'failed'
                                      ? 'bg-destructive/10 text-destructive'
                                      : 'bg-amber-500/10 text-amber-600'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                              {tx.description || 'No description provided'}
                            </p>
                            {tx.payment_reference && (
                              <p className="mt-1 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                                Ref: {tx.payment_reference}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-0 border-border/50 pt-3 sm:pt-0">
                          <span
                            className={`font-mono text-[16px] font-black ${
                              Number(tx.amount) > 0
                                ? 'text-green-600 dark:text-green-500'
                                : 'text-foreground'
                            }`}
                          >
                            {Number(tx.amount) > 0 ? '+' : ''}
                            {formatCurrency(Number(tx.amount))}
                          </span>
                          <span className="mt-1 flex items-center justify-end gap-1.5 text-xs text-muted-foreground font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(tx.created_at).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={() => {
          refetchWallet()
          refetchTx()
        }}
      />

      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        userId={user?.id || ''}
        availableBalance={Number(wallet?.available_balance || 0)}
      />
    </div>
  )
}
export default BuyerWalletPage
