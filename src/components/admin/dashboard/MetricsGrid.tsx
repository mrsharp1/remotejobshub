import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, ShieldCheck, ListFilter, Clock, DollarSign } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

// Mini Sparkline Generator
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const width = 100
  const height = 30
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((val - min) / (max - min)) * height
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg className="h-8 w-24 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
}

// Live Number Counter Animation
const AnimatedCounter: React.FC<{ value: number | string }> = ({ value }) => {
  const numericVal = typeof value === 'number' ? value : parseInt(value.replace(/[^0-9]/g, ''))
  const isCurrency = typeof value === 'string' && value.includes('₦')
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isNaN(numericVal) || numericVal <= 0) {
      setCount(0)
      return
    }
    let start = 0
    const end = numericVal
    const duration = 600
    const increment = Math.max(1, Math.ceil(end / 30))
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, duration / 30)

    return () => clearInterval(timer)
  }, [numericVal])

  if (isNaN(numericVal)) return <span>{value}</span>
  return (
    <span>
      {isCurrency ? `₦${count.toLocaleString()}` : count.toLocaleString()}
    </span>
  )
}

interface MetricsGridProps {
  telemetry: {
    users: number;
    verifiedSellers: number;
    activeListings: number;
    pendingListings: number;
    revenue: number;
  };
}

export const MetricsGrid: React.FC<MetricsGridProps> = React.memo(({ telemetry }) => {
  const cards = [
    {
      title: 'Total Registry',
      value: telemetry.users,
      sparkData: [10, 25, 45, 60, 110, telemetry.users],
      icon: Users,
      color: 'text-indigo-400',
      border: 'hover:border-indigo-500/30',
      glow: 'hover:shadow-[0_0_35px_rgba(99,102,241,0.12)]',
      trend: '+12.4%',
      isPositive: true,
      grad: 'from-indigo-500/[0.04] to-indigo-500/[0.01]',
    },
    {
      title: 'Verified Sellers',
      value: telemetry.verifiedSellers,
      sparkData: [5, 12, 18, 30, 48, telemetry.verifiedSellers],
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/30',
      glow: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.12)]',
      trend: '+8.1%',
      isPositive: true,
      grad: 'from-emerald-500/[0.04] to-emerald-500/[0.01]',
    },
    {
      title: 'Active Listings',
      value: telemetry.activeListings,
      sparkData: [8, 15, 22, 38, 54, telemetry.activeListings],
      icon: ListFilter,
      color: 'text-blue-400',
      border: 'hover:border-blue-500/30',
      glow: 'hover:shadow-[0_0_35px_rgba(59,130,246,0.12)]',
      trend: '+2.4%',
      isPositive: true,
      grad: 'from-blue-500/[0.04] to-blue-500/[0.01]',
    },
    {
      title: 'Pending Listings',
      value: telemetry.pendingListings,
      sparkData: [2, 5, 4, 8, 3, telemetry.pendingListings],
      icon: Clock,
      color: 'text-yellow-400',
      border: 'hover:border-yellow-500/30',
      glow: 'hover:shadow-[0_0_35px_rgba(245,158,11,0.12)]',
      trend: '-4.0%',
      isPositive: false,
      grad: 'from-yellow-500/[0.04] to-yellow-500/[0.01]',
    },
    {
      title: 'Gross Revenue',
      value: `₦${telemetry.revenue.toLocaleString()}`,
      sparkData: [1000, 3000, 5000, 12000, 18000, telemetry.revenue],
      icon: DollarSign,
      color: 'text-rose-400',
      border: 'hover:border-rose-500/30',
      glow: 'hover:shadow-[0_0_35px_rgba(244,63,94,0.12)]',
      trend: '+18.9%',
      isPositive: true,
      grad: 'from-rose-500/[0.04] to-rose-500/[0.01]',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={springs.snappy}
          className={`space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-br ${card.grad} bg-white dark:border-slate-800 dark:bg-slate-950 p-6 shadow-md ${card.border} ${card.glow} flex flex-col justify-between transition-shadow duration-300 min-h-[160px]`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {card.title}
            </span>
            <div className={`rounded-xl p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${card.color}`}>
              <card.icon className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <span className="block truncate font-heading text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              <AnimatedCounter value={card.value} />
            </span>
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-2">
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  card.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {card.trend}
              </span>
              <div className="opacity-90 hover:opacity-100 transition">
                <Sparkline data={card.sparkData} color={card.isPositive ? '#10b981' : '#f59e0b'} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
})
