import React from 'react'
import { motion } from 'framer-motion'
import { Lock, CreditCard, Shield, RefreshCw, CheckCircle, Wallet } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const MarketplaceHighlights: React.FC = () => {
  const steps = [
    {
      icon: CreditCard,
      title: '1. You Pay',
      desc: "Your payment enters the platform's protected transaction flow.",
    },
    {
      icon: Shield,
      title: '2. Funds Are Secured',
      desc: 'The seller does not immediately receive the payment.',
    },
    {
      icon: RefreshCw,
      title: '3. Account Handoff',
      desc: 'The seller completes the agreed account transfer.',
    },
    {
      icon: CheckCircle,
      title: '4. You Verify',
      desc: 'You confirm that the account handoff has been successfully completed.',
    },
    {
      icon: Wallet,
      title: '5. Seller Gets Paid',
      desc: "The transaction proceeds according to the platform's existing payment rules.",
    },
  ]

  return (
    <div className="mb-10 w-full overflow-hidden rounded-[24px] border border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950/90 shadow-2xl backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Side: Header & Context */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/5 p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-400 backdrop-blur-md">
              <Lock className="h-4 w-4" />
              ESCROW PROTECTED
            </div>
            
            <h2 className="mb-4 font-heading text-3xl font-black text-white leading-tight">
              Pay with confidence. <br />
              <span className="text-indigo-400">Your funds stay protected.</span>
            </h2>
            
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              When you purchase an account, your payment is securely held through the platform's payment protection process while the seller completes the account handoff. The seller does not receive the funds immediately.
            </p>
            
            <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-5">
              <p className="text-sm font-medium leading-relaxed text-indigo-200">
                You don't have to simply trust the seller. Remote Jobs Hub provides a structured transaction process designed to protect the payment while the account handoff is being completed.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The 5 Steps */}
        <div className="lg:col-span-8 p-8 lg:p-10 relative bg-slate-950/50">
          <div className="absolute top-0 right-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="mb-8 font-heading text-xl font-bold text-white">How it works:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...springs.gentle, delay: idx * 0.1 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-white/5 text-indigo-400 shadow-inner">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base mb-1">{step.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
