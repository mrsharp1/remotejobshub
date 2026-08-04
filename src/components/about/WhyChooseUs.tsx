import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Fingerprint, Banknote, FileCheck, Headphones, Gavel } from 'lucide-react'

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: Banknote,
      title: 'Escrow Vault Protection',
      desc: 'Buyer funds are locked in a secure vault. Sellers only hand over credentials once payment is verified. No chargeback scams.',
    },
    {
      icon: ShieldAlert,
      title: 'AI Scam Detection',
      desc: 'Our proprietary engine scans messages, IP addresses, and behavioral patterns to ban malicious actors instantly.',
    },
    {
      icon: Fingerprint,
      title: 'Strict KYC Verification',
      desc: 'Sellers must pass government ID verification and liveness checks before they can list a single account.',
    },
    {
      icon: FileCheck,
      title: 'CMS Driven Marketplace',
      desc: 'Our platform is highly structured. Every listing is categorized, searchable, and standardized for easy evaluation.',
    },
    {
      icon: Gavel,
      title: 'Neutral Dispute Resolution',
      desc: 'If an issue arises during handover, our dedicated arbitration team steps in to resolve it fairly within 24 hours.',
    },
    {
      icon: Headphones,
      title: 'Lightning Fast Support',
      desc: 'Stop waiting weeks for a generic email reply. Our global support team is available around the clock to assist you.',
    },
  ]

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Why Choose Remote Jobs Hub
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            We didn't just build a marketplace. We built a fortress. Here is how we protect your money and your assets.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="premium-card relative flex flex-col p-8 transition-colors hover:border-indigo-500/50"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <r.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{r.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
