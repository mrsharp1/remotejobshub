import React from 'react'
import { Lock, Loader2 } from 'lucide-react'

interface StickyCheckoutBarProps {
  total: number
  isDisabled: boolean
  isSubmitting: boolean
  onPayClick: () => void
}

export const StickyCheckoutBar: React.FC<StickyCheckoutBarProps> = ({
  total,
  isDisabled,
  isSubmitting,
  onPayClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/90 p-4 pb-safe backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Payment</span>
          <span className="font-heading text-xl font-black text-indigo-400">₦{total.toLocaleString()}</span>
        </div>
        <button
          onClick={onPayClick}
          disabled={isDisabled || isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-center text-sm font-bold text-white shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] transition-all hover:bg-indigo-400 active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Pay Securely
            </>
          )}
        </button>
      </div>
    </div>
  )
}
