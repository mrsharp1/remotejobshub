import React from 'react'
import { XCircle, RefreshCw, LifeBuoy } from 'lucide-react'

interface PaymentFailureProps {
  onRetry: () => void
  error?: string
}

export const PaymentFailure: React.FC<PaymentFailureProps> = ({ onRetry, error }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 text-center">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
        <XCircle className="h-16 w-16" />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-4xl font-black text-white">Payment Failed</h2>
        <p className="mx-auto max-w-md text-slate-400">
          We couldn't process your payment at this time. No charges were made to your account.
        </p>
        {error && (
          <p className="mx-auto mt-4 max-w-md rounded-xl bg-rose-500/10 p-4 text-sm font-medium text-rose-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-indigo-400 hover:shadow-indigo-500/25 active:scale-95"
        >
          <RefreshCw className="h-5 w-5" />
          Retry Payment
        </button>
        <button
          onClick={() => window.location.href = '/support'}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-8 py-4 text-base font-bold text-white transition-all hover:bg-slate-800"
        >
          <LifeBuoy className="h-5 w-5" />
          Contact Support
        </button>
      </div>
    </div>
  )
}
