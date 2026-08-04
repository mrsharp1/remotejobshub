import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, CreditCard, AlertTriangle, Lock, UserCheck, Server } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const TRUST_PILLARS = [
  {
    icon: UserCheck,
    title: 'Verified Sellers',
    description: 'Every seller undergoes a stringent identity verification process. We cross-reference government IDs and conduct biometric liveness checks before they can list a single account.',
  },
  {
    icon: Lock,
    title: 'Escrow Support',
    description: 'Your funds are secured in a neutral, institutional-grade vault. Payment is only released to the seller once you have successfully received and secured the assets.',
  },
  {
    icon: AlertTriangle,
    title: 'Fraud Protection',
    description: 'Our proprietary AI monitors every transaction in real-time, detecting anomalous patterns and preventing malicious activity before it can affect our users.',
  },
  {
    icon: ShieldCheck,
    title: 'Human Moderation',
    description: 'While our AI is powerful, every dispute is handled by a trained human mediator. You will never be stuck arguing with an automated bot when you need critical help.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'We partner with top-tier global payment processors. Your financial data is fully encrypted, tokenized, and never stored directly on our servers.',
  },
  {
    icon: Server,
    title: 'Enterprise Security',
    description: 'Our infrastructure is built on zero-trust principles. We utilize SOC2-compliant data centers, continuous penetration testing, and end-to-end encryption.',
  }
]

export const WhyTrustUs: React.FC = () => {
  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/3 -translate-x-1/3 rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-16 sm:mb-24 flex flex-col items-center text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Zero-Risk Environment
            </span>
          </div>
          <h2 className="mb-6 font-heading text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Why Trust Remote Jobs Hub
          </h2>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-400">
            We haven't just built a marketplace; we've built a fortress. Every feature is designed to protect you from the inherent risks of the digital economy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TRUST_PILLARS.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springs.gentle, delay: idx * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/30 hover:bg-slate-900/60"
            >
              {/* Animated Hover Line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 group-hover:w-full" />
              
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 transition-transform duration-500 group-hover:scale-110 group-hover:bg-indigo-500/20">
                <pillar.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-4 font-heading text-xl font-bold text-white tracking-wide">
                {pillar.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
