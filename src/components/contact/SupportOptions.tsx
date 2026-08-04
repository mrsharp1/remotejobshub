import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, LifeBuoy, Mail, Users, BarChart3, AlertOctagon } from 'lucide-react'
import { useContactContent, useCMSStore } from '@/services/cms/cms.store'

export const SupportOptions: React.FC = () => {
  const { emails } = useContactContent()
  const { globalStats } = useCMSStore()
  const options = [
    {
      icon: MessageSquare,
      title: 'Telegram Community',
      desc: `Join ${globalStats.users} members inside our verified, scam-free ecosystem to ask general trade questions.`,
      action: 'Join Telegram',
      link: 'https://t.me/+mm7Rk9WkcHc0ZTBk',
      gradient: 'from-sky-500/20 to-sky-500/0',
      iconColor: 'text-sky-500',
    },
    {
      icon: LifeBuoy,
      title: 'Customer Support',
      desc: 'Get help with user profiles, KYC verifications, or dispute resolutions directly from our operations desk.',
      action: 'Open Ticket',
      link: '#contact-form-anchor',
      gradient: 'from-violet-500/20 to-violet-500/0',
      iconColor: 'text-violet-500',
    },
    {
      icon: Mail,
      title: 'Email Support',
      desc: `Prefer standard correspondence? Drop us an email. Our response SLA is typically ${globalStats.responseTime}.`,
      action: 'Email Us',
      link: `mailto:${emails.support}`,
      gradient: 'from-blue-500/20 to-blue-500/0',
      iconColor: 'text-blue-500',
    },
    {
      icon: Users,
      title: 'Business Partnerships',
      desc: 'Collaborate with Remote Jobs Hub on marketing efforts, affiliate verifications, or integration strategies.',
      action: 'Partner Up',
      link: '#contact-form-anchor',
      gradient: 'from-amber-500/20 to-amber-500/0',
      iconColor: 'text-amber-500',
    },
    {
      icon: BarChart3,
      title: 'Enterprise Sales',
      desc: 'High-volume trading desk or agency? Ask about our specialized bulk-listing escrow frameworks.',
      action: 'Contact Sales',
      link: '#contact-form-anchor',
      gradient: 'from-emerald-500/20 to-emerald-500/0',
      iconColor: 'text-emerald-500',
    },
    {
      icon: AlertOctagon,
      title: 'Bug Reports',
      desc: 'Help keep our software secure. Report anomalies, interface bugs, or potential vulnerability points.',
      action: 'Report Bug',
      link: '#contact-form-anchor',
      gradient: 'from-rose-500/20 to-rose-500/0',
      iconColor: 'text-rose-500',
    },
  ]

  const handleScrollToForm = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith('#')) {
      e.preventDefault()
      const element = document.getElementById(link.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <section className="relative z-20 -mt-20 px-4 pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((opt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card group relative overflow-hidden p-8"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
                    <opt.icon className={`h-7 w-7 ${opt.iconColor}`} />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{opt.title}</h3>
                  <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{opt.desc}</p>
                </div>
                <a
                  href={opt.link}
                  onClick={(e) => handleScrollToForm(e, opt.link)}
                  className={`inline-flex items-center justify-center rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}
                >
                  {opt.action}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

