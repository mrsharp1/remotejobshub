import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ShieldCheck, Heart, UserX, HelpCircle, Briefcase } from 'lucide-react'

const guidelines = [
  {
    icon: Heart,
    title: 'Mutual Respect',
    desc: 'Harassment, hate speech, or derogatory remarks are strictly forbidden. Engage with others inside our community constructively and professionally.',
  },
  {
    icon: UserX,
    title: 'Zero Tolerance for Scams',
    desc: 'Attempting to bypass our secure escrow vault, posting deceptive listings, or sharing malicious off-platform links will result in an immediate and permanent ban.',
  },
  {
    icon: ShieldCheck,
    title: 'Strict Seller Verification',
    desc: 'Trading accounts requires a verified KYC profile. Sellers must verify their identities through standard biometric checks before initiating listing negotiations.',
  },
  {
    icon: HelpCircle,
    title: 'Reporting Infractions',
    desc: 'Spotted suspicious activity or an unvetted deal offer? Flag the message immediately or contact one of our official moderators to resolve it.',
  },
  {
    icon: Briefcase,
    title: 'Maintain Professionalism',
    desc: 'Ensure all marketplace offers, contract negotiations, and technical questions follow clean formatting guidelines to build general trust within the network.',
  },
]

export const CommunityGuidelines: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Community Guidelines
          </h2>
          <p className="mx-auto mt-6 text-lg text-slate-600 dark:text-slate-400">
            Our rules are strictly enforced to guarantee a secure, collaborative space for digital assets.
          </p>
        </div>

        <div className="space-y-4">
          {guidelines.map((g, idx) => {
            const isOpen = openIdx === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`premium-card overflow-hidden transition-colors ${isOpen ? 'border-violet-500/50 dark:border-violet-500/30' : ''}`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isOpen ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                      <g.icon className="h-5 w-5" />
                    </div>
                    <span className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                      {g.title}
                    </span>
                  </div>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-20 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        {g.desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
