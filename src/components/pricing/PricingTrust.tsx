import React from 'react'
import { motion } from 'framer-motion'
import { useCMSStore } from '@/services/cms/cms.store'

export const PricingTrust: React.FC = () => {
  const { globalStats } = useCMSStore()

  return (
    <section className="border-t border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="mb-16 font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
          Trusted by high-volume traders worldwide
        </h2>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: globalStats.escrowVolume, label: 'Assets Protected' },
            { value: globalStats.transactions, label: 'Successful Trades' },
            { value: globalStats.countries, label: 'Countries' },
            { value: globalStats.escrowSuccess, label: 'Buyer Satisfaction' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <span className="bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text font-heading text-4xl font-black tracking-tighter text-transparent dark:from-indigo-400 dark:to-cyan-400 md:text-5xl">
                {metric.value}
              </span>
              <span className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
