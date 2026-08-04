import React from 'react'
import { motion } from 'framer-motion'
import { springs } from '@/lib/framer-physics'

export const CompanyPhilosophy: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-24 sm:py-32">
      {/* Decorative gradient blur */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] rounded-full bg-indigo-500/10 blur-[100px] sm:blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ ...springs.gentle }}
          className="text-center"
        >
          <h2 className="mb-6 font-heading text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Philosophy
          </h2>
          <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-12 sm:mb-16" />
        </motion.div>

        <div className="space-y-12 sm:space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...springs.gentle, delay: 0.1 }}
            className="flex flex-col gap-4 sm:flex-row sm:gap-12 md:gap-16 items-start"
          >
            <div className="shrink-0 sm:w-1/3">
              <h3 className="font-heading text-xl font-bold text-white sm:text-2xl text-indigo-400">
                Why We Exist
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-loose">
                Remote Jobs Hub was born out of a stark realization: the global digital economy is booming, yet talented professionals and ambitious buyers are constantly hindered by geography, friction, and lack of trust. We exist to dismantle those barriers. We believe that talent is equally distributed globally, but opportunity is not—and we are here to bridge that gap.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...springs.gentle, delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row sm:gap-12 md:gap-16 items-start"
          >
            <div className="shrink-0 sm:w-1/3">
              <h3 className="font-heading text-xl font-bold text-white sm:text-2xl text-emerald-400">
                The Problem We Solve
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-loose">
                Trading digital assets and remote work accounts has historically been the Wild West. Buyers faced scams, while legitimate sellers struggled to prove their authenticity. By introducing institutional-grade escrow, mandatory KYC verifications, and AI-driven risk intelligence, we have replaced anxiety with absolute certainty.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...springs.gentle, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row sm:gap-12 md:gap-16 items-start"
          >
            <div className="shrink-0 sm:w-1/3">
              <h3 className="font-heading text-xl font-bold text-white sm:text-2xl text-blue-400">
                Our Vision & Trust
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-loose">
                We envision a borderless economy where a developer in Lagos, a designer in Manila, and an agency in London can transact seamlessly with absolute confidence. Trust isn't just a buzzword for us; it is the fundamental infrastructure of our entire platform. When you use Remote Jobs Hub, you are participating in the safest, most transparent marketplace on the internet.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
