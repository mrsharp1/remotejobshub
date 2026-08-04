import React from 'react'
import { Server, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import type { Order } from '@/types'
import { formatCurrency } from '@/utils/currency'

interface SettlementEngineProps {
  order: Order
  isProcessing: boolean
  onExecute: () => void
}

export const SettlementEngine: React.FC<SettlementEngineProps> = ({ order, isProcessing, onExecute }) => {
  const sellerPayout = order.amount * 0.95

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 ring-4 ring-indigo-500/10 mb-4">
          <Server className="h-8 w-8" />
        </div>
        <h3 className="font-heading text-2xl font-black text-white">
          Release Execution
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Buyer has confirmed the purchase. Funds are ready to be released to the seller's wallet.
        </p>
      </div>

      <div className="relative my-8 flex items-center justify-between rounded-2xl bg-slate-950 p-6">
        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Escrow Vault</span>
          <span className="mt-1 block font-mono text-xl font-bold text-white">{formatCurrency(sellerPayout)}</span>
        </div>
        
        <div className="flex-1 px-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-slate-800">
            {isProcessing && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[shimmer_1.5s_infinite]" />
            )}
          </div>
          <ArrowRight className={`mx-auto mt-2 h-4 w-4 ${isProcessing ? 'text-indigo-400' : 'text-slate-600'}`} />
        </div>

        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500">Seller Wallet</span>
          <span className="mt-1 block font-mono text-xl font-bold text-emerald-400">
            {isProcessing ? 'Incoming...' : 'Ready'}
          </span>
        </div>
      </div>

      <button
        onClick={onExecute}
        disabled={isProcessing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Processing Settlement...
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" /> Execute Release
          </>
        )}
      </button>

      <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-slate-500">
        <span>Ref: STL-{order.id.slice(0, 6).toUpperCase()}</span>
        <span>Platform Intermediary</span>
      </div>
    </div>
  )
}
