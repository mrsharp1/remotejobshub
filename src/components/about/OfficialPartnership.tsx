import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const OfficialPartnership: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:py-28">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-orange-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springs.gentle}
          className="mb-12"
        >
          <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4" />
            Official Partners & Technology Providers
          </div>
          <h2 className="mb-6 font-heading text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Official Partnership with <br className="hidden sm:block" />
            <span className="text-indigo-400">Remote Jobs Hub</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Committed to delivering secure, transparent, and reliable access to the global remote work ecosystem through trusted collaboration.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
        >
          <div className="mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-white p-4 shadow-inner sm:h-40 sm:w-40">
            <img 
              src="/images/partners/temu.png" 
              alt="Temu Partner Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          
          <h3 className="mb-2 font-heading text-2xl font-bold text-white">Temu</h3>
          <p className="mb-6 text-sm font-medium text-slate-400">Partner / business collaboration.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-wider text-emerald-400 sm:text-sm">
            <span>Verified Sellers</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Secure Payments</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Buyer Protection</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
