import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Lock, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { springs } from '@/lib/framer-physics'

interface MarketplaceHeroProps {
  onBrowseClick: () => void
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  onBrowseClick,
}) => {
  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-slate-950 py-24 md:py-32">
      {/* Decorative Glow Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-0 top-1/2 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
          className="mx-auto flex flex-wrap items-center justify-center gap-3"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300 backdrop-blur-md">
            <Lock className="h-3.5 w-3.5" />
            Escrow Vault Protected
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            Jumio KYC Verified
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md">
            <Activity className="h-3.5 w-3.5" />
            Live Marketplace
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mx-auto max-w-4xl font-heading text-[2.5rem] font-black leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Discover Premium <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Remote Work Assets
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.2 }}
          className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-400 sm:text-xl"
        >
          Browse exclusive, revenue-generating profiles across Outlier, Scale AI, and DataAnnotation. 
          Secured by military-grade escrow and AI fraud detection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row"
        >
          <button
            onClick={onBrowseClick}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-950 transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] sm:w-auto"
          >
            <div className="absolute inset-0 translate-y-full bg-slate-100 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center gap-2">
              Browse Listings
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <Link
            to="/register"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-8 py-4 text-base font-bold text-slate-300 backdrop-blur-md transition-all hover:border-white/20 hover:bg-slate-800 hover:text-white sm:w-auto"
          >
            Become a Seller
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
