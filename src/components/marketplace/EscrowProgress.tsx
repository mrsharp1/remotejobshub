import React from 'react'
import {
  Lock,
  CreditCard,
  PackageCheck,
  FileKey2,
  Mail,
  ShieldCheck,
  Check,
  Clock,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { Order } from '@/types'
import { getOrderStatusDisplayLabel } from '@/utils/OrderStatusMapper'

interface EscrowProgressProps {
  status: Order['status']
}

const steps = [
  {
    key: 'pending',
    label: getOrderStatusDisplayLabel('pending'),
    description: 'Your purchase order has been securely created in our system.',
    icon: Lock,
  },
  {
    key: 'payment_pending',
    label: getOrderStatusDisplayLabel('payment_pending'),
    description: 'Awaiting your secure payment to be deposited into escrow.',
    icon: CreditCard,
  },
  {
    key: 'payment_received',
    label: getOrderStatusDisplayLabel('payment_received'),
    description:
      'Payment confirmed and held securely. Seller has been notified.',
    icon: ShieldCheck,
  },
  {
    key: 'seller_processing',
    label: getOrderStatusDisplayLabel('seller_processing'),
    description:
      'Seller is compiling credentials, cookies, and transfer materials.',
    icon: PackageCheck,
  },
  {
    key: 'buyer_review',
    label: getOrderStatusDisplayLabel('buyer_review'),
    description:
      'Login credentials released. Please verify access and confirm delivery.',
    icon: FileKey2,
  },
  {
    key: 'completed',
    label: getOrderStatusDisplayLabel('completed'),
    description:
      'Ownership confirmed! Escrow funds released to seller. Enjoy your account.',
    icon: Mail,
  },
]

const STATUS_INDEX_MAP: Record<Order['status'], number> = {
  pending: 0,
  payment_pending: 1,
  payment_received: 2,
  seller_processing: 3,
  buyer_review: 4,
  completed: 5,
  cancelled: -1,
  disputed: -1,
}

export const EscrowProgress: React.FC<EscrowProgressProps> = ({ status }) => {
  const currentIdx = STATUS_INDEX_MAP[status] ?? -1

  if (status === 'cancelled') {
    return (
      <div className="border-destructive/20 bg-destructive/5 space-y-2 rounded-2xl border p-6 text-center">
        <XCircle className="mx-auto h-8 w-8 text-destructive" />
        <p className="font-heading text-base font-bold text-destructive">
          Order Cancelled
        </p>
        <p className="text-sm text-muted-foreground">
          This escrow order has been cancelled. No funds were released.
        </p>
      </div>
    )
  }

  if (status === 'disputed') {
    return (
      <div className="space-y-2 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
        <p className="font-heading text-base font-bold text-amber-700 dark:text-amber-400">
          Under Dispute
        </p>
        <p className="text-sm text-muted-foreground">
          Our moderation team is reviewing this order. Funds are safely held
          pending resolution.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx
        const isActive = idx === currentIdx
        const Icon = step.icon

        return (
          <div
            key={`${step.key}-${idx}`}
            className={`flex gap-4 rounded-xl border p-4 transition-all ${
              isActive
                ? 'border-primary/30 bg-primary/5 shadow-sm'
                : isCompleted
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5'
                  : 'border-border bg-slate-50 opacity-60 dark:bg-slate-800/30'
            }`}
          >
            {/* Step Indicator */}
            <div className="relative flex flex-col items-center">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isActive
                      ? 'shadow-primary/20 border-primary bg-primary text-white shadow-lg'
                      : 'border-border bg-background text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isActive ? (
                  <Clock className="h-4 w-4 animate-pulse" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mt-1 w-0.5 flex-1 ${isCompleted ? 'bg-emerald-400' : 'bg-border'}`}
                  style={{ minHeight: 16 }}
                />
              )}
            </div>

            {/* Step Content */}
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-bold ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </p>
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Step {idx + 1}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
