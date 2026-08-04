import React from 'react'
import { ShieldCheck, Lock, CheckCircle2, Search, FileText } from 'lucide-react'

export const SecurityPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-bold text-white">Security & Trust</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 p-3">
          <Lock className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300">AES-256</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 p-3">
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-300">PCI DSS</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 p-3">
          <CheckCircle2 className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-300">KYC Verified</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 p-3">
          <Search className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-300">Fraud Detect</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 p-3">
          <FileText className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-300">Escrow Protected</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 p-3">
          <Search className="h-4 w-4 text-rose-400" />
          <span className="text-xs font-bold text-slate-300">AI Risk Check</span>
        </div>
      </div>
      <p className="text-center text-[10px] uppercase tracking-wider text-slate-500">
        No payment information should ever feel unsafe.
      </p>
    </div>
  )
}
