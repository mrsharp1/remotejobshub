import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Banknote, Fingerprint, BrainCircuit, Headphones } from 'lucide-react'

const ContactTrustComponent: React.FC = () => {
  const cards = [
    {
      icon: ShieldCheck,
      title: 'Escrow Protection',
      desc: 'Buyer funds are held in a secure, multi-signature vault and only released once account handover is verified.',
      gradient: 'from-emerald-500/20 to-emerald-500/0',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Banknote,
      title: 'Money Back Guarantee',
      desc: 'If a seller fails to supply credentials or does not pass verification checks, funds are returned immediately.',
      gradient: 'from-blue-500/20 to-blue-500/0',
      iconColor: 'text-blue-500',
    },
    {
      icon: Fingerprint,
      title: 'KYC Verification',
      desc: 'Sellers must undergo government ID check and liveness screening before listing to guarantee identity accountability.',
      gradient: 'from-violet-500/20 to-violet-500/0',
      iconColor: 'text-violet-500',
    },
    {
      icon: BrainCircuit,
      title: 'AI Fraud Detection',
      desc: 'Real-time message logging and behavioral threat intelligence filters prevent scammers from entering deal tables.',
      gradient: 'from-amber-500/20 to-amber-500/0',
      iconColor: 'text-amber-500',
    },
    {
      icon: Headphones,
      title: '24/7 Human SLA',
      desc: 'Our dispute desk is manned around the clock. We resolve disputes and verifications in under 12 hours.',
      gradient: 'from-rose-500/20 to-rose-500/0',
      iconColor: 'text-rose-500',
    },
  ]

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Why professional operators trust us
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            We are built to secure high-value transaction pipelines. Here is the protection backing every single ticket.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
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

export const ContactTrust = React.memo(ContactTrustComponent)
