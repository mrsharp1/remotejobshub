import React from 'react'
import { Check, Clock, Loader2 } from 'lucide-react'

export const EscrowTimeline: React.FC = () => {
  const steps = [
    { label: 'Buyer Paid', status: 'completed' },
    { label: 'Escrow Locked', status: 'completed' },
    { label: 'Credentials Delivered', status: 'completed' },
    { label: 'Buyer Verified', status: 'completed' },
    { label: 'Settlement Processing', status: 'current' },
    { label: 'Funds Released', status: 'pending' },
  ]

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Transaction Timeline
      </h3>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:border-l-2 before:border-white/5 md:before:mx-auto md:before:translate-x-0">
        {steps.map((step) => (
          <div key={step.label} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Icon */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-slate-950 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
              step.status === 'completed'
                ? 'bg-emerald-500 text-white'
                : step.status === 'current'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-500'
            }`}>
              {step.status === 'completed' ? (
                <Check className="h-4 w-4" />
              ) : step.status === 'current' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>

            {/* Label */}
            <div className={`w-[calc(100%-3rem)] rounded-xl border p-4 md:w-[calc(50%-2rem)] ${
              step.status === 'completed'
                ? 'border-emerald-500/20 bg-emerald-500/5'
                : step.status === 'current'
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-white/5 bg-slate-900/50 opacity-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  step.status === 'completed'
                    ? 'text-emerald-400'
                    : step.status === 'current'
                      ? 'text-indigo-400'
                      : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
                {step.status === 'current' && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
