import React from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Code2, UserCheck, Shield, Globe2, Rocket } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const MILESTONES = [
  {
    icon: Lightbulb,
    year: 'Phase 1',
    title: 'The Idea',
    description: 'Recognized the critical flaw in remote work asset trading: a total lack of trust. Conceptualized a marketplace built entirely on escrow and identity verification.',
    color: 'emerald'
  },
  {
    icon: Code2,
    year: 'Phase 2',
    title: 'Marketplace Development',
    description: 'Engineered the core platform using enterprise-grade architecture, focusing on absolute security, speed, and seamless user experience.',
    color: 'indigo'
  },
  {
    icon: UserCheck,
    year: 'Phase 3',
    title: 'Seller Verification',
    description: 'Implemented military-grade KYC protocols and biometric liveness checks to eradicate anonymous bad actors from the ecosystem.',
    color: 'blue'
  },
  {
    icon: Shield,
    year: 'Phase 4',
    title: 'Buyer Protection',
    description: 'Launched the neutral escrow vault system. Funds are strictly held until the buyer secures the assets, eliminating payment fraud.',
    color: 'amber'
  },
  {
    icon: Globe2,
    year: 'Phase 5',
    title: 'Global Expansion',
    description: 'Opened the platform to over 150 countries, integrating localized payment processors and breaking down geographical barriers to remote work.',
    color: 'purple'
  },
  {
    icon: Rocket,
    year: 'Phase 6',
    title: 'Future Vision',
    description: 'Continuously refining AI risk intelligence and expanding asset categories to become the definitive global standard for digital asset trading.',
    color: 'rose'
  }
]

export const InteractiveTimeline: React.FC = () => {
  const getColorStyles = (color: string) => {
    switch(color) {
      case 'emerald': return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30' }
      case 'indigo': return { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/30' }
      case 'blue': return { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/30' }
      case 'amber': return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' }
      case 'purple': return { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30' }
      case 'rose': return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30' }
      default: return { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/30' }
    }
  }

  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto w-full max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-16 sm:mb-24 text-center"
        >
          <h2 className="mb-6 font-heading text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Platform Evolution
          </h2>
          <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-6" />
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400">
            How we built the safest marketplace on the internet, step by step.
          </p>
        </motion.div>

        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 md:mx-auto md:w-[90%] lg:w-[80%]">
          {MILESTONES.map((m, idx) => {
            const styles = getColorStyles(m.color)

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ ...springs.gentle, delay: idx * 0.1 }}
                className="relative mb-16 pl-8 sm:pl-12 last:mb-0 group"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-4 border-slate-950 ${styles.bg} transition-transform duration-500 group-hover:scale-150`}>
                  <div className={`absolute h-8 w-8 rounded-full ${styles.bg} opacity-20 animate-ping`} />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                  <div className="flex-1 rounded-3xl border border-white/5 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg transition-all duration-500 hover:border-white/10 hover:bg-slate-900/60 hover:-translate-y-1">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`font-mono text-sm sm:text-base font-bold uppercase tracking-widest ${styles.text}`}>
                        {m.year}
                      </span>
                      <m.icon className={`h-6 w-6 ${styles.text} opacity-50`} />
                    </div>
                    <h3 className="mb-3 font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {m.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-slate-400">
                      {m.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
