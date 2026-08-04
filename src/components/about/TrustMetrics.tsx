import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCMSStore } from '@/services/cms/cms.store'

// Helper component for animating numbers with prefixes/suffixes
const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState("0")
  const hasAnimated = useRef(false)
  
  useEffect(() => {
    if (!isInView || hasAnimated.current) {
      return
    }

    const match = value.match(/^([^0-9.-]*)([0-9.,]+)([^0-9]*)$/)
    if (!match) {
      setDisplayValue(value)
      hasAnimated.current = true
      return
    }

    const prefix = match[1]
    const numStr = match[2].replace(/,/g, '')
    const suffix = match[3]
    const targetNum = parseFloat(numStr)
    const isFloat = numStr.includes('.')
    const decimalPlaces = isFloat ? numStr.split('.')[1].length : 0

    let startTimestamp: number | null = null
    const duration = 1500 // 1.5 seconds
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      // Easing out function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentNum = targetNum * easeOutQuart

      const formattedNum = isFloat 
        ? currentNum.toFixed(decimalPlaces)
        : Math.floor(currentNum).toLocaleString()

      setDisplayValue(`${prefix}${formattedNum}${suffix}`)

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      } else {
        // Ensure final value perfectly matches original string for formatting
        setDisplayValue(value)
        hasAnimated.current = true
      }
    }

    animationFrameId = window.requestAnimationFrame(step)

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, value])

  return <span ref={ref}>{displayValue}</span>
}

export const TrustMetrics: React.FC = () => {
  const { globalStats } = useCMSStore()

  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto w-full max-w-7xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-16 sm:mb-20"
        >
          <h2 className="mb-6 font-heading text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Platform Statistics
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mb-6" />
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400">
            The scale of trust backing every transaction on our platform.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { value: globalStats.escrowVolume, label: 'Assets Protected in Escrow' },
            { value: globalStats.users, label: 'Verified Sellers Globally' },
            { value: globalStats.transactions, label: 'Transactions Completed' },
            { value: globalStats.countries, label: 'Countries Supported' },
            { value: globalStats.escrowSuccess, label: 'Customer Satisfaction' },
            { value: globalStats.responseTime, label: 'Secure Transactions' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/40 p-10 sm:p-12 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:bg-slate-900/60"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 transition-all duration-500 group-hover:from-emerald-500/10" />
              
              <div className="relative z-10 flex flex-col items-center">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text font-heading text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-transparent">
                  <AnimatedCounter value={metric.value} />
                </span>
                <span className="mt-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 text-center break-words">
                  {metric.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
