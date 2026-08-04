import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Banknote, Fingerprint, BrainCircuit, Activity } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'

export const FaqTrust: React.FC = () => {
  const { globalStats } = useCMSStore()

  const cards = [
    {
      icon: ShieldCheck,
      title: 'Escrow Protection',
      desc: 'Buyer funds are locked inside our secure platform escrow vault, and only released once credential handover is validated.',
      gradient: 'from-emerald-500/20 to-emerald-500/0',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Banknote,
      title: 'Money Back Guarantee',
      desc: 'If listing verifications fail or credentials are not supplied, buyer deposits are returned immediately.',
      gradient: 'from-blue-500/20 to-blue-500/0',
      iconColor: 'text-blue-500',
    },
    {
      icon: Fingerprint,
      title: 'KYC Verification',
      desc: 'Sellers must pass photo liveness checks and government ID validation to listing products.',
      gradient: 'from-violet-500/20 to-violet-500/0',
      iconColor: 'text-violet-500',
    },
    {
      icon: BrainCircuit,
      title: 'AI Fraud Detection',
      desc: 'Real-time security analytics scan platform logs and conversations to preemptively flag scammers.',
      gradient: 'from-amber-500/20 to-amber-500/0',
      iconColor: 'text-amber-500',
    },
    {
      icon: Activity,
      title: '24/7 Monitoring',
      desc: 'Neutral operations desks monitor transactions around the clock to assist verification and dispute processes.',
      gradient: 'from-rose-500/20 to-rose-500/0',
      iconColor: 'text-rose-500',
    },
  ]

  return (
    <section className="bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            A secure foundation
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Learn why {globalStats.users} members rely on Remote Jobs Hub to execute digital account deals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card group relative overflow-hidden p-8"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
                  <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{card.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
