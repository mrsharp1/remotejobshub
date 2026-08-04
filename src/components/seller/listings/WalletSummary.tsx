import React from 'react'
import { Wallet, ArrowDownLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export const WalletSummary: React.FC = () => {
  const handleWithdraw = () => {
    toast.success('Withdrawal request of ₦12,450,000.00 initiated to your bank account code.')
  }

  const txs = [
    { date: '2026-07-09', id: 'TX-4920', type: 'Payout', amount: 1420.00, status: 'completed' },
    { date: '2026-07-05', id: 'TX-4890', type: 'Payout', amount: 980.00, status: 'completed' },
    { date: '2026-07-01', id: 'TX-4810', type: 'Payout', amount: 3200.00, status: 'completed' },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Balances Block */}
      <div className="md:col-span-1 rounded-2xl border border-white/5 bg-slate-900/60 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-purple-400">
          <Wallet className="h-4.5 w-4.5" />
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider">Merchant Wallet</h4>
        </div>

        <div className="space-y-3.5">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Available Balance</span>
            <span className="font-heading text-2xl font-black text-white font-mono mt-0.5 block">₦12,450,000.00</span>
          </div>

          <div className="grid gap-2 grid-cols-2 text-[10px] border-t border-white/5 pt-3">
            <div>
              <span className="text-slate-450 block font-semibold">Pending Clear</span>
              <span className="font-bold text-white font-mono mt-0.5 block">₦1,200,000.00</span>
            </div>
            <div>
              <span className="text-slate-455 block font-semibold">Escrow Held</span>
              <span className="font-bold text-white font-mono mt-0.5 block">₦4,500,000.00</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleWithdraw}
          className="w-full rounded-xl bg-purple-650 hover:bg-purple-700 py-3 text-xs font-bold text-white transition shadow-lg"
        >
          Withdraw Earnings
        </button>
      </div>

      {/* Transactions list */}
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-slate-900/60 p-5 space-y-4 shadow-xl">
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">Transaction History</h4>
          <p className="text-[10px] text-slate-450 mt-0.5">Recent settlement payouts logs</p>
        </div>

        <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
          {txs.map((tx) => (
            <div key={tx.id} className="rounded-xl bg-slate-950/40 p-3.5 flex items-center justify-between border border-white/5 text-xs">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-450">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-white">{tx.type} ({tx.id})</span>
                  <span className="block text-[9.5px] text-slate-400 mt-0.5 font-mono">{tx.date}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-white font-mono">+₦{(tx.amount * 1000).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="flex items-center justify-end gap-1 text-[9px] text-emerald-500 font-semibold mt-0.5">
                  <CheckCircle className="h-3 w-3" /> cleared
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
