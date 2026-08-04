import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Shield, Users, Lightbulb, Activity, Award } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const CORE_VALUES = [
  {
    icon: Eye,
    title: 'Transparency',
    description: 'We believe in operating in broad daylight. From our fee structure to our dispute resolution processes, everything is clearly communicated. You will never encounter hidden fees, undocumented policies, or opaque decision-making on our platform.',
    color: 'emerald'
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Protecting your assets and personal data is our highest priority. We employ enterprise-grade encryption, secure escrow wallets, and multi-layered fraud detection to ensure that every transaction is insulated from risk.',
    color: 'indigo'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We are more than a marketplace; we are a global network of ambitious professionals. We actively foster collaboration, knowledge sharing, and mutual respect among our buyers and sellers to elevate the entire industry.',
    color: 'blue'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'The digital economy evolves rapidly, and so do we. We are constantly pioneering new technologies, from AI-driven risk intelligence algorithms to frictionless global payout systems, keeping our platform at the bleeding edge.',
    color: 'amber'
  },
  {
    icon: Activity,
    title: 'Reliability',
    description: 'When livelihoods depend on a platform, uptime and consistency are non-negotiable. We engineer our infrastructure for maximum redundancy and 99.99% availability, ensuring you can run your business without interruption.',
    color: 'rose'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Good is the enemy of great. We hold ourselves to uncompromising standards in UI design, customer support, and dispute mediation. Every interaction you have with Remote Jobs Hub should feel exceptionally premium.',
    color: 'purple'
  }
]

export const CoreValues: React.FC = () => {
  const getColorStyles = (color: string) => {
    switch(color) {
      case 'emerald': return { borderHover: 'hover:border-emerald-500/30', bgGlow: 'bg-emerald-500/20', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' }
      case 'indigo': return { borderHover: 'hover:border-indigo-500/30', bgGlow: 'bg-indigo-500/20', iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-400' }
      case 'blue': return { borderHover: 'hover:border-blue-500/30', bgGlow: 'bg-blue-500/20', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' }
      case 'amber': return { borderHover: 'hover:border-amber-500/30', bgGlow: 'bg-amber-500/20', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' }
      case 'rose': return { borderHover: 'hover:border-rose-500/30', bgGlow: 'bg-rose-500/20', iconBg: 'bg-rose-500/10', iconColor: 'text-rose-400' }
      case 'purple': return { borderHover: 'hover:border-purple-500/30', bgGlow: 'bg-purple-500/20', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' }
      default: return { borderHover: 'hover:border-slate-500/30', bgGlow: 'bg-slate-500/20', iconBg: 'bg-slate-500/10', iconColor: 'text-slate-400' }
    }
  }

  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32 relative">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ ...springs.gentle }}
          className="mb-16 sm:mb-20 text-center"
        >
          <h2 className="font-heading text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Our Core Values
          </h2>
          <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-6" />
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            The fundamental principles that guide every feature we build, every policy we write, and every decision we make.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CORE_VALUES.map((v, idx) => {
            const styles = getColorStyles(v.color)

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ ...springs.gentle, delay: idx * 0.1 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 ${styles.borderHover} hover:bg-slate-900/60`}
              >
                {/* Subtle Hover Gradient Background */}
                <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full ${styles.bgGlow} blur-[80px] transition-all duration-500 group-hover:scale-150`} />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${styles.iconBg} border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                    <v.icon className={`h-7 w-7 ${styles.iconColor}`} />
                  </div>
                  <h3 className="mb-4 font-heading text-xl font-bold text-white tracking-wide">{v.title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-300 break-words">
                    {v.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
