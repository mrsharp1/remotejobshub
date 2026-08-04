import React from 'react'
import { motion } from 'framer-motion'
import { Target, Globe2 } from 'lucide-react'
import { useAboutContent } from '@/services/cms/cms.store'

export const CompanyStory: React.FC = () => {
  const { story } = useAboutContent()
  return (
    <section className="relative overflow-hidden bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl" dangerouslySetInnerHTML={{ __html: story.heading }} />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: story.content }} />
        </div>

        {/* Alternating Layout 1 */}
        <div className="grid items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="order-2 md:order-1"
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Target className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="mb-4 font-heading text-3xl font-bold text-slate-900 dark:text-white">
              The Wild West of Account Trading
            </h3>
            <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Before RJH, trading accounts meant risking capital on shady forums and unverified Telegram groups. Scams were rampant. Buyers had no protection, and legitimate sellers struggled to find buyers who would trust them.
            </p>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              We decided it was time to bring Wall Street-level security to the gig economy.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="order-1 md:order-2"
          >
            <div className="relative aspect-square overflow-hidden rounded-[40px] bg-slate-200 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                alt="Data Security"
                className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Alternating Layout 2 */}
        <div className="mt-32 grid items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="relative aspect-square overflow-hidden rounded-[40px] bg-slate-200 dark:bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                alt="Global Team"
                className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Globe2 className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="mb-4 font-heading text-3xl font-bold text-slate-900 dark:text-white">
              A Global Financial Infrastructure
            </h3>
            <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Today, we operate in over 80 countries. We built a proprietary escrow engine that holds funds securely. We integrated AI risk analysis to flag suspicious IP behavior before a transaction even begins.
            </p>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              We aren't just a classifieds board. We are the trusted intermediary that guarantees peace of mind for both sides of the transaction.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
