import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'

export const CommunityTelegram: React.FC = () => {
  const { globalStats } = useCMSStore()
  
  return (
    <section className="bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[40px] bg-sky-500 p-10 text-center shadow-2xl md:p-16"
        >
          {/* Abstract Background Elements */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-[60px]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-[60px]" />
          
          <div className="relative z-10 mx-auto max-w-2xl text-white">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white text-sky-500 shadow-xl">
              <MessageCircle className="h-10 w-10" fill="currentColor" />
            </div>
            <h2 className="mb-6 font-heading text-4xl font-black tracking-tight md:text-5xl">
              Join the Elite Network
            </h2>
            <p className="mb-10 text-lg font-medium text-sky-50 md:text-xl">
              Connect with {globalStats.users} verified buyers and sellers. Get real-time market insights, dispute resolution tips, and exclusive early access to premium listings.
            </p>
            <a
              href="https://t.me/+mm7Rk9WkcHc0ZTBk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-sky-600 shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              Join Official Telegram
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
