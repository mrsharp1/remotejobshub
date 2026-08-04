import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Users2, Library, Network } from 'lucide-react'
import { springs } from '@/lib/framer-physics'
import { useCommunityContent } from '@/services/cms/cms.store'

export const CommunityHero: React.FC = () => {
  const { hero } = useCommunityContent()
  
  return (
    <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 pt-32 pb-20 text-white">
      {/* Immersive mesh gradients */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[10%] left-1/3 h-[700px] w-[700px] rounded-full bg-violet-600/20 mix-blend-screen blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-[20%] right-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/20 mix-blend-screen blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-background" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Animated Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
            A Thriving Ecosystem
          </span>
        </motion.div>

        {/* Responsive Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.2 }}
          className="max-w-4xl font-heading text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl"
          dangerouslySetInnerHTML={{ __html: hero.headline }}
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.3 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
        >
          {hero.description}
        </motion.p>

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: Users2, label: 'Global Network' },
            { icon: MessageSquare, label: 'Verified Discussions' },
            { icon: Library, label: 'Educational Hub' },
            { icon: Network, label: 'Active Collaboration' },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <badge.icon className="h-4 w-4 text-violet-400" />
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
