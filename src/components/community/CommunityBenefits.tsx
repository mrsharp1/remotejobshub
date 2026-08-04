import React from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, ShieldAlert, Award, Bot, Info, MessageSquare } from 'lucide-react'

export const CommunityBenefits: React.FC = () => {
  const benefits = [
    {
      icon: HelpCircle,
      title: 'Marketplace Support',
      desc: 'Get immediate help with transactions, account verifications, and general platform inquiries from admins and community mentors.',
      gradient: 'from-violet-500/20 to-violet-500/0',
      iconColor: 'text-violet-500',
    },
    {
      icon: Info,
      title: 'Buying Advice',
      desc: 'Learn how to accurately value remote accounts, inspect profiles, and perform secure post-transfer handovers.',
      gradient: 'from-blue-500/20 to-blue-500/0',
      iconColor: 'text-blue-500',
    },
    {
      icon: ShieldAlert,
      title: 'Scam Awareness',
      desc: 'Stay informed with real-time reports of malicious buyer/seller behaviors and tips to protect your personal capital.',
      gradient: 'from-rose-500/20 to-rose-500/0',
      iconColor: 'text-rose-500',
    },
    {
      icon: Award,
      title: 'Seller Networking',
      desc: 'Collaborate with top-tier account sellers to swap marketing strategies, find bulk buyers, and scale your storefront.',
      gradient: 'from-amber-500/20 to-amber-500/0',
      iconColor: 'text-amber-500',
    },
    {
      icon: Bot,
      title: 'AI Discussions',
      desc: 'Explore discussions around using AI tools to naturally build up account values, draft gig listings, and automate delivery.',
      gradient: 'from-emerald-500/20 to-emerald-500/0',
      iconColor: 'text-emerald-500',
    },
    {
      icon: MessageSquare,
      title: 'Early Announcements',
      desc: 'Be the first to know about platform updates, escrow system upgrades, and beta opportunities for VIP seller placement.',
      gradient: 'from-pink-500/20 to-pink-500/0',
      iconColor: 'text-pink-500',
    },
  ]

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Community Core Values
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Why professional traders choose our official Telegram ecosystem to collaborate daily.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card group relative overflow-hidden p-8"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
                  <b.icon className={`h-7 w-7 ${b.iconColor}`} />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
