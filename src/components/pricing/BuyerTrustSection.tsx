import React from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, MessageCircle, BookOpen, Globe, CreditCard } from 'lucide-react'

const benefits = [
  {
    icon: Lock,
    title: 'Buyer Protection',
    description: "Your payment goes through the platform's protected transaction process while the agreed account handoff is being completed."
  },
  {
    icon: ShieldCheck,
    title: 'Verified Sellers',
    description: "We use the platform's existing seller verification process to help customers identify verified sellers."
  },
  {
    icon: MessageCircle,
    title: 'Support When You Need It',
    description: "Get assistance through our available support channels, including WhatsApp, Telegram, email and in-app support."
  },
  {
    icon: BookOpen,
    title: 'Beginner Guidance',
    description: "New to these platforms? We provide guidance and practical information to help you understand the process before getting started."
  },
  {
    icon: Globe,
    title: 'Remote Work Opportunities',
    description: "Browse available account opportunities connected to remote work and AI-related platforms such as Outlier and Handshake AI, subject to platform eligibility and availability."
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: "Payments continue to use the platform's existing payment infrastructure and buyer-protection workflow."
  }
]

export const BuyerTrustSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white sm:text-4xl"
          >
            What You Get With Remote Jobs Hub
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-slate-600 dark:text-slate-400"
          >
            A secure, transparent, and guided experience for remote work opportunities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
