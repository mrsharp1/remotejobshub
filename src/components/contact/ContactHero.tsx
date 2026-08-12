import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, BrainCircuit, Headphones, Zap } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const ContactHero: React.FC = () => {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 pt-32 pb-20 text-white">
      {/* Cinematic Floating Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] left-1/4 h-[800px] w-[800px] rounded-full bg-indigo-600/20 mix-blend-screen blur-[120px] will-change-transform" />
        <div className="absolute -bottom-[20%] right-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/20 mix-blend-screen blur-[120px] will-change-transform" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-background" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            24/7 Global Support
          </span>
        </motion.div>

        {/* Massive Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.2 }}
          className="max-w-4xl font-heading text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl"
        >
          Contact <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Remote Jobs Hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.3 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
        >
          We're here to help. Whether you have questions about listings, sellers, accounts, payments, or technical issues, our support team is available through multiple channels.
        </motion.p>

        {/* Glass Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: ShieldCheck, label: 'Escrow Protected' },
            { icon: BrainCircuit, label: 'AI Scam Detection' },
            { icon: Headphones, label: 'Human Support' },
            { icon: Zap, label: 'Fast Response SLA' },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <badge.icon className="h-4 w-4 text-indigo-400" />
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
