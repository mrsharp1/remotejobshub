import React from 'react'
import { CreditCard, Banknote, Lock, Key, CheckCircle2, Unlock } from 'lucide-react'

export const EscrowTimeline: React.FC = () => {
  const steps = [
    {
      icon: <CreditCard className="h-5 w-5 text-indigo-400" />,
      title: 'Buyer Pays',
      active: true,
    },
    {
      icon: <Banknote className="h-5 w-5 text-emerald-400" />,
      title: 'RJH Receives Funds',
      active: false,
    },
    {
      icon: <Lock className="h-5 w-5 text-slate-400" />,
      title: 'Escrow Locked',
      active: false,
    },
    {
      icon: <Key className="h-5 w-5 text-amber-400" />,
      title: 'Credentials Delivered',
      active: false,
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-blue-400" />,
      title: 'Buyer Verifies',
      active: false,
    },
    {
      icon: <Unlock className="h-5 w-5 text-purple-400" />,
      title: 'Seller Paid',
      active: false,
    },
  ]

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="font-heading text-lg font-bold text-white">Transaction Timeline</h3>
      
      <div className="relative">
        <div className="absolute left-[23px] top-8 h-[calc(100%-4rem)] w-0.5 bg-slate-800 sm:left-1/2 sm:top-[23px] sm:h-0.5 sm:w-[calc(100%-4rem)] sm:-translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-row items-center gap-4 sm:flex-col sm:items-center sm:text-center">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-slate-950 ${step.active ? 'bg-slate-800 ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950' : 'bg-slate-900 opacity-50'} shadow-xl transition-all`}>
                {step.icon}
              </div>
              <div>
                <h4 className={`text-xs font-bold ${step.active ? 'text-white' : 'text-slate-500'}`}>{step.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
