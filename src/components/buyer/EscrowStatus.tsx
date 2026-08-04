import React from 'react'
import { CreditCard, Lock, Package, Key, ShieldCheck, CheckCircle2 } from 'lucide-react'
import type { Order } from '@/types'

interface EscrowStatusProps {
  order: Order
}

export const EscrowStatus: React.FC<EscrowStatusProps> = ({ order }) => {
  const steps = [
    { id: 'payment_pending', label: 'Buyer Paid', icon: CreditCard },
    { id: 'payment_received', label: 'Funds Locked', icon: Lock },
    { id: 'seller_processing', label: 'Seller Preparing', icon: Package },
    { id: 'buyer_review', label: 'Credentials Ready', icon: Key },
    { id: 'verifying', label: 'Verification', icon: ShieldCheck }, // Logical step combined with buyer_review mostly
    { id: 'completed', label: 'Escrow Released', icon: CheckCircle2 },
  ]

  let currentStepIdx = 0
  switch (order.status) {
    case 'payment_pending': currentStepIdx = 0; break;
    case 'payment_received': currentStepIdx = 1; break;
    case 'seller_processing': currentStepIdx = 2; break;
    case 'buyer_review': currentStepIdx = 4; break; // Covers Credentials Ready & Verification
    case 'completed': currentStepIdx = 5; break;
    default: currentStepIdx = 0;
  }

  return (
    <div className="space-y-6 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
        Escrow Pipeline
      </h3>
      
      <div className="relative">
        {/* Track Line */}
        <div className="absolute left-[15px] top-4 h-[calc(100%-2rem)] w-[2px] bg-slate-800" />
        <div 
          className="absolute left-[15px] top-4 w-[2px] bg-indigo-500 transition-all duration-1000"
          style={{ height: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative z-10 flex flex-col gap-6">
          {steps.map((step, idx) => {
            const isActive = idx <= currentStepIdx
            const isCurrent = idx === currentStepIdx

            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  isActive 
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-600'
                } ${isCurrent ? 'ring-4 ring-indigo-500/20' : ''}`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <div>
                  <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-indigo-400">
                      Current Status
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
