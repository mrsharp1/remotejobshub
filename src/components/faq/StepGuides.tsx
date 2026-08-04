import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const guides = [
  {
    id: 'escrow',
    title: 'How Escrow Works',
    steps: [
      { num: '01', title: 'Fund Deposit', desc: 'Buyer deposits the listing cost into our secure vault.' },
      { num: '02', title: 'Credentials Handover', desc: 'Seller securely uploads account credentials inside the platform.' },
      { num: '03', title: 'Buyer Verification', desc: 'Buyer has a 24-hour window to inspect the account details.' },
      { num: '04', title: 'Funds Released', desc: 'Once confirmed, our Escrow Engine payouts the seller wallet.' },
    ],
  },
  {
    id: 'buying',
    title: 'Buying an Account',
    steps: [
      { num: '01', title: 'Browse & Vetting', desc: 'Search active verifications and start chat threads with sellers.' },
      { num: '02', title: 'Vault payment', desc: 'Fund the contract using card, Paystack, or your buyer wallet.' },
      { num: '03', title: 'Credential Inspect', desc: 'Audit the account and update contact emails/passwords.' },
      { num: '04', title: 'Release escrow', desc: 'Complete order to close contract and unlock seller payment.' },
    ],
  },
  {
    id: 'selling',
    title: 'Selling an Account',
    steps: [
      { num: '01', title: 'Complete KYC', desc: 'Complete ID and selfie checks to receive your verified badge.' },
      { num: '02', title: 'Listing review', desc: 'Create the seller studio listing and await admin moderation.' },
      { num: '03', title: 'Buyer payment', desc: 'Await email confirmation that the buyer has funded the escrow vault.' },
      { num: '04', title: 'Deliver & Payout', desc: 'Deliver credentials and receive payment inside your seller wallet.' },
    ],
  },
]

export const StepGuides: React.FC = () => {
  const [activeTab, setActiveTab] = useState('escrow')

  return (
    <section className="bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Step-by-Step Tutorials
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Select a guide to trace transactional milestones on our platform.
          </p>
        </div>

        {/* Tab selector */}
        <div className="mb-12 flex justify-center gap-4">
          {guides.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveTab(g.id)}
              className={`rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
                activeTab === g.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>

        {/* Timeline block */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-4"
            >
              {guides
                .find((g) => g.id === activeTab)
                ?.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="premium-card relative flex flex-col justify-between p-8"
                  >
                    <div>
                      <span className="font-mono text-3xl font-black text-indigo-500/30">
                        {step.num}
                      </span>
                      <h4 className="mt-4 mb-2 font-heading text-lg font-bold text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
