import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

import { springs } from '@/lib/framer-physics'
import { useGlobalStats } from '@/services/cms/cms.store'

const AnimatedCounter: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState("0")
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) {
      return
    }

    const duration = 1500 // 1.5 seconds
    let startTimestamp: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Easing out function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentNum = value * easeOutQuart

      const formattedNum = decimals > 0 
        ? currentNum.toFixed(decimals)
        : Math.floor(currentNum).toLocaleString()

      setDisplayValue(`${prefix}${formattedNum}${suffix}`)

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      } else {
        const finalNum = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()
        setDisplayValue(`${prefix}${finalNum}${suffix}`)
        hasAnimated.current = true
      }
    }

    animationFrameId = window.requestAnimationFrame(step)

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, value, prefix, suffix, decimals])

  return <span ref={ref} className="font-heading font-black tracking-tight text-white">{displayValue}</span>
}

export const LivePlatformNumbers: React.FC = () => {
  const stats = useGlobalStats()

  const parseCmsStat = (str: string | undefined) => {
    if (!str) return { value: 0, prefix: '', suffix: '', decimals: 0 }
    const match = str.match(/^([^0-9.-]*)([0-9.,]+)([^0-9]*)$/)
    if (!match) return { value: 0, prefix: '', suffix: '', decimals: 0 }
    
    const prefix = match[1]
    const numberStr = match[2].replace(/,/g, '')
    const suffix = match[3]
    const value = parseFloat(numberStr)
    const decimals = numberStr.includes('.') ? numberStr.split('.')[1].length : 0
    
    return { 
      value: isNaN(value) ? 0 : value, 
      prefix, 
      suffix, 
      decimals 
    }
  }

  const data = [
    { label: 'Successful Transfers', ...parseCmsStat(stats.transactions) },
    { label: 'Escrow Volume', ...parseCmsStat(stats.escrowVolume) },
    { label: 'Active Escrow Transactions', ...parseCmsStat(stats.activeEscrow) },
    { label: 'Escrow Success Rate', ...parseCmsStat(stats.escrowSuccess) },
    { label: 'Countries Served', ...parseCmsStat(stats.countries) },
    { label: 'Average Response Time', ...parseCmsStat(stats.responseTime) },
    { label: 'Daily Discussions', ...parseCmsStat(stats.dailyDiscussions) },
    { label: 'Registered Users', ...parseCmsStat(stats.users) },
  ]

  return (
    <section className="relative z-20 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {data.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springs.gentle, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:bg-slate-900/60"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 opacity-0 transition-all duration-500 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 group-hover:opacity-100" />
              <div className="relative z-10 text-4xl sm:text-5xl">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <p className="relative z-10 mt-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-slate-400 break-words">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
