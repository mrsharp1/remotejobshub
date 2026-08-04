import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Globe2 } from 'lucide-react'
import { springs } from '@/lib/framer-physics'
import { useAboutContent } from '@/services/cms/cms.store'

export const AboutHero: React.FC = () => {
  const { hero } = useAboutContent()
  
  return (
    <section className="relative flex min-h-[100vh] sm:min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 pt-32 pb-20 sm:pt-40 sm:pb-32">
      {/* Premium Animated Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -left-[30%] -top-[10%] h-[600px] w-[600px] sm:h-[1000px] sm:w-[1000px] rounded-full bg-indigo-600/10 mix-blend-screen blur-[100px] sm:blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-[20%] bottom-[10%] h-[500px] w-[500px] sm:h-[800px] sm:w-[800px] rounded-full bg-blue-600/10 mix-blend-screen blur-[100px] sm:blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.15)]"
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-300">
            The Future of Remote Work
          </span>
        </motion.div>

        {/* Massive Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.2 }}
          className="max-w-4xl font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl leading-[1.1]"
          dangerouslySetInnerHTML={{ __html: hero.headline }}
        />

        {/* Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.3 }}
          className="mt-8 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-300 px-4 sm:px-0 font-medium"
        >
          {hero.subheadline}
        </motion.p>

        {/* Premium CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.4 }}
          className="mt-12 flex flex-col w-full sm:w-auto sm:flex-row items-center gap-4 sm:gap-6 px-4 sm:px-0"
        >
          <Link 
            to="/marketplace" 
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm sm:text-base font-bold text-slate-900 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
            {hero.ctaText}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            to="/community" 
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm sm:text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            <Globe2 className="h-5 w-5 text-indigo-400" />
            Join our Community
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative Bottom Gradient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
    </section>
  )
}
