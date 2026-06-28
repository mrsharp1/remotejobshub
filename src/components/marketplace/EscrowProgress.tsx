import React from 'react'
import { Check, Clock } from 'lucide-react'
import { Order } from '@/types'

interface EscrowProgressProps {
  status: Order['status']
}

export const EscrowProgress: React.FC<EscrowProgressProps> = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Order Created' },
    { key: 'payment_pending', label: 'Payment Pending' },
    { key: 'payment_received', label: 'Payment Received' },
    { key: 'seller_processing', label: 'Seller Processing' },
    { key: 'buyer_review', label: 'Buyer Review' },
    { key: 'completed', label: 'Completed' },
  ]

  // Find index of current step
  const getStepIndex = (s: string) => {
    if (s === 'cancelled' || s === 'disputed') return -1
    return steps.findIndex((step) => step.key === s)
  }

  const currentIdx = getStepIndex(status)

  return (
    <div className="w-full space-y-4">
      {/* Cancelled / Disputed Exception Views */}
      {status === 'cancelled' && (
        <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-4 text-center text-sm font-semibold text-destructive">
          This escrow order has been Cancelled.
        </div>
      )}
      {status === 'disputed' && (
        <div className="rounded-lg border border-orange-500/25 bg-orange-500/10 p-4 text-center text-sm font-semibold text-orange-600">
          This escrow order is currently in Dispute. Our moderation team is
          reviewing.
        </div>
      )}

      {status !== 'cancelled' && status !== 'disputed' && (
        <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row md:gap-2">
          {/* Connecting line for desktop */}
          <div className="absolute left-4 right-4 top-1/2 -z-10 hidden h-0.5 -translate-y-1/2 bg-border md:block" />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentIdx
            const isActive = idx === currentIdx

            return (
              <div
                key={step.key}
                className="z-10 flex w-full flex-1 items-center gap-3 text-left md:flex-col md:gap-2 md:text-center"
              >
                {/* Step Circle */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow'
                      : isActive
                        ? 'ring-primary/20 border-primary bg-primary text-primary-foreground shadow ring-4'
                        : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isActive ? (
                    <Clock className="h-4 w-4 animate-pulse" />
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Label text */}
                <span
                  className={`text-xs font-semibold ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
