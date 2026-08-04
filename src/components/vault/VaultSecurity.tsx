import React from 'react'
import { ShieldCheck, Lock, EyeOff, Shield } from 'lucide-react'

export const VaultSecurity: React.FC = () => {
  const badges = [
    { icon: Lock, title: 'AES-256 Encryption', desc: 'Bank-level credential security' },
    { icon: ShieldCheck, title: 'Escrow Protected', desc: 'Funds locked during verification' },
    { icon: EyeOff, title: 'No Admin Visibility', desc: 'Only you can view the payload' },
    { icon: Shield, title: 'Delivered Only Once', desc: 'Prevents duplicate access attempts' },
  ]

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Security Guarantees
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {badges.map((badge, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-900/50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <badge.icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">{badge.title}</h4>
              <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
