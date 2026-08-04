import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Award, Clock } from 'lucide-react'

export const TrustBar: React.FC = () => {
  const trustMetrics = [
    {
      icon: <Lock className="h-5 w-5 text-indigo-400" />,
      label: '100% Escrow Protection',
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
      label: 'Verified Sellers Only',
    },
    {
      icon: <Award className="h-5 w-5 text-amber-400" />,
      label: 'Premium Quality Assets',
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-400" />,
      label: '24/7 Support & Mediation',
    },
  ]

  return (
    <div className="border-y border-white/5 bg-slate-900/50 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:justify-between">
          {trustMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 shadow-inner">
                {metric.icon}
              </div>
              <span className="text-sm font-bold text-slate-300">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
