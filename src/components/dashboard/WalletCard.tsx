import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Wallet, ArrowUpRight, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface WalletCardProps {
  availableBalance: number
  pendingBalance: number
  isSeller?: boolean
}

export const WalletCard: React.FC<WalletCardProps> = ({
  availableBalance = 0,
  pendingBalance = 0,
  isSeller = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card relative overflow-hidden p-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-500/0" />

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            Secure Wallet
          </h3>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Available Balance
            </p>
            <p className="mt-1 font-heading text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
              {formatCurrency(availableBalance)}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Locked in Escrow
            </p>
            <p className="mt-1 font-heading text-xl font-bold text-slate-500 dark:text-slate-400">
              {formatCurrency(pendingBalance)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            to={isSeller ? '/seller/wallet' : '/dashboard/wallet'}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition-colors hover:bg-indigo-700"
          >
            Deposit Funds
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to={isSeller ? '/seller/wallet' : '/dashboard/wallet'}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Withdraw
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
