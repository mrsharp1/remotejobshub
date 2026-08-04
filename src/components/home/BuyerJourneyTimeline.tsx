import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus,
  MailCheck,
  Search,
  CreditCard,
  Lock,
  Users,
  MessageSquare,
  Key,
  ShieldCheck,
  Briefcase
} from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const steps = [
  { id: 1, title: 'Create Account', icon: UserPlus, description: 'Sign up for free and complete your basic profile.' },
  { id: 2, title: 'Verify Email', icon: MailCheck, description: 'Confirm your email to unlock marketplace access.' },
  { id: 3, title: 'Browse Marketplace', icon: Search, description: 'Filter through hundreds of verified, revenue-generating accounts.' },
  { id: 4, title: 'Purchase', icon: CreditCard, description: 'Secure your desired account using our encrypted checkout.' },
  { id: 5, title: 'Escrow', icon: Lock, description: 'Funds are held securely. The seller cannot access them yet.' },
  { id: 6, title: 'Batch Assignment', icon: Users, description: 'Our support team creates a secure transition channel.' },
  { id: 7, title: 'Private Community', icon: MessageSquare, description: 'Join the buyer-only Telegram for networking and tips.' },
  { id: 8, title: 'Receive Account', icon: Key, description: 'Seller transfers all credentials and ownership rights to you.' },
  { id: 9, title: 'VPN Setup', icon: ShieldCheck, description: 'Follow our strict guides to secure the account from suspension.' },
  { id: 10, title: 'Start Earning', icon: Briefcase, description: 'Confirm delivery, release escrow, and start working immediately.' },
]

export const BuyerJourneyTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 sm:mb-20 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            The Buyer Journey
          </h2>
          <p className="mt-6 text-base sm:text-lg font-medium text-slate-400 max-w-2xl mx-auto px-2 sm:px-0">
            A seamless, secure, 10-step process from sign up to earning.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-16">
          {/* Timeline Selector */}
          <div className="mb-12 flex-1 lg:mb-0 relative">
            <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-white/5 hidden lg:block" />
            <div className="flex overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0 hide-scrollbar space-x-4 lg:space-x-0 lg:space-y-2">
              {steps.map((step) => {
                const isActive = activeStep === step.id
                const isPassed = activeStep > step.id
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`group relative flex flex-shrink-0 items-center gap-4 rounded-2xl p-4 text-left transition-all lg:w-full ${
                      isActive ? 'bg-slate-900/60 shadow-xl border border-white/5 backdrop-blur-md' : 'hover:bg-slate-900/40 border border-transparent'
                    }`}
                  >
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                          : isPassed
                          ? 'border-slate-700 bg-slate-800 text-slate-400'
                          : 'border-white/5 bg-slate-900/50 text-slate-600'
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="hidden lg:block">
                      <p className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {step.id}. {step.title}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Step Content */}
          <div className="flex-1 lg:pt-10">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={springs.gentle}
                  className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-10 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="mb-6 sm:mb-8 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 shadow-inner border border-indigo-500/20">
                    {React.createElement(steps[activeStep - 1].icon, { className: 'h-8 w-8 sm:h-10 sm:w-10' })}
                  </div>
                  <h3 className="mb-4 font-heading text-2xl sm:text-3xl font-bold text-white">
                    {steps[activeStep - 1].title}
                  </h3>
                  <p className="text-base sm:text-xl font-medium leading-relaxed text-slate-400">
                    {steps[activeStep - 1].description}
                  </p>
                  
                  {/* Decorative Elements */}
                  <div className="mt-12 h-2 w-full rounded-full bg-slate-800/50 overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(activeStep / steps.length) * 100}%` }}
                      transition={springs.gentle}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                  <div className="mt-4 flex justify-between text-sm font-bold text-slate-500">
                    <span>Step {activeStep} of {steps.length}</span>
                    <span>{Math.round((activeStep / steps.length) * 100)}% Journey Completed</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
