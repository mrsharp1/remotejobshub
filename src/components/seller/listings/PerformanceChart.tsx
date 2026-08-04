import React, { useState } from 'react'
import { Eye, Heart, DollarSign } from 'lucide-react'

export const PerformanceChart: React.FC = () => {
  const [metric, setMetric] = useState<'views' | 'likes' | 'revenue'>('views')

  // Sample weekly metrics
  const data = {
    views: [120, 180, 240, 190, 310, 280, 420],
    likes: [12, 18, 25, 14, 38, 29, 45],
    revenue: [450, 600, 1200, 850, 1600, 1400, 2400],
  }

  const currentDataset = data[metric]
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Math variables for SVG line construction
  const maxVal = Math.max(...currentDataset) * 1.15
  const points = currentDataset
    .map((val, idx) => {
      const x = 50 + idx * 80
      const y = 180 - (val / maxVal) * 140
      return `${x},${y}`
    })
    .join(' ')

  const fillPoints = `50,180 ${points} 530,180`

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">Performance Analytics</h4>
          <p className="text-[10px] text-slate-450 mt-0.5">Weekly engagement traffic and revenue</p>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-1.5 bg-slate-950 border border-white/5 rounded-xl p-1 shrink-0 self-start">
          {[
            { key: 'views', label: 'Views', icon: Eye, color: 'text-purple-400' },
            { key: 'likes', label: 'Likes', icon: Heart, color: 'text-rose-450' },
            { key: 'revenue', label: 'Revenue', icon: DollarSign, color: 'text-emerald-450' },
          ].map((item) => {
            const Icon = item.icon
            const isCurrent = metric === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setMetric(item.key as any)}
                className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold rounded-lg transition ${
                  isCurrent ? 'bg-purple-650 text-white shadow' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SVG line graph */}
      <div className="relative">
        <svg viewBox="0 0 580 200" className="w-full h-auto text-purple-600">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="50" y1="40" x2="530" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="50" y1="110" x2="530" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="50" y1="180" x2="530" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Area Fill */}
          <polygon points={fillPoints} fill="url(#chartGrad)" />

          {/* Graph Line */}
          <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={points} className="transition-all duration-500" />

          {/* Markers */}
          {currentDataset.map((val, idx) => {
            const x = 50 + idx * 80
            const y = 180 - (val / maxVal) * 140
            return (
              <g key={idx} className="group cursor-pointer">
                <circle cx={x} cy={y} r="4" fill="#0f172a" stroke="currentColor" strokeWidth="2" />
                <circle cx={x} cy={y} r="8" fill="currentColor" opacity="0" className="hover:opacity-20 transition" />
              </g>
            )
          })}

          {/* Labels */}
          {labels.map((l, idx) => {
            const x = 50 + idx * 80
            return (
              <text key={idx} x={x} y="196" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {l}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
