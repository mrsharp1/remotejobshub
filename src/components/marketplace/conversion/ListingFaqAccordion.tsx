import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Search } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

interface FaqItem {
  question: string
  answer: string
}

// Default FAQs for all listings
const defaultFaqs: FaqItem[] = [
  {
    question: 'How does the Escrow process work?',
    answer:
      'When you purchase an asset, your funds are securely held in Escrow. The seller does not receive the funds until you have full access to the account and verify everything matches the listing description.',
  },
  {
    question: 'What happens if the account is recovered by the seller?',
    answer:
      'We require sellers to undergo strict KYC verification and provide Original Email access where applicable. If a recovery occurs during the warranty period, our Trust & Safety team will intervene and refund you via our Money-Back Guarantee.',
  },
  {
    question: 'How long does the transfer process take?',
    answer:
      'Most transfers are completed within 12-48 hours. Enterprise or highly secure accounts may take slightly longer if additional platform verification (like changing phone numbers) is required.',
  },
  {
    question: 'Can I change the email and password immediately?',
    answer:
      'Yes. Once the seller provides the credentials in the secure transfer chat, you are expected to immediately change the email, password, and setup your own 2FA before releasing the escrow funds.',
  },
]

export const ListingFaqAccordion: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return defaultFaqs
    const query = searchQuery.toLowerCase()
    return defaultFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
            <HelpCircle className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-heading text-2xl font-black text-white">
              Buyer Questions
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Frequently Asked Questions
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-800/50 py-2 pl-9 pr-4 text-sm font-semibold text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500 md:w-64"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {filteredFaqs.length === 0 ? (
          <div className="py-8 text-center text-sm font-semibold text-slate-500">
            No FAQs found matching "{searchQuery}"
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-indigo-500/30 bg-slate-800/80 shadow-[0_0_20px_-5px_rgba(79,70,229,0.2)]'
                    : 'border-white/5 bg-slate-800/30 hover:bg-slate-800/50'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span
                    className={`font-bold transition-colors ${
                      isOpen ? 'text-indigo-300' : 'text-slate-200'
                    }`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={springs.gentle}
                    >
                      <div className="border-t border-white/5 px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
