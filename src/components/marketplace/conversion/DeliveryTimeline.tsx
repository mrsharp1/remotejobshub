import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Key, MessageSquare } from 'lucide-react'

const steps = [
  {
    title: 'Secure Escrow Funding',
    description: 'Your payment is safely held by Remote Jobs Hub until the transfer is complete.',
    icon: ShieldCheck,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/20',
  },
  {
    title: 'Account Credentials Transfer',
    description: 'The seller securely hands over the email, password, and recovery info.',
    icon: Key,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
  },
  {
    title: 'Verify & Secure Asset',
    description: 'You log in, verify the account matches the listing, and secure it with your 2FA.',
    icon: CheckCircle2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  {
    title: 'Funds Released & Support',
    description: 'Only after you confirm, the funds are released. You are backed by our guarantee.',
    icon: MessageSquare,
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
  },
]

export const DeliveryTimeline: React.FC = () => {
  return (
    <div className="space-y-6 rounded-[24px] border border-white/5 bg-slate-900/40 p-8 shadow-xl backdrop-blur-xl">
      <div className="space-y-1">
        <h3 className="font-heading text-2xl font-black text-white">
          Secure Transfer Process
        </h3>
        <p className="text-sm font-medium text-slate-500">
          How your purchase is protected from start to finish
        </p>
      </div>

      <div className="relative pt-4">
        {/* Vertical line */}
        <div className="absolute left-[21px] top-4 h-[calc(100%-3rem)] w-0.5 rounded-full bg-slate-800" />

        <div className="space-y-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex gap-6"
            >
              <div
                className={`relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/5 shadow-xl backdrop-blur-sm ${step.bg}`}
              >
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>
              <div className="pt-2">
                <h4 className="font-heading text-lg font-bold text-white">
                  {step.title}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
