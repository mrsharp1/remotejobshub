import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Fingerprint, SearchCheck } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const SecuritySection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-24 sm:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-sm font-bold text-rose-400 backdrop-blur-md">
              <ShieldAlert className="h-4 w-4" />
              Zero Tolerance Policy
            </div>
            <h2 className="mb-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              We eliminate the <br />
              <span className="text-slate-500">risk of online fraud.</span>
            </h2>
            <p className="mb-10 text-base sm:text-lg font-medium leading-relaxed text-slate-400 px-2 lg:px-0">
              Our military-grade escrow system ensures your funds are never released 
              to the seller until you have successfully logged in, changed all passwords, 
              and verified full ownership of the acquired asset.
            </p>

            <div className="space-y-6">
              <div className="group flex gap-4 rounded-2xl border border-transparent p-4 transition-all hover:border-white/5 hover:bg-slate-900/40 hover:shadow-xl hover:backdrop-blur-xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="mb-1 font-bold text-white">Identity Verification</h4>
                  <p className="text-sm font-medium text-slate-400">Jumio KYC requires government ID and live video selfies from every seller.</p>
                </div>
              </div>
              <div className="group flex gap-4 rounded-2xl border border-transparent p-4 transition-all hover:border-white/5 hover:bg-slate-900/40 hover:shadow-xl hover:backdrop-blur-xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                  <SearchCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="mb-1 font-bold text-white">AI Scam Detection</h4>
                  <p className="text-sm font-medium text-slate-400">Machine learning models flag suspicious listing behavior before it goes live.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Escrow Animation Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={springs.gentle}
              className="relative aspect-square w-full max-w-md mx-auto rounded-full border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-2xl flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500/30 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-b-2 border-purple-500/30 animate-spin-reverse-slow"></div>
              <div className="absolute inset-8 rounded-full border-l-2 border-emerald-500/20 animate-spin-slow"></div>
              
              <div className="relative z-10 text-center">
                <div className="mb-4 mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/20">
                  <ShieldAlert className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-black text-white">Escrow Secured</h3>
                <p className="mt-2 text-sm font-bold uppercase tracking-wider text-emerald-400">Funds Locked</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
