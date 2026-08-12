import React from 'react'
import { motion } from 'framer-motion'
import { Landmark, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Profile } from '@/types'
import { useWithdrawals } from '@/features/withdrawals/hooks/useWithdrawals'

interface PaymentCardProps {
  profile: Profile | null
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ profile }) => {
  const navigate = useNavigate()
  const { data: withdrawals = [], isLoading } = useWithdrawals(profile?.id)

  const hasPayoutDetails = withdrawals.length > 0
  const latestPayout = withdrawals[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm text-foreground"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">
            Payment Account
          </h3>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-xs text-muted-foreground">
          Checking wallet payout logs...
        </div>
      ) : hasPayoutDetails && latestPayout ? (
        <div className="space-y-3.5">
          <div className="bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-450 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
            <span>Active payout destination configured in Wallet</span>
          </div>

          <div className="bg-muted/30 space-y-2 rounded-xl p-4 text-sm border border-border">
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="text-muted-foreground text-xs">Bank Name</span>
              <span className="font-semibold text-foreground text-xs">
                {latestPayout.bank_name}
              </span>
            </div>
            <div className="border-border/50 flex justify-between border-b pb-2">
              <span className="text-muted-foreground text-xs">Account Name</span>
              <span className="font-semibold text-foreground text-xs">
                {latestPayout.account_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Account Number</span>
              <span className="font-mono font-semibold text-foreground text-xs">
                {latestPayout.account_number}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/seller/wallet')}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 hover:bg-muted py-2.5 text-xs font-bold text-foreground transition shadow-sm"
          >
            <span>Manage Wallet Settlements</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No payment account configured. Withdrawals require bank details setup.
          </p>

          <button
            onClick={() => navigate('/seller/wallet')}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition shadow-md hover:opacity-90"
          >
            <span>Go to Seller Wallet</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
