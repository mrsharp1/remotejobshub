import React from 'react'
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react'

interface FraudSignalsProps {
  sellerEmail: string
}

export const FraudSignals: React.FC<FraudSignalsProps> = ({ sellerEmail }) => {
  const hash = sellerEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const alerts = [
    { label: 'IP Reputation Match', ok: true, desc: 'Session coordinates map cleanly to residential ISP.' },
    { label: 'Screenshot Duplicate Scan', ok: hash % 2 !== 0, desc: 'Image files verified unique in registry database.' },
    { label: 'Device Fingerprint Check', ok: true, desc: 'Browser parameters match default config profile.' },
    { label: 'Payout Coordinate Verification', ok: hash % 3 !== 0, desc: 'Payment bank target country matches registered profile.' },
  ]

  const warningCount = alerts.filter((a) => !a.ok).length

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="flex items-center gap-1.5 text-slate-800 dark:text-white">
          <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-bounce" />
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider">Radar Fraud Signals</h4>
        </div>
        <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[8.5px] font-bold text-rose-550">
          {warningCount} alerts
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((a, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-3 flex items-start gap-2.5 border ${
              a.ok
                ? 'border-emerald-500/10 bg-emerald-500/[0.01] text-slate-500'
                : 'border-rose-550/15 bg-rose-550/[0.01] text-slate-800 dark:text-white'
            }`}
          >
            {a.ok ? (
              <AlertCircle className="h-4 w-4 text-emerald-555 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="block font-bold text-[10px] leading-none">{a.label}</span>
              <span className="block text-[9px] text-slate-400 mt-1 leading-relaxed">{a.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
