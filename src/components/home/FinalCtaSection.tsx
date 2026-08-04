import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springs.gentle}
          className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 bg-slate-900/40 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl md:p-24"
        >
          {/* Gradients */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]"></div>
          <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]"></div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-6 font-heading text-4xl sm:text-5xl font-black leading-tight text-white md:text-7xl">
              Ready to accelerate <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                your career?
              </span>
            </h2>
            <p className="mb-12 text-base sm:text-xl font-medium text-slate-400 px-2 sm:px-0">
              Join the world's most secure marketplace for established remote work accounts.
              Skip the grind. Start earning today.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/marketplace"
                className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 sm:py-5 text-base sm:text-lg font-bold text-slate-950 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 translate-y-full bg-slate-100 transition-transform duration-300 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-2">
                  Browse Marketplace
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                to="/register"
                className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-8 py-4 sm:py-5 text-base sm:text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                Create Free Account
              </Link>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Escrow Vault Protected
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                Jumio KYC Verified
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
