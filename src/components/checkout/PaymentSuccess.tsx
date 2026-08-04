import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'

interface PaymentSuccessProps {
  orderId: string
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ orderId }) => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 text-center">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
        <CheckCircle2 className="h-16 w-16" />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-4xl font-black text-white">Payment Successful</h2>
        <p className="mx-auto max-w-md text-slate-400">
          Your funds have been securely locked in escrow. The seller has been notified to prepare your credentials for handoff.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 text-left">
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Order Number</span>
            <span className="font-mono font-bold text-white">{orderId}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</span>
            <span className="font-bold text-emerald-400">Escrow Created</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="group flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-indigo-400 hover:shadow-indigo-500/25 active:scale-95"
        >
          Go To Buyer Dashboard
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-8 py-4 text-base font-bold text-white transition-all hover:bg-slate-800"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  )
}
