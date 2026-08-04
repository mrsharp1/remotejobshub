import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2 } from 'lucide-react'

// Helper to generate smooth SVG cubic bezier path
const getBezierPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    const cpX1 = curr.x + (next.x - curr.x) / 2
    const cpY1 = curr.y
    const cpX2 = curr.x + (next.x - curr.x) / 2
    const cpY2 = next.y
    path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`
  }
  return path
}

interface AnalyticsSectionProps {
  telemetry: {
    users: number;
    orders: number;
    revenue: number;
    activeListings: number;
    pendingListings: number;
  };
  chartMetric: 'users' | 'orders' | 'revenue' | 'listings';
  setChartMetric: (metric: 'users' | 'orders' | 'revenue' | 'listings') => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = React.memo(({
  telemetry,
  chartMetric,
  setChartMetric,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Analytics Chart datasets
  const chartDatasets = {
    users: [
      { label: 'Jan', value: 12 },
      { label: 'Feb', value: 24 },
      { label: 'Mar', value: 45 },
      { label: 'Apr', value: 80 },
      { label: 'May', value: 120 },
      { label: 'Jun', value: telemetry.users || 150 },
    ],
    orders: [
      { label: 'Jan', value: 5 },
      { label: 'Feb', value: 12 },
      { label: 'Mar', value: 18 },
      { label: 'Apr', value: 32 },
      { label: 'May', value: 48 },
      { label: 'Jun', value: telemetry.orders || 55 },
    ],
    revenue: [
      { label: 'Jan', value: 500 },
      { label: 'Feb', value: 1200 },
      { label: 'Mar', value: 1800 },
      { label: 'Apr', value: 3400 },
      { label: 'May', value: 5800 },
      { label: 'Jun', value: telemetry.revenue || 7200 },
    ],
    listings: [
      { label: 'Jan', value: 8 },
      { label: 'Feb', value: 15 },
      { label: 'Mar', value: 22 },
      { label: 'Apr', value: 35 },
      { label: 'May', value: 64 },
      { label: 'Jun', value: telemetry.activeListings + telemetry.pendingListings || 82 },
    ],
  }

  const activeDataset = chartDatasets[chartMetric]
  const maxVal = Math.max(...activeDataset.map((d) => d.value), 10)

  const chartWidth = 500
  const chartHeight = 120

  const points = activeDataset.map((d, idx) => {
    const x = (idx / (activeDataset.length - 1)) * chartWidth
    const y = chartHeight - (d.value / maxVal) * chartHeight
    return { x, y }
  })

  const curvePath = getBezierPath(points)
  const fillPoints = points.length > 0
    ? `${curvePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : ''

  return (
    <div className="rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6 md:p-8 shadow-md dark:border-slate-800 dark:bg-gradient-to-b dark:from-slate-900/60 dark:to-slate-950/60 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
        <div className="space-y-1">
          <h3 className="flex items-center gap-1.5 font-heading text-base font-bold text-slate-950 dark:text-white">
            <BarChart2 className="h-5 w-5 text-destructive" /> Platform Telemetry Graph
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Scale performance metrics over 6-month trends.</p>
        </div>

        {/* Chart selector tabs */}
        <div className="flex rounded-2xl bg-slate-100 border border-slate-200/40 p-1 text-[10px] font-bold dark:bg-slate-900 self-start sm:self-auto shadow-inner">
          {[
            { key: 'users', label: 'User Registry' },
            { key: 'orders', label: 'Escrow Volume' },
            { key: 'revenue', label: 'Net Revenue' },
            { key: 'listings', label: 'Listings Deployment' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setChartMetric(
                  tab.key as 'users' | 'orders' | 'revenue' | 'listings'
                )
              }
              className={`rounded-xl px-4 py-2 transition-all ${
                chartMetric === tab.key
                  ? 'bg-white text-slate-955 shadow-sm dark:bg-slate-800 dark:text-white border border-slate-200/10'
                  : 'text-slate-505 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* High-fidelity SVG chart */}
      <div className="relative pt-6 min-h-[160px]">
        {/* Tooltip Overlay */}
        <AnimatePresence>
          {hoveredIndex !== null && activeDataset[hoveredIndex] && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 right-4 rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-950/95 text-[10px] font-bold space-y-1 z-20 backdrop-blur-md"
            >
              <span className="block text-slate-400 uppercase tracking-widest text-[8px]">
                {activeDataset[hoveredIndex].label}
              </span>
              <span className="block text-slate-950 dark:text-white text-xs font-black">
                {chartMetric === 'revenue'
                  ? `₦${activeDataset[hoveredIndex].value.toLocaleString()}`
                  : activeDataset[hoveredIndex].value.toLocaleString()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] font-bold text-slate-300 dark:text-slate-700">
          <div className="border-b border-dashed border-slate-200/80 dark:border-slate-800/80 w-full pb-1">
            {chartMetric === 'revenue' ? `₦${maxVal.toLocaleString()}` : maxVal}
          </div>
          <div className="border-b border-dashed border-slate-200/80 dark:border-slate-800/80 w-full pb-1" />
          <div className="border-b border-dashed border-slate-200/80 dark:border-slate-800/80 w-full pb-1" />
          <div className="w-full" />
        </div>

        <div className="h-32 w-full pt-4 relative">
          <svg className="h-full w-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
            {/* Gradients definitions */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Filled Path */}
            {fillPoints && <path d={fillPoints} fill="url(#chartGradient)" />}
            {/* Curve path */}
            {curvePath && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
                d={curvePath}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Indicator Dot on Hover */}
            {hoveredIndex !== null && points[hoveredIndex] && (
              <circle
                cx={points[hoveredIndex].x}
                cy={points[hoveredIndex].y}
                r="5"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
            )}
          </svg>

          {/* Hover hotspots */}
          <div className="absolute inset-0 flex">
            {activeDataset.map((_, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 cursor-pointer h-full"
              />
            ))}
          </div>
        </div>

        {/* Month labels */}
        <div className="flex justify-between border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-400 dark:border-slate-800">
          {activeDataset.map((d, idx) => (
            <span key={idx}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
})
