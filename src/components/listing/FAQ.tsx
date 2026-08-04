import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqs = [
    {
      q: 'How does the account handoff work?',
      a: 'Once a purchase is agreed upon, the funds are held securely in the Remote Jobs Hub Escrow vault. The seller uploads credentials, our team verifies them, and guides both parties through the account ownership transfer.',
    },
    {
      q: 'Are the accounts verified?',
      a: 'Yes, all listings require verification details. Verified sellers also pass government ID checks to earn trust credentials.',
    },
    {
      q: 'What if the account fails?',
      a: 'If the account is not successfully transferred or does not match the description within the escrow period, the buyer receives a full refund automatically.',
    },
    {
      q: 'Can the seller recover the account?',
      a: 'We secure the primary email and enforce 2FA transfers. Our system ensures the seller completely relinquishes access before Escrow is released.',
    },
    {
      q: 'How long before the seller gets paid?',
      a: 'Once you (the buyer) verify you have full access to the account and it matches the description, you click "Accept" to release the funds. If no action is taken, funds auto-release after the 3-day inspection period.',
    },
  ]

  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/30 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs font-medium text-slate-400">Everything you need to know about the buying process</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50 transition-colors hover:bg-slate-900"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-bold text-white transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-indigo-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 px-6 pb-6 pt-2 text-sm leading-relaxed text-slate-400"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
