import React from 'react'

import { CreditCard, Lock, Key, CheckCircle2, Unlock } from 'lucide-react'

export const PurchaseTimeline: React.FC = () => {
  const steps = [
    {
      icon: <CreditCard className="h-5 w-5 text-indigo-400" />,
      title: 'Buyer Pays',
      desc: 'Checkout securely via Paystack.',
    },
    {
      icon: <Lock className="h-5 w-5 text-emerald-400" />,
      title: 'Escrow Locks',
      desc: 'Funds are held in our secure smart vault.',
    },
    {
      icon: <Key className="h-5 w-5 text-amber-400" />,
      title: 'Handoff',
      desc: 'Seller delivers credentials and access.',
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-blue-400" />,
      title: 'Verification',
      desc: 'Buyer logs in and confirms ownership.',
    },
    {
      icon: <Unlock className="h-5 w-5 text-purple-400" />,
      title: 'Release',
      desc: 'Escrow releases funds to the seller.',
    },
  ]

  return (
    <div className="space-y-8 rounded-[24px] border border-white/5 bg-slate-900/30 p-6 backdrop-blur-xl sm:p-8">
      <div className="text-center sm:text-left">
        <h2 className="font-heading text-xl font-bold text-white">Secure Purchase Workflow</h2>
        <p className="text-sm font-medium text-slate-400">How our guaranteed escrow process works</p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-10 h-[calc(100%-2.5rem)] w-0.5 bg-gradient-to-b from-indigo-500/50 via-emerald-500/50 to-purple-500/50 sm:left-[50%] sm:h-0.5 sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bg-gradient-to-r" />

        <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-row items-start gap-4 sm:flex-col sm:items-center sm:text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-slate-950 bg-slate-800 shadow-xl">
                {step.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="mt-1 text-xs text-slate-400 sm:max-w-[120px]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
