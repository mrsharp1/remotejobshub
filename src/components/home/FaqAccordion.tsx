import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const faqs = [
  {
    question: 'How does the escrow system protect my money?',
    answer: 'When you purchase an account, your funds are deposited into a secure, third-party audited escrow account. The funds are only released to the seller after they have transferred all credentials to you, and you have confirmed full access and ownership. If the seller fails to deliver, you receive a full refund immediately.'
  },
  {
    question: 'How do you verify the revenue of listings?',
    answer: 'Our compliance team conducts a rigorous 3-step KYC verification process. Sellers must provide live video verification, government ID, and screen-share proof of their platform dashboard to verify all historical earnings, feedback, and account standing.'
  },
  {
    question: 'What happens if an account gets suspended after purchase?',
    answer: 'We offer a 14-day Money-Back Guarantee for any account suspensions that are not the fault of the buyer. We also provide a post-purchase transition guide to help you safely log in and avoid triggering platform security algorithms.'
  },
  {
    question: 'How quickly can I start earning?',
    answer: 'Most account transfers are completed within 24-48 hours. Once you have secured the account, you can begin bidding on jobs and withdrawing revenue immediately, leveraging the account\'s existing reputation and history.'
  }
]

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 sm:mb-20 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-3xl sm:rounded-[2rem] border transition-all duration-500 backdrop-blur-md ${
                  isOpen ? 'border-white/10 bg-slate-900/60 shadow-2xl' : 'border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="group flex w-full items-center justify-between p-6 sm:p-8 text-left"
                >
                  <span className="font-heading text-lg sm:text-xl font-bold text-white pr-4 sm:pr-8 transition-colors group-hover:text-indigo-300">
                    {faq.question}
                  </span>
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isOpen ? 'rotate-180 border-indigo-500/30 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5 bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                    <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={springs.snappy}
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-base sm:text-lg font-medium leading-relaxed text-slate-400">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
