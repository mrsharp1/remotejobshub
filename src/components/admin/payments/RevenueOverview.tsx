import React, { useState, useEffect } from 'react'
import { TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/utils/currency'

interface RevenueOverviewProps {
  payments: any[]
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly'

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({ payments }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase.rpc('rpc_get_revenue_analytics')
        if (!error && data) {
          setAnalytics(data)
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [payments]) // Refetch if payments change (e.g. action taken)

  if (loading || !analytics) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-xl">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  const activeData = analytics[timeframe] || []
  const values = activeData.map((d: any) => Number(d.value))
  const maxValue = Math.max(...values, 1000)
  const minValue = Math.min(...values, 0)
  const range = maxValue - minValue || 1

  // SVG dimensions
  const width = 600
  const height = 180
  const padding = 20

  // Coordinate mapper
  const getCoords = (index: number, value: number) => {
    const x = padding + (index / Math.max(1, activeData.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
    return { x, y }
  }

  // Generate SVG path using coordinates
  const points = activeData.map((d: any, i: number) => getCoords(i, Number(d.value)))
  
  // Bezier curve path generator
  let pathD = ''
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const cpX1 = p0.x + (p1.x - p0.x) / 2
      const cpY1 = p0.y
      const cpX2 = p0.x + (p1.x - p0.x) / 2
      const cpY2 = p1.y
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
    }
  }

  // Closed path for gradient area fill
  const areaD = pathD && points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : ''

  const stats = analytics.stats

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <h2 className="font-heading text-lg font-bold text-foreground">Revenue Analytics</h2>
          </div>
          <p className="text-xs text-muted-foreground">Platform commissions & transaction overview</p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted p-1">
          {(['daily', 'weekly', 'monthly', 'yearly'] as Timeframe[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTimeframe(t)
                setHoveredIndex(null)
              }}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-all ${
                timeframe === t
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Revenue Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-b border-border/50 pb-6 sm:grid-cols-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Average Order Value
          </span>
          <h3 className="mt-1 font-mono text-xl font-bold text-foreground">
            {formatCurrency(Number(stats.average_order_value))}
          </h3>
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 dark:text-emerald-400">
            <ArrowUpRight className="h-3 w-3" /> System Live
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Commission Yield
          </span>
          <h3 className="mt-1 font-mono text-xl font-bold text-foreground">
            {formatCurrency(Number(stats.total_commission))}
          </h3>
          <span className="text-[10px] text-muted-foreground">Standard 10% rate</span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Success Payout rate
          </span>
          <h3 className="mt-1 font-mono text-xl font-bold text-foreground">
            {Number(stats.success_rate).toFixed(2)}%
          </h3>
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 dark:text-emerald-400">
            <ArrowUpRight className="h-3 w-3" /> Automated Sync
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Disputed Escrow Rate
          </span>
          <h3 className="mt-1 font-mono text-xl font-bold text-foreground">
            {Number(stats.disputed_rate).toFixed(2)}%
          </h3>
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-rose-500 dark:text-rose-400">
            <ArrowDownRight className="h-3 w-3" /> Live Tracking
          </span>
        </div>
      </div>

      {/* SVG Chart display */}
      <div className="relative mt-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
        >
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="stroke-border/20" strokeWidth={1} />
          <line x1={padding} y1={(height - padding * 2) / 2 + padding} x2={width - padding} y2={(height - padding * 2) / 2 + padding} className="stroke-border/20" strokeWidth={1} />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-border/40" strokeWidth={1} />

          {/* Area Fill */}
          {areaD && (
            <path d={areaD} fill="url(#chartGlow)" />
          )}

          {/* Path Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Nodes */}
          {points.map((p: any, idx: number) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 6 : 4}
                className={`cursor-pointer transition-all duration-150 ${
                  hoveredIndex === idx ? 'fill-indigo-400 stroke-card stroke-2' : 'fill-card stroke-indigo-500 stroke-2'
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}
        </svg>

        {/* Dynamic Premium Tooltip */}
        {hoveredIndex !== null && activeData[hoveredIndex] && (
          <div
            className="pointer-events-none absolute z-20 rounded-xl border border-border/50 bg-slate-900/90 dark:bg-slate-950/90 px-3 py-2 shadow-2xl backdrop-blur-md transition-all duration-150"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 35}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="block text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
              {activeData[hoveredIndex].label}
            </span>
            <span className="mt-0.5 block font-mono text-xs font-bold text-white">
              {formatCurrency(Number(activeData[hoveredIndex].value))}
            </span>
          </div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="mt-3 flex justify-between px-3 text-[9px] font-bold text-muted-foreground uppercase">
        {activeData.map((d: any, idx: number) => (
          <span key={idx}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}
