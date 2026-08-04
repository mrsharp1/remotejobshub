import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ShieldCheck, Zap, Globe2 } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'

export const TelegramPromo: React.FC = () => {
  const { globalStats } = useCMSStore()

  return (
    <section className="relative z-20 -mt-20 px-4 pb-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="overflow-hidden rounded-[40px] bg-white shadow-2xl dark:bg-slate-950 md:flex"
        >
          {/* Content Block */}
          <div className="p-10 md:w-1/2 md:p-16">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
              <MessageCircle className="h-8 w-8" fill="currentColor" />
            </div>
            <h2 className="mb-4 font-heading text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Official Telegram
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Connect with {globalStats.users} members. Instantly receive listing updates, fraud security warnings, and participate in peer-to-peer discussions.
            </p>
            
            <ul className="mb-10 space-y-4">
              <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-5 w-5 text-sky-500" />
                Verified Trading Discussions
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300">
                <Zap className="h-5 w-5 text-sky-500" />
                Real-time Listing Alerts
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300">
                <Globe2 className="h-5 w-5 text-sky-500" />
                Global Buyer/Seller Networking
              </li>
            </ul>

            <a
              href="https://t.me/+mm7Rk9WkcHc0ZTBk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-sky-500 px-8 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              Join Official Telegram
            </a>
          </div>

          {/* Image/Visual Block (Hidden on Mobile) */}
          <div className="relative hidden min-h-[400px] bg-slate-100 dark:bg-slate-900 md:block md:w-1/2">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-l" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
