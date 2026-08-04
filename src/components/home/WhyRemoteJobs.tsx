import React from 'react'
import { motion } from 'framer-motion'
import { Shield, BrainCircuit, LineChart } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const WhyRemoteJobs: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Military-Grade Escrow',
      description: 'Funds are securely locked in a third-party audited escrow account until you have confirmed full control of the remote asset. Zero risk of fraud.',
      gradient: 'from-indigo-500 to-blue-500',
      glow: 'bg-indigo-500/20',
    },
    {
      icon: BrainCircuit,
      title: 'AI Verification Engine',
      description: 'Our proprietary machine learning models analyze historical revenue, account standing, and seller behavioral patterns to ensure every listing is 100% legitimate.',
      gradient: 'from-purple-500 to-pink-500',
      glow: 'bg-purple-500/20',
    },
    {
      icon: LineChart,
      title: 'Instant Cash Flow',
      description: 'Skip the years of grinding for ratings. Acquire an established, revenue-generating freelancer account and start earning on day one.',
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'bg-emerald-500/20',
    },
  ]

  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 sm:mb-24 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Engineered for <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Absolute Trust
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg font-medium text-slate-400 px-2 sm:px-0">
            We don't just connect buyers and sellers. We've built an entire ecosystem
            designed to eliminate risk, verify authenticity, and guarantee smooth transitions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ ...springs.gentle, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className={`absolute -inset-4 rounded-[2.5rem] ${feature.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />
              
              <div className="relative flex h-full flex-col items-start rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-10 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-white/10 hover:bg-slate-900/60">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 shadow-inner border border-white/5">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 absolute`} />
                  <feature.icon className="relative z-10 h-8 w-8 text-white" />
                </div>
                
                <h3 className="mb-4 font-heading text-2xl font-bold text-white">
                  {feature.title}
                </h3>
                
                <p className="leading-relaxed text-slate-400 font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
