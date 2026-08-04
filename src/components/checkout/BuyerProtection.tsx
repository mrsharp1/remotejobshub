import React from 'react'
import { ShieldCheck, Lock, Search, Scale, UserCheck, Key } from 'lucide-react'

export const BuyerProtection: React.FC = () => {
  const protectionFeatures = [
    {
      icon: <Lock className="h-5 w-5 text-indigo-400" />,
      title: 'Funds Held Securely',
      desc: 'Your payment is locked in our smart escrow vault.',
    },
    {
      icon: <UserCheck className="h-5 w-5 text-emerald-400" />,
      title: 'Verified Seller',
      desc: 'Seller identity verified via government ID.',
    },
    {
      icon: <Search className="h-5 w-5 text-blue-400" />,
      title: 'AI Risk Screening',
      desc: 'Account assets scanned for authenticity.',
    },
    {
      icon: <Key className="h-5 w-5 text-amber-400" />,
      title: 'Credential Encryption',
      desc: 'Secure AES-256 vault delivery.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-purple-400" />,
      title: 'Verification Period',
      desc: 'You have up to 3 days to verify access.',
    },
    {
      icon: <Scale className="h-5 w-5 text-rose-400" />,
      title: 'Money Back Guarantee',
      desc: 'Full refund via our dispute process.',
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-bold text-white">Buyer Protection</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {protectionFeatures.map((feature, idx) => (
          <div key={idx} className="flex gap-3 rounded-xl border border-white/5 bg-slate-900/30 p-4">
            <div className="shrink-0 rounded-lg bg-slate-800/50 p-2">
              {feature.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{feature.title}</h4>
              <p className="mt-0.5 text-xs text-slate-400">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
