import React from 'react'
import { motion } from 'framer-motion'


export const AwardsRecognition: React.FC = () => {
  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Standards & Compliance
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            We don't just self-regulate. Our infrastructure is audited by industry-leading security firms to guarantee your peace of mind.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { image: '/images/compliance/soc2.png', title: 'SOC 2 Type II Compliant', desc: 'Independently audited for security, availability, processing integrity, confidentiality, and privacy.' },
            { image: '/images/compliance/iso27001.jpg', title: 'ISO 27001 Certified', desc: 'Internationally recognized standard for information security management systems.' },
            { image: '/images/compliance/pci-dss.jpg', title: 'PCI-DSS Level 1', desc: 'The highest level of payment data security standards, ensuring your financial information is never at risk.' },
          ].map((award, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="premium-card relative flex flex-col items-center overflow-hidden p-10 text-center"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/10 blur-[40px]" />
              <div className="relative z-10 mb-6 flex h-24 sm:h-28 items-center justify-center">
                <img src={award.image} alt={award.title} className="h-full w-auto object-contain rounded-xl shadow-sm border border-slate-200/20" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{award.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{award.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
