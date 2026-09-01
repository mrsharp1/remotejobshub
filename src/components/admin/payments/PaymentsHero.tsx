import React from 'react'
import { DollarSign, Wallet, ArrowUpRight, TrendingUp, Clock } from 'lucide-react'
import { Payment, WithdrawalRequest } from '@/types'

interface PaymentsHeroProps {
  payments: Payment[]
  withdrawals?: WithdrawalRequest[]
}

export const PaymentsHero: React.FC<PaymentsHeroProps> = ({ payments, withdrawals = [] }) => {
  // Real calculations
  const totalVolume = payments
    .filter((p) => p.payment_status === 'success' || p.payment_status === 'released')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const escrowBalance = payments
    .filter((p) => p.payment_status === 'success')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const platformCommission = totalVolume * 0.1 // 10% commission rule

  // Today's revenue calculation
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const todayRevenue = payments
    .filter(
      (p) =>
        (p.payment_status === 'success' || p.payment_status === 'released') &&
        p.paid_at &&
        new Date(p.paid_at) >= startOfToday
    )
    .reduce((sum, p) => sum + Number(p.amount), 0) * 0.1

  // Real withdrawal requests sum
  const pendingRequests = withdrawals.filter((w) => w.status === 'pending')
  const pendingWithdrawalsAmount = pendingRequests.reduce((sum, w) => sum + Number(w.amount), 0)

  const metrics = [
    {
      title: 'Total Processed Volume',
      value: `₦${totalVolume.toLocaleString()}`,
      change: '+12.4%',
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600',
      description: 'Lifetime transactional volume',
    },
    {
      title: 'Escrow Under Custody',
      value: `₦${escrowBalance.toLocaleString()}`,
      change: 'Active Locks',
      icon: Wallet,
      color: 'from-emerald-600 to-teal-600',
      description: 'Funds currently held in escrow',
    },
    {
      title: 'Platform Commission (10%)',
      value: `₦${platformCommission.toLocaleString()}`,
      change: '+8.2%',
      icon: ArrowUpRight,
      color: 'from-violet-600 to-purple-600',
      description: 'Net platform earnings',
    },
    {
      title: "Today's Net Revenue",
      value: `₦${todayRevenue.toLocaleString()}`,
      change: 'Live Sync',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      description: 'Today platform earnings',
    },
    {
      title: 'Pending Withdrawals',
      value: `₦${pendingWithdrawalsAmount.toLocaleString()}`,
      change: `${pendingRequests.length} Requests`,
      icon: Clock,
      color: 'from-rose-500 to-pink-600',
      description: 'Withdrawal queue awaiting release',
    },
  ]

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((m, idx) => {
        const Icon = m.icon
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-2xl"
          >
            {/* Ambient Background Glow */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${m.color} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`} />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {m.title}
              </span>
              <div className={`rounded-xl bg-gradient-to-br ${m.color} p-2 text-white shadow-lg`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {m.value}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] font-medium text-muted-foreground">{m.description}</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-foreground uppercase border border-border">
                {m.change}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
