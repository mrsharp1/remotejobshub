import React, { useState, useEffect } from 'react'
import { ShieldAlert, ArrowRight } from 'lucide-react'
import type { Order } from '@/types'
import { getPremiumOrderStatus } from '@/utils/OrderStatusMapper'

interface VerificationBannerProps {
  order: Order
  onVerifyClick: () => void
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ order, onVerifyClick }) => {
  const [daysLeft, setDaysLeft] = useState(3)

  useEffect(() => {
    if (getPremiumOrderStatus(order.status) !== 'BUYER_VERIFYING') return

    const updatedTime = new Date(order.updated_at || order.created_at).getTime()
    const deadline = updatedTime + (3 * 24 * 60 * 60 * 1000)

    const interval = setInterval(() => {
      const diff = deadline - Date.now()
      if (diff <= 0) {
        setDaysLeft(0)
        clearInterval(interval)
      } else {
        setDaysLeft(Math.ceil(diff / (1000 * 60 * 60 * 24)))
      }
    }, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(interval)
  }, [order])

  if (getPremiumOrderStatus(order.status) !== 'BUYER_VERIFYING') {
    return null
  }

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-indigo-600 p-6 sm:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-white">Verification Period Started</h2>
            <p className="mt-1 max-w-md text-sm text-indigo-100">
              You have <strong className="font-black text-white">{daysLeft} days remaining</strong> to verify these credentials before the escrow is automatically released to the seller.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onVerifyClick()}
          className="group flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-indigo-600 shadow-xl transition-transform hover:-translate-y-0.5 hover:shadow-indigo-900/50"
        >
          Go To Verification Workspace
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}
