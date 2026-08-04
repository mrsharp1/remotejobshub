import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Search } from 'lucide-react'

// Note: In production this should be fetched from the CMS
const faqs = [
  {
    question: 'How does the Escrow Protection actually work?',
    answer: 'When a buyer purchases an account, their funds are held in our secure escrow vault. The seller is notified to hand over the credentials. The funds are only released to the seller once the buyer has verified the account matches the description and has successfully secured it. This eliminates 100% of chargeback and non-delivery scams.',
  },
  {
    question: 'Are there really no fees for sellers?',
    answer: 'Correct. Sellers are never charged to list or sell their digital assets on Remote Jobs Hub. You keep 100% of your asking price. The escrow service fee is paid entirely by the buyer during checkout.',
  },
  {
    question: 'How strict is the KYC verification for sellers?',
    answer: 'Extremely strict. To get the Verified Seller Badge, users must pass government ID verification, a biometric liveness check, and a background risk analysis. This ensures that every seller on our platform is a real, accountable individual.',
  },
  {
    question: 'What happens if a dispute arises during handover?',
    answer: 'If there is an issue, our neutral 24/7 dispute resolution team steps in. They review all chat logs and evidence provided within our platform. Because all communication happens on-site and funds are locked in escrow, we can typically resolve disputes fairly within 12-24 hours.',
  },
  {
    question: 'What is the AI Scam Detection?',
    answer: 'Our proprietary AI engine continuously monitors platform activity, chat messages, and IP behaviors in real-time. It automatically flags and bans malicious actors before they can interact with legitimate buyers and sellers.',
  },
]

export const PricingFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-6 text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about billing, security, and the escrow process.
          </p>
        </div>

        <div className="mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search questions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-base font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`premium-card overflow-hidden transition-colors ${isOpen ? 'border-indigo-500/50 dark:border-indigo-500/30' : ''}`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="font-heading text-lg font-bold text-slate-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
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
                      <div className="px-6 pb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No results found for "{searchQuery}". Please contact support.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
