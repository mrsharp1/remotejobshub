import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ShieldAlert, Star, Percent, Wallet, DollarSign, ShoppingBag } from 'lucide-react'
import { Profile, Wallet as WalletType } from '@/types'

interface SubscriptionCardProps {
  profile: Profile | null
  wallet: WalletType | null | undefined
  completedCount: number
  totalRevenue: number
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  profile,
  wallet,
  completedCount,
  totalRevenue,
}) => {
  const isVerified = profile?.seller_verified || false
  const rating = completedCount > 0 ? '4.9' : '5.0 (New)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm text-foreground"
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Performance Summary
        </h3>
        {isVerified ? (
          <span className="bg-emerald-500/10 border border-emerald-500/20 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Verified Pro
          </span>
        ) : (
          <span className="bg-amber-500/10 border border-amber-500/20 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-3 w-3" />
            Awaiting verification
          </span>
        )}
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Rating & Commission */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-muted/30 rounded-lg p-2.5 border border-border">
            <span className="text-[9px] text-muted-foreground font-bold block uppercase">Seller Rating</span>
            <span className="font-heading text-sm font-black text-foreground mt-0.5 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              {rating}
            </span>
          </div>

          <div className="bg-muted/30 rounded-lg p-2.5 border border-border">
            <span className="text-[9px] text-muted-foreground font-bold block uppercase">Commission Fee</span>
            <span className="font-heading text-sm font-black text-foreground mt-0.5 flex items-center gap-1">
              <Percent className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              5.0%
            </span>
          </div>
        </div>

        {/* Wallet Balances */}
        <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              Wallet Balance
            </span>
            <span className="font-bold text-foreground font-mono">
              ₦{(wallet?.available_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] border-t border-border/60 pt-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <Wallet className="h-3 w-3 text-purple-500" />
              Escrow Balance
            </span>
            <span className="font-bold text-foreground font-mono">
              ₦{(wallet?.escrow_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Sales Stats */}
        <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              Lifetime Revenue
            </span>
            <span className="font-bold text-foreground font-mono">
              ₦{totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] border-t border-border/60 pt-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <ShoppingBag className="h-3 w-3 text-blue-500" />
              Completed Orders
            </span>
            <span className="font-bold text-foreground font-mono">
              {completedCount}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
