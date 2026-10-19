import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const PaymentSafetyBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-slate-950 px-4 pb-8 pt-12 sm:pb-12 sm:pt-16">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springs.gentle}
          className="mb-8"
        >
          <div className="mx-auto inline-flex max-w-full items-center justify-center gap-2.5 rounded-2xl border border-indigo-400/40 bg-indigo-500/20 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/10 backdrop-blur-md sm:gap-3 sm:rounded-full sm:px-6 sm:py-2.5 md:text-base">
            <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-400 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            <span className="text-center leading-snug">
              Remote Jobs Hub Payment Safety
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...springs.gentle, delay: 0.1 }}
          className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-white/5 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          {/* Paystack Logo */}
          <div className="mb-6 flex w-full items-center justify-center sm:mb-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-inner sm:h-32 sm:w-32 sm:rounded-3xl sm:p-4">
              <img
                src="/images/partners/paystack.png"
                alt="Paystack Logo"
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
          </div>

          {/* Text */}
          <div className="mb-6 w-full text-center sm:mb-8">
            <p className="font-heading text-lg font-bold text-white sm:text-2xl">
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
