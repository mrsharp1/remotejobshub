import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator } from 'lucide-react'

export const SavingsCalculator: React.FC = () => {
  const [dealVolume, setDealVolume] = useState<number>(5000000)
  
  // Traditional escrow/marketplace fees usually sit around 10-15%
  const traditionalFee = dealVolume * 0.12
  // Our platform fee is effectively lower (assuming 5% base or capped fee structure, for example purposes let's use 5%)
  const ourFee = dealVolume * 0.05
  const savings = traditionalFee - ourFee

  return (
    <section className="bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[40px] bg-indigo-600 p-10 text-white shadow-2xl md:p-16"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-[60px]" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                <Calculator className="h-8 w-8" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-black">ROI Calculator</h2>
                <p className="text-indigo-200">See how much you save with our transparent fees</p>
              </div>
            </div>

            <div className="mb-12">
              <label className="mb-4 block text-lg font-bold">
                Estimated Monthly Transaction Volume: <span className="text-3xl font-black text-indigo-100">₦{dealVolume.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="1000000"
                max="50000000"
                step="500000"
                value={dealVolume}
                onChange={(e) => setDealVolume(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-indigo-900/50 outline-none"
              />
              <div className="mt-2 flex justify-between text-sm font-medium text-indigo-300">
                <span>₦1M</span>
                <span>₦50M+</span>
              </div>
            </div>

            <div className="grid gap-6 rounded-3xl bg-indigo-900/40 p-8 backdrop-blur-sm md:grid-cols-3 md:divide-x md:divide-indigo-500/30">
              <div className="text-center">
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-indigo-300">Traditional Fees</p>
                <p className="font-heading text-3xl font-bold text-slate-400 line-through">
                  ₦{traditionalFee.toLocaleString()}
                </p>
              </div>
              <div className="text-center md:px-6">
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-indigo-300">Our Platform</p>
                <p className="font-heading text-3xl font-bold text-white">
                  ₦{ourFee.toLocaleString()}
                </p>
              </div>
              <div className="text-center md:pl-6">
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-emerald-400">Total Savings</p>
                <p className="font-heading text-4xl font-black text-emerald-400">
                  +₦{savings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
