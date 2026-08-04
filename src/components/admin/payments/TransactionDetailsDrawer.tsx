import { X, Clock } from 'lucide-react'
import { Payment } from '@/types'
import { formatCurrency } from '@/utils/currency'

interface TransactionDetailsDrawerProps {
  payment: Payment | null
  onClose: () => void
  onRelease: (id: string) => void
  onRefund: (id: string) => void
}

export const TransactionDetailsDrawer: React.FC<TransactionDetailsDrawerProps> = ({
  payment,
  onClose,
  onRelease,
  onRefund,
}) => {
  if (!payment) return null

  const amountVal = Number(payment.amount)
  const commissionVal = amountVal * 0.1
  const sellerNet = amountVal - commissionVal

  // Simulated Risk rating
  const riskScore = amountVal > 1500 ? 74 : 24
  const riskLevel = riskScore > 50 ? 'HIGH' : 'LOW'
  const riskColor = riskScore > 50 ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'

  // Timeline state matching based on database state
  const isReleased = payment.payment_status === 'released'
  const isRefunded = payment.payment_status === 'refunded'
  const isPending = payment.payment_status === 'success'

  const timelineSteps = [
    { label: 'Payment Received', date: payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'Pending', completed: true },
    { label: 'Funds Locked', date: 'Escrow Secured', completed: true },
    { label: 'Seller Delivered', date: isReleased ? 'Completed' : 'Simulated Verification', completed: isReleased },
    { label: 'Buyer Reviewing', date: isReleased ? 'Approved' : 'Inspecting contract', completed: isReleased },
    { label: 'Released Payout', date: isReleased ? 'Transferred' : isRefunded ? 'Refunded' : 'Awaiting admin release', completed: isReleased || isRefunded },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-white/10 bg-slate-950 p-6 shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-start justify-between border-b border-white/5 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Escrow Audit Console
            </span>
            <h3 className="mt-1 font-mono text-lg font-bold text-white truncate max-w-[320px]">
              Ref #{payment.paystack_reference}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/5 bg-slate-900 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <span className="text-[9px] font-bold uppercase text-slate-400">
                Transaction Value
              </span>
              <div className="mt-1 font-mono text-lg font-black text-white">
                ₦{amountVal.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <span className="text-[9px] font-bold uppercase text-slate-400">
                Escrow State
              </span>
              <div className="mt-1 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                {payment.payment_status === 'success' ? 'Hold in Escrow' : payment.payment_status}
              </div>
            </div>
          </div>

          {/* Escrow Timeline */}
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              Escrow Timeline Milestones
            </h4>
            <div className="relative pl-6 space-y-5 border-l border-white/5">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className={`absolute -left-[30px] top-1 flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold transition-all ${
                    step.completed
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-950 border-white/10 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                      {step.label}
                    </h5>
                    <span className="text-[10px] text-slate-400">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Participant profiles details */}
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Deal Participants
            </h4>
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-950/40 p-3 border border-white/5">
                <span className="text-xs text-slate-400">Buyer</span>
                <span className="text-xs font-bold text-white">{payment.buyer?.full_name || 'Buyer Account'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/40 p-3 border border-white/5">
                <span className="text-xs text-slate-400">Seller</span>
                <span className="text-xs font-bold text-white">{payment.seller?.full_name || 'Seller Account'}</span>
              </div>
            </div>
          </div>

          {/* Commission breakdown breakdown card */}
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Escrow Payout Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Contract Value:</span>
                <span className="font-mono font-bold text-white">{formatCurrency(amountVal)}</span>
              </div>
              <div className="flex justify-between text-indigo-400">
                <span>Platform Commission (10%):</span>
                <span className="font-mono font-bold">-{formatCurrency(commissionVal)}</span>
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white">Seller Receives:</span>
                <span className="font-mono text-emerald-400">{formatCurrency(sellerNet)}</span>
              </div>
            </div>
          </div>

          {/* Risk score */}
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Secured Intelligence Risk Audit
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Escrow Security Score:</span>
              <span className={`rounded-xl px-3 py-1 text-xs font-bold ${riskColor}`}>
                {riskScore}% ({riskLevel})
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Based on payment patterns, transaction amount, IP checks, and participant histories.
            </p>
          </div>
        </div>

        {/* Release / Refund Actions workspace */}
        {isPending && (
          <div className="border-t border-white/5 pt-5 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Admin Escrow Release Console
            </h4>
            <div className="flex gap-3">
              <button
                onClick={() => onRelease(payment.id)}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-emerald-900/20"
              >
                Release Payout to Seller
              </button>
              <button
                onClick={() => onRefund(payment.id)}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-rose-900/20"
              >
                Refund to Buyer Wallet
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
