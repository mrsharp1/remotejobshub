import React from 'react'
import { motion } from 'framer-motion'
import { useGlobalStats } from '@/services/cms/cms.store'

export const CommunityStats: React.FC = () => {
  const stats = useGlobalStats()
  
  return (
    <section className="bg-slate-950 py-32 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="mb-20 font-heading text-3xl font-black tracking-tight md:text-5xl">
          Ecosystem Scale
        </h2>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: stats.communityMembers, label: 'Verified Members' },
            { value: stats.dailyDiscussions, label: 'Daily Discussions' },
            { value: stats.eventsHosted, label: 'Events Hosted' },
            { value: stats.escrowSuccess, label: 'Escrow Success SLA' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-white/5 p-12 backdrop-blur-sm"
            >
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text font-heading text-5xl font-black tracking-tighter text-transparent md:text-6xl">
                {stat.value}
              </span>
              <span className="mt-4 text-sm font-medium uppercase tracking-widest text-slate-400">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
