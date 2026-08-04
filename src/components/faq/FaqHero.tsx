import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShieldCheck, BrainCircuit, Headphones, Zap } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

interface FaqHeroProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const suggestions = [
  'How does escrow protect me?',
  'How do I verify my seller account?',
  'How long do bank withdrawals take?',
  'What payment methods do you support?',
]

export const FaqHero: React.FC<FaqHeroProps> = ({ searchQuery, setSearchQuery }) => {
  const [suggestionIdx, setSuggestionIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % suggestions.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 pt-32 pb-20 text-white">
      {/* Cinematic gradient mesh */}
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
            Intelligent Help Center
          </span>
        </motion.div>

        {/* Massive Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.2 }}
          className="max-w-4xl font-heading text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl"
        >
          How can we <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">assist you?</span>
        </motion.h1>

        {/* Apple Spotlight Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.3 }}
          className="relative mt-12 w-full max-w-2xl"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-5 h-6 w-6 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-16 w-full rounded-2xl border border-white/10 bg-white/5 pl-14 pr-6 text-lg font-medium text-white outline-none ring-offset-slate-950 transition-all placeholder:text-transparent focus:border-indigo-500 focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-indigo-500/20"
            />
            {/* Animated placeholder suggestions */}
            {searchQuery === '' && (
              <div className="pointer-events-none absolute left-14 flex overflow-hidden text-lg font-medium text-slate-400">
                <span className="mr-1">Search for</span>
                <div className="relative h-7 overflow-hidden w-64 text-left">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={suggestionIdx}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute block text-indigo-400"
                    >
                      {suggestions[suggestionIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </motion.div>

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
            { icon: Headphones, label: '24/7 Support SLA' },
            { icon: Zap, label: 'Verified Marketplace' },
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
