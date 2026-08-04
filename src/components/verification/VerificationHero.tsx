import React, { useState, useEffect } from 'react'
import { ShieldCheck, Clock, ShieldAlert } from 'lucide-react'
import type { Order } from '@/types'

interface VerificationHeroProps {
  order: Order
}

export const VerificationHero: React.FC<VerificationHeroProps> = ({ order }) => {
  const [daysLeft, setDaysLeft] = useState(3)

  useEffect(() => {
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
    }, 1000 * 60 * 60)

    return () => clearInterval(interval)
  }, [order])

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950 p-6 sm:p-10">
      {/* Background glowing effects */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px]" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Quality Assurance Center
          </div>
          
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-black text-white sm:text-4xl">
              Verification Session
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Carefully verify all aspects of your purchased account. The seller is waiting, and your funds are safely locked in escrow until you approve the release.
            </p>
          </div>
        </div>

        {/* Status Widget */}
        <div className="flex shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md sm:w-64">
          <div className="text-center">
            {daysLeft > 0 ? (
              <>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 ring-4 ring-indigo-500/10">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-black text-white">{daysLeft} Days</h3>
                <p className="text-[10px] uppercase tracking-wider text-indigo-500">Remaining to Verify</p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 ring-4 ring-rose-500/10">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-black text-white">Expired</h3>
                <p className="text-[10px] uppercase tracking-wider text-rose-500">Auto-Release Pending</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
