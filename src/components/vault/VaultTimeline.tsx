import React from 'react'
import { CreditCard, UploadCloud, Key, ShieldCheck, CheckCircle2 } from 'lucide-react'
import type { Order } from '@/types'
import { getPremiumOrderStatus } from '@/utils/OrderStatusMapper'

interface VaultTimelineProps {
  order: Order
}

export const VaultTimeline: React.FC<VaultTimelineProps> = ({ order }) => {
  const steps = [
    { id: 'payment_pending', label: 'Buyer Paid', icon: CreditCard },
    { id: 'seller_processing', label: 'Seller Uploaded', icon: UploadCloud },
    { id: 'buyer_review', label: 'Credentials Delivered', icon: Key },
    { id: 'verifying', label: 'Verification Active', icon: ShieldCheck },
    { id: 'completed', label: 'Escrow Release', icon: CheckCircle2 },
  ]

  let currentStepIdx = 0
  const premiumStatus = getPremiumOrderStatus(order.status)
  switch (premiumStatus) {
    case 'PAYMENT_RECEIVED': currentStepIdx = 0; break;
    case 'ESCROW_LOCKED': currentStepIdx = 0; break;
    case 'SELLER_DELIVERING': currentStepIdx = 1; break;
    case 'BUYER_VERIFYING': currentStepIdx = 3; break;
    case 'COMPLETED': currentStepIdx = 4; break;
    default: currentStepIdx = 0;
  }

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-8 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Escrow Handover Timeline
      </h3>
      
      <div className="relative">
        {/* Track Line for Desktop */}
        <div className="absolute left-[15px] top-4 hidden h-[calc(100%-2rem)] w-[2px] bg-slate-800 sm:block" />
        <div 
          className="absolute left-[15px] top-4 hidden w-[2px] bg-indigo-500 transition-all duration-1000 sm:block"
          style={{ height: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
        />

        <div className="flex flex-col gap-8">
          {steps.map((step, idx) => {
            const isActive = idx <= currentStepIdx
            const isCurrent = idx === currentStepIdx

            return (
              <div key={step.id} className="relative flex items-center gap-4">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isActive 
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-600'
                } ${isCurrent ? 'ring-4 ring-indigo-500/20' : ''}`}>
                  <step.icon className="h-4 w-4" />
                </div>
                
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        Current Stage
                      </span>
                    )}
                  </div>
                  {isActive && !isCurrent && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {!isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Pending
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
