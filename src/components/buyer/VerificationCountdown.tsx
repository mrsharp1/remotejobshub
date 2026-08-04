import React, { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import type { Order } from '@/types'

interface VerificationCountdownProps {
  order: Order
}

export const VerificationCountdown: React.FC<VerificationCountdownProps> = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

  useEffect(() => {
    // Only active during buyer_review
    if (order.status !== 'buyer_review') {
      setTimeLeft(null)
      return
    }

    // Assuming a 3-day verification window from updated_at
    const updatedTime = new Date(order.updated_at || order.created_at).getTime()
    const deadline = updatedTime + (3 * 24 * 60 * 60 * 1000)

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = deadline - now

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
        clearInterval(interval)
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [order])

  if (order.status !== 'buyer_review' || !timeLeft) {
    return null
  }

  return (
    <div className="space-y-4 rounded-2xl bg-indigo-500 p-6 text-white shadow-xl shadow-indigo-500/20">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-indigo-200" />
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-indigo-100">
          Verification Window Active
        </h3>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-black/20 p-3">
          <span className="font-mono text-3xl font-black">{String(timeLeft.d).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase text-indigo-200">Days</span>
        </div>
        <div className="text-2xl font-black text-indigo-300">:</div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-black/20 p-3">
          <span className="font-mono text-3xl font-black">{String(timeLeft.h).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase text-indigo-200">Hours</span>
        </div>
        <div className="text-2xl font-black text-indigo-300">:</div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-black/20 p-3">
          <span className="font-mono text-3xl font-black">{String(timeLeft.m).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase text-indigo-200">Mins</span>
        </div>
        <div className="text-2xl font-black text-indigo-300">:</div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-black/20 p-3">
          <span className="font-mono text-3xl font-black">{String(timeLeft.s).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase text-indigo-200">Secs</span>
        </div>
      </div>

      <p className="text-center text-[10px] font-medium leading-relaxed text-indigo-200">
        If no issue is reported when this timer expires, escrow will automatically release funds to the seller.
      </p>
    </div>
  )
}
