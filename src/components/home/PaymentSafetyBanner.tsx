import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const PaymentSafetyBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 border-b border-white/5">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springs.gentle}
          className="mb-8"
        >
          <div className="mx-auto inline-flex max-w-full items-center justify-center gap-2.5 sm:gap-3 rounded-2xl sm:rounded-full border border-indigo-400/40 bg-indigo-500/20 px-4 py-2 sm:px-6 sm:py-2.5 text-sm md:text-base font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-indigo-400 shrink-0" />
            <span className="text-center leading-snug">Remote Jobs Hub Payment Safety</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          {/* Logos Row */}
          <div className="flex flex-row items-center justify-center gap-6 sm:gap-12 mb-8 w-full">
            <div className="flex h-20 w-20 sm:h-32 sm:w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-inner">
              <img 
                src="/images/partners/temu.png" 
                alt="Temu Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            
            <div className="h-12 w-px bg-white/10 hidden sm:block" />
            
            <div className="flex h-20 w-20 sm:h-32 sm:w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-inner">
              <img 
                src="/images/partners/paystack.png" 
                alt="Paystack Logo" 
                className="h-auto w-full object-contain rounded-md"
              />
            </div>
          </div>

          {/* Text Rows */}
          <div className="flex flex-col items-center gap-3 mb-8 w-full text-center">
            <p className="font-heading text-lg sm:text-2xl font-bold text-white">
              Powered by Temu Marketplace
            </p>
            <p className="font-heading text-lg sm:text-2xl font-bold text-white">
              Secured by Paystack
            </p>
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-wider text-emerald-400 sm:text-sm">
            <span>Protected Payments</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Escrow</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Verified Sellers</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
