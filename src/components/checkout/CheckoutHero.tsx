import React from 'react'
import { ShieldCheck, CheckCircle2, Lock, Scale } from 'lucide-react'

export const CheckoutHero: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-black text-white sm:text-4xl">
          Secure Escrow Checkout
        </h1>
        <p className="text-sm font-medium text-slate-400 sm:text-base">
          Your payment is protected until you successfully verify the purchased account.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-4 w-4" /> Escrow Protected
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
          <CheckCircle2 className="h-4 w-4" /> KYC Verified Seller
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-800/50 px-3 py-1 text-xs font-bold text-slate-300">
          <Lock className="h-4 w-4" /> Encrypted Credential Vault
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
          <Scale className="h-4 w-4" /> Dispute Protection
        </span>
      </div>
    </div>
  )
}
