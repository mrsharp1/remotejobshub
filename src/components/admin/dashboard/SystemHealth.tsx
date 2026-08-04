import React from 'react'
import { Server } from 'lucide-react'

export const SystemHealth: React.FC = React.memo(() => {
  const nodes = [
    { name: 'API Server', status: 'Operational', latency: '12ms', glow: 'bg-emerald-400 shadow-emerald-400/30' },
    { name: 'Database Pool', status: 'Healthy', latency: '99.99%', glow: 'bg-emerald-400 shadow-emerald-400/30' },
    { name: 'Storage Vault', status: 'Active', latency: '94.2% free', glow: 'bg-emerald-400 shadow-emerald-400/30' },
    { name: 'SMTP Mailer', status: 'Operational', latency: '0 backlog', glow: 'bg-emerald-400 shadow-emerald-400/30' },
    { name: 'Escrow Service', status: 'Operational', latency: 'multi-sig lock', glow: 'bg-emerald-400 shadow-emerald-400/30' },
    { name: 'Telemetry Engine', status: 'Idle', latency: '0 queries delay', glow: 'bg-yellow-400 shadow-yellow-400/30' },
  ]

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-card space-y-6">
      <div className="space-y-1">
        <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="h-4.5 w-4.5 text-destructive animate-pulse" /> Infrastructure Monitoring Desk
        </h3>
        <p className="text-xs text-slate-505">Real-time connection nodes connectivity status and latency metrics.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-[10px]">
        {nodes.map((node, idx) => (
          <div key={idx} className="rounded-2xl border p-4 bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800/80 flex flex-col justify-between min-h-[90px] hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{node.name}</span>
              <span className={`h-2.5 w-2.5 rounded-full ${node.glow} shadow-[0_0_12px_rgba(52,211,153,0.3)] animate-pulse shrink-0`} />
            </div>
            <div className="text-[9px] text-slate-405 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-2">
              <span>{node.status}</span>
              <span className="font-mono text-slate-550 font-black">{node.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
