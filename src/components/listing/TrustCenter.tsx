import React from 'react'

import { ShieldCheck, Lock, Search, Key, Scale, CheckCircle2 } from 'lucide-react'

export const TrustCenter: React.FC = () => {
  const trustFeatures = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
      title: 'KYC Verified',
      desc: 'Seller identity verified via Jumio government ID matching.',
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-400" />,
      title: 'Escrow Protected',
      desc: 'Funds locked in smart escrow until account handoff is verified.',
    },
    {
      icon: <Search className="h-6 w-6 text-blue-400" />,
      title: 'AI Risk Assessed',
      desc: 'Listing media analyzed for authenticity and zero digital manipulation.',
    },
    {
      icon: <Key className="h-6 w-6 text-amber-400" />,
      title: 'AES-256 Vault',
      desc: 'Credentials are encrypted and safely delivered only post-payment.',
    },
    {
      icon: <Scale className="h-6 w-6 text-purple-400" />,
      title: 'Dispute Mediation',
      desc: '24/7 dedicated support team to handle and resolve handoff issues.',
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-rose-400" />,
      title: 'Money Back Guarantee',
      desc: '100% refund if the account cannot be secured or delivered as promised.',
    },
  ]

  return (
    <div className="space-y-6 rounded-[24px] border border-emerald-500/20 bg-gradient-to-br from-emerald-900/20 to-slate-900/50 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Trust & Security Center</h2>
          <p className="text-xs font-medium text-slate-400">Your investment is 100% protected.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trustFeatures.map((feature, idx) => (
          <div key={idx} className="flex gap-4 rounded-2xl border border-white/5 bg-slate-950/50 p-5 hover:bg-slate-900">
            <div className="shrink-0">{feature.icon}</div>
            <div>
              <h4 className="text-sm font-bold text-white">{feature.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
