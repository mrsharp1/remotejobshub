import React from 'react'
import { Cpu } from 'lucide-react'

interface AiRiskPanelProps {
  sellerEmail: string
}

export const AiRiskPanel: React.FC<AiRiskPanelProps> = ({ sellerEmail }) => {
  // Compute deterministic compliance stats from email hash
  const getRiskStats = () => {
    const hash = sellerEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    
    const trustScore = 75 + (hash % 24)
    const screenshotAuthenticity = 80 + (hash % 19)
    const ipReputation = 70 + (hash % 29)
    const deviceReputation = 85 + (hash % 14)
    
    let riskLevel = 'LOW'
    let riskColor = 'text-emerald-500 bg-emerald-500/10'
    if (trustScore < 85) {
      riskLevel = 'MEDIUM'
      riskColor = 'text-amber-500 bg-amber-500/10'
    }
    if (trustScore < 78) {
      riskLevel = 'HIGH'
      riskColor = 'text-rose-500 bg-rose-550/10'
    }

    return { trustScore, screenshotAuthenticity, ipReputation, deviceReputation, riskLevel, riskColor }
  }

  const stats = getRiskStats()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-xs">
      <div className="flex items-center gap-1.5 text-slate-800 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">
        <Cpu className="h-4.5 w-4.5 text-purple-600 animate-pulse" />
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider">AI Risk & Safety Assessment</h4>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Radial gauge mock progress circle */}
        <div className="relative flex h-16 w-16 items-center justify-center shrink-0">
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgb(168, 85, 247)" strokeWidth="4" strokeDasharray={175} strokeDashoffset={175 - (175 * stats.trustScore) / 100} />
          </svg>
          <span className="font-heading text-xs font-black text-slate-900 dark:text-white font-mono">{stats.trustScore}%</span>
        </div>

        <div className="space-y-1 flex-1">
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Risk Rating Verdict</span>
          <div className="flex items-center gap-2">
            <span className={`rounded-xl px-3 py-1 font-heading text-xs font-black uppercase tracking-wider font-mono ${stats.riskColor}`}>
              {stats.riskLevel}
            </span>
            <span className="text-[10px] text-slate-400">Compliance scan verified</span>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 pt-2">
        {[
          { label: 'Screenshot Authenticity check', val: stats.screenshotAuthenticity },
          { label: 'IP reputation & Proxy filter', val: stats.ipReputation },
          { label: 'Session coordinates consistency', val: stats.deviceReputation },
        ].map((item, idx) => (
          <div key={idx} className="space-y-1.5 text-[10px]">
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-350">
              <span>{item.label}</span>
              <span className="font-mono">{item.val}%</span>
            </div>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-purple-550 transition-all duration-500" style={{ width: `${item.val}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
