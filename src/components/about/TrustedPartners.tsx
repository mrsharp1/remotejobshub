import React from 'react'
import { motion } from 'framer-motion'
import { Handshake } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const TrustedPartners: React.FC = () => {
  const partners = [
    {
      id: 'temu',
      name: 'Temu',
      role: 'Partner / business collaboration',
      description: 'Business partner and technology collaborator.',
      logoUrl: '/images/partners/temu.png',
      logoStyle: 'object-contain h-12 w-12',
    },
    {
      id: 'paystack',
      name: 'Paystack',
      role: 'Payment Provider',
      description: 'Secure payment processing for transactions on Remote Jobs Hub.',
      logoUrl: '/images/partners/paystack.png',
      logoStyle: 'object-contain h-10 w-auto rounded-md',
    }
  ]

  return (
    <section className="bg-slate-950 px-4 py-16 sm:py-24 border-t border-white/5">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springs.gentle}
          className="mb-12 text-center sm:mb-16"
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
            <Handshake className="h-6 w-6" />
          </div>
          <h2 className="mb-4 font-heading text-3xl font-bold text-white sm:text-4xl">
            Trusted By & Partners
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-400">
            We collaborate with established industry leaders to ensure a secure, reliable, and premium experience.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springs.gentle, delay: idx * 0.1 }}
              className="flex flex-col items-center sm:items-start sm:flex-row gap-6 rounded-2xl border border-white/5 bg-slate-900/40 p-6 sm:p-8 hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white/5 p-3 shadow-inner sm:h-24 sm:w-24 border border-white/10">
                <img 
                  src={partner.logoUrl} 
                  alt={`${partner.name} logo`} 
                  className={partner.logoStyle}
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="mb-1 font-heading text-xl font-bold text-white">{partner.name}</h3>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">{partner.role}</p>
                <p className="text-sm leading-relaxed text-slate-300">
                  {partner.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
