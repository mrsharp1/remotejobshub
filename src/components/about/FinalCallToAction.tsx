import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const FinalCallToAction: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-32 sm:py-48">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute left-[10%] top-[20%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-indigo-600/20 mix-blend-screen blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute right-[10%] bottom-[10%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-blue-600/20 mix-blend-screen blur-[120px]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ ...springs.gentle }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
              Ready to elevate your career?
            </span>
          </div>

          <h2 className="mb-8 font-heading text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            Start Your Journey <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">With Absolute Trust.</span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-2xl text-base sm:text-xl leading-relaxed text-slate-400">
            Join thousands of verified professionals transacting safely across borders. Zero upfront fees. Instant verification. Institutional-grade security.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link
            to="/register"
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-base sm:text-lg font-bold text-slate-900 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
            Become a Seller
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/marketplace"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base sm:text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            Browse Opportunities
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-medium text-slate-400"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            100% Escrow Protection
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Bank-Grade Encryption
          </div>
        </motion.div>
      </div>
    </section>
  )
}
