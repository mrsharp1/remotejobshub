import React from 'react'
import { ShieldCheck, Clock, Key } from 'lucide-react'
import type { Order } from '@/types'
import { getPremiumOrderStatus } from '@/utils/OrderStatusMapper'

interface VaultHeroProps {
  order: Order
}

export const VaultHero: React.FC<VaultHeroProps> = ({ order }) => {
  const premiumStatus = getPremiumOrderStatus(order.status)
  const isReady = premiumStatus === 'BUYER_VERIFYING' || premiumStatus === 'COMPLETED' || premiumStatus === 'CREDENTIALS_DELIVERED'

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950 p-6 sm:p-10">
      {/* Background glowing effects */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[100px]" />
      <div className={`absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-[100px] ${isReady ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`} />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Secure Vault Delivery
          </div>
          
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-black text-white sm:text-4xl">
              {isReady ? 'Credentials Ready' : 'Waiting for Seller'}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              {isReady 
                ? 'The seller has uploaded the secure credentials. They are encrypted and ready for your inspection.'
                : 'The seller has been notified to deliver the account credentials to this secure vault.'
              }
            </p>
          </div>
        </div>

        {/* Status Widget */}
        <div className="flex shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md sm:w-64">
          <div className="text-center">
            {isReady ? (
              <>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/10">
                  <Key className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white">Vault Unlocked</h3>
                <p className="text-[10px] uppercase tracking-wider text-emerald-500">Encrypted Delivery</p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-4 ring-amber-500/10">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-sm font-bold text-white">Estimated: &lt; 2 Hrs</h3>
                <p className="text-[10px] uppercase tracking-wider text-amber-500">Seller Notified</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
