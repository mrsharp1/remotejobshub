import React from 'react'
import { Eye, DollarSign, User, Calendar } from 'lucide-react'
import { Payment } from '@/types'

interface EscrowQueueProps {
  payments: Payment[]
  onInspect: (payment: Payment) => void
}

export const EscrowQueue: React.FC<EscrowQueueProps> = ({ payments, onInspect }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'released':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'refunded':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'failed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      case 'success':
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'released':
        return 'Released'
      case 'refunded':
        return 'Refunded'
      case 'failed':
        return 'Failed'
      case 'success':
      default:
        return 'Hold In Escrow'
    }
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 py-16 text-center">
        <DollarSign className="mx-auto mb-3 h-10 w-10 text-slate-500" />
        <h3 className="text-sm font-bold text-white">No active escrow transactions</h3>
        <p className="mt-1 text-xs text-slate-400">There are no records matching your query filter.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 shadow-xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4">Reference Reference</th>
              <th className="p-4">Buyer Info</th>
              <th className="p-4">Seller Info</th>
              <th className="p-4">Listing details</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Commission</th>
              <th className="p-4">Escrow Status</th>
              <th className="p-4">Paid Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((p) => {
              const amountVal = Number(p.amount)
              const commissionVal = amountVal * 0.1
              const listingTitle = p.order?.listing?.title || 'Professional Service contract'

              return (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-white/5"
                >
                  {/* Transaction ID */}
                  <td className="p-4">
                    <span className="font-mono font-bold text-indigo-400">
                      {p.paystack_reference}
                    </span>
                  </td>

                  {/* Buyer */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-slate-300">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="font-semibold text-white truncate max-w-[120px]">
                        {p.buyer?.full_name || 'Buyer'}
                      </span>
                    </div>
                  </td>

                  {/* Seller */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-slate-300">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="font-semibold text-white truncate max-w-[120px]">
                        {p.seller?.full_name || 'Seller'}
                      </span>
                    </div>
                  </td>

                  {/* Listing */}
                  <td className="p-4">
                    <span className="block truncate max-w-[150px] font-medium text-slate-300">
                      {listingTitle}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="p-4">
                    <span className="font-mono font-bold text-white">
                      ₦{amountVal.toLocaleString()}
                    </span>
                  </td>

                  {/* Commission */}
                  <td className="p-4">
                    <span className="font-mono text-indigo-300 font-semibold">
                      ₦{commissionVal.toLocaleString()}
                    </span>
                  </td>

                  {/* Escrow Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(p.payment_status)}`}>
                      {getStatusLabel(p.payment_status)}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>

                  {/* Inspect Action */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onInspect(p)}
                      className="inline-flex items-center gap-1 rounded-xl bg-indigo-600/10 border border-indigo-500/20 px-3 py-1.5 text-[10px] font-bold text-indigo-400 transition-all hover:bg-indigo-600 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
