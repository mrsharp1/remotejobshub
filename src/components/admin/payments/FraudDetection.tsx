import React from 'react'
import { ShieldAlert } from 'lucide-react'

export const FraudDetection: React.FC = () => {
  const alerts = [
    {
      id: 'SEC-902',
      riskScore: 89,
      ip: '185.220.101.4',
      type: 'Suspicious IP mismatch',
      description: 'Payment made from Tor exit node mismatching buyer country clearance.',
      action: 'Flagged for review',
    },
    {
      id: 'SEC-901',
      riskScore: 78,
      ip: '93.115.95.23',
      type: 'Rapid transaction velocity',
      description: 'Multiple high-value escrow locks within 120 seconds.',
      action: 'Awaiting clearance',
    },
  ]

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <h3 className="font-heading text-base font-bold text-white">Fraud Radar Insights</h3>
          </div>
          <p className="text-[11px] text-slate-400">Security triggers and threat intelligence warnings</p>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-bold text-rose-400 uppercase">
          {alerts.length} Warnings Flagged
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="group relative overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 p-4 transition-all duration-300 hover:border-rose-500/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold text-rose-400">{a.id}</span>
                  <span className="text-[10px] text-slate-500">{a.type}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-normal">{a.description}</p>
                <div className="mt-2 text-[10px] text-slate-500">IP Gateway: {a.ip}</div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-black font-mono text-rose-400">{a.riskScore}%</span>
                <span className="text-[8px] font-bold uppercase text-rose-500/80">Risk level</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
