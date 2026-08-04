import React, { useMemo } from 'react'
import { TrendingUp, Info } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface IncomeHistoryChartProps {
  monthlyIncome: number | null | undefined
  className?: string
}

function generateEstimatedHistory(currentMonthly: number): number[] {
  // Generate 7 months of estimated data, ending at current monthly income
  // Simulate gradual growth with slight variance
  const data: number[] = []
  const base = currentMonthly * 0.65
  const growthFactor = (currentMonthly - base) / 6
  for (let i = 0; i < 7; i++) {
    const variance = (Math.random() - 0.5) * currentMonthly * 0.1
    const val = base + growthFactor * i + variance
    data.push(Math.max(0, Math.round(val)))
  }
  data[6] = currentMonthly
  return data
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

export const IncomeHistoryChart: React.FC<IncomeHistoryChartProps> = ({
  monthlyIncome,
  className = '',
}) => {
  const data = useMemo(() => {
    if (!monthlyIncome || monthlyIncome <= 0) return null
    return generateEstimatedHistory(monthlyIncome)
  }, [monthlyIncome])

  if (!data) {
    return (
      <div
        className={`rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-card ${className}`}
      >
        <h3 className="mb-2 font-heading text-base font-bold text-foreground">
          Income History
        </h3>
        <p className="text-sm text-muted-foreground">
          No income data available for this listing.
        </p>
      </div>
    )
  }

  const maxVal = Math.max(...data)
  const minVal = Math.min(...data)
  const range = maxVal - minVal || 1

  const chartWidth = 360
  const chartHeight = 120
  const paddingX = 10
  const paddingY = 10

  const points = data.map((val, i) => {
    const x = paddingX + (i / (data.length - 1)) * (chartWidth - paddingX * 2)
    const y =
      chartHeight -
      paddingY -
      ((val - minVal) / range) * (chartHeight - paddingY * 2)
    return { x, y, val }
  })

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  // Area fill path
  const areaPath = [
    `M ${points[0].x} ${chartHeight}`,
    `L ${points[0].x} ${points[0].y}`,
    ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${chartHeight}`,
    'Z',
  ].join(' ')

  const trend = ((data[data.length - 1] - data[0]) / data[0]) * 100

  return (
    <div
      className={`space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-card ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-foreground">
            Income History
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            7-month earnings trend
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp
            className={`h-4 w-4 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}
          />
          <span
            className={`text-sm font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {trend >= 0 ? '+' : ''}
            {trend.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Current month summary */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/5 border-primary/20 rounded-xl border px-4 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Current Monthly
          </p>
          <p className="mt-0.5 font-heading text-xl font-black text-primary">
            {formatCurrency(Number(monthlyIncome || 0))}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Est. Weekly
          </p>
          <p className="mt-0.5 font-heading text-xl font-black text-foreground">
            {formatCurrency(Number(monthlyIncome || 0) / 4.33)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-slate-50 p-2 dark:bg-slate-800/30">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          style={{ height: 130 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#incomeGrad)" />

          {/* Line */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 5 : 3}
              fill={i === points.length - 1 ? '#3b82f6' : '#fff'}
              stroke="#3b82f6"
              strokeWidth={2}
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="mt-1 flex justify-between px-2">
          {MONTHS.map((m, i) => (
            <span
              key={i}
              className="text-[9px] font-semibold text-muted-foreground"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          <strong>Estimated Data:</strong> Monthly figures are algorithmically
          projected from the seller's stated current earnings. Past performance
          does not guarantee future results.
        </p>
      </div>
    </div>
  )
}
