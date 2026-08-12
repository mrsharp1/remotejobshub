import React from 'react'
import { Wallet, ArrowDownLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { walletService } from '@/services/marketplace/wallet.service'
import { useNavigate } from 'react-router-dom'

export const WalletSummary: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: wallet } = useQuery({
    queryKey: ['seller-wallet', user?.id],
    queryFn: () => (user?.id ? walletService.getWallet(user.id) : null),
    enabled: !!user?.id,
  })

  const { data: txs = [] } = useQuery({
    queryKey: ['wallet-transactions', wallet?.id],
    queryFn: () => (wallet?.id ? walletService.getTransactions(wallet.id) : []),
    enabled: !!wallet?.id,
  })

  const handleWithdraw = () => {
    navigate('/seller/wallet')
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Balances Block */}
      <div className="md:col-span-1 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl text-foreground">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <Wallet className="h-4.5 w-4.5" />
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider">Merchant Wallet</h4>
        </div>

        <div className="space-y-3.5">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold block uppercase">Available Balance</span>
            <span className="font-heading text-2xl font-black text-foreground font-mono mt-0.5 block">
              ₦{(wallet?.available_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid gap-2 grid-cols-2 text-[10px] border-t border-border pt-3">
            <div>
              <span className="text-muted-foreground block font-semibold">Pending Clear</span>
              <span className="font-bold text-foreground font-mono mt-0.5 block">
                ₦{(wallet?.pending_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block font-semibold">Escrow Held</span>
              <span className="font-bold text-foreground font-mono mt-0.5 block">
                ₦{(wallet?.escrow_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleWithdraw}
          className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-650 dark:hover:bg-purple-700 py-3 text-xs font-bold text-white transition shadow-lg"
        >
          Withdraw Earnings
        </button>
      </div>

      {/* Transactions list */}
      <div className="md:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xl text-foreground">
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">Transaction History</h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">Recent settlement payouts logs</p>
        </div>

        <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
          {txs.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No recent transaction logs found.
            </div>
          ) : (
            txs.map((tx) => (
              <div key={tx.id} className="rounded-xl bg-muted/40 p-3.5 flex items-center justify-between border border-border text-xs">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-450">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground capitalize">{tx.type.replace('_', ' ')} ({tx.id.slice(0, 8).toUpperCase()})</span>
                    <span className="block text-[9.5px] text-muted-foreground mt-0.5 font-mono">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-foreground font-mono">
                    {tx.type === 'withdrawal' ? '-' : '+'}₦{Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`flex items-center justify-end gap-1 text-[9px] font-semibold mt-0.5 ${
                    tx.status === 'success' ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-500'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
