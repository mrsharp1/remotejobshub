import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, HelpCircle, Activity } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'

export const FaqSupportChannels: React.FC = () => {
  const { globalStats } = useCMSStore()

  const channels = [
    {
      icon: MessageCircle,
      title: 'Telegram Community',
      desc: `Join ${globalStats.users} members. Vetted peer-to-peer account trade discussions.`,
      value: 't.me/+mm7Rk9WkcHc0ZTBk',
      action: 'Join Telegram',
      link: 'https://t.me/+mm7Rk9WkcHc0ZTBk',
      gradient: 'from-sky-500/20 to-sky-500/0',
      iconColor: 'text-sky-500',
    },
    {
      icon: Mail,
      title: 'Email Support',
      desc: `Drop us an email. Our operations SLA is typically ${globalStats.responseTime}.`,
      value: 'support@remotejobshub.com',
      action: 'Email Us',
      link: 'mailto:support@remotejobshub.com',
      gradient: 'from-blue-500/20 to-blue-500/0',
      iconColor: 'text-blue-500',
    },
    {
      icon: HelpCircle,
      title: 'Ticket Support',
      desc: 'Fill out our secure topic-filtered form to log a ticket.',
      value: 'Topic-filtered support form',
      action: 'Log Ticket',
      link: '/contact',
      gradient: 'from-violet-500/20 to-violet-500/0',
      iconColor: 'text-violet-500',
    },
    {
      icon: Activity,
      title: 'Platform Status',
      desc: 'Escrow Engine, Payments Gateway, and Wallet pipelines.',
      value: `${globalStats.escrowSuccess} operational`,
      action: 'View Status',
      link: '#',
      gradient: 'from-emerald-500/20 to-emerald-500/0',
      iconColor: 'text-emerald-500',
    },
  ]

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Still need help?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Reach out through our verified operation channels.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card group relative overflow-hidden p-8 flex flex-col justify-between"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
                    <channel.icon className={`h-7 w-7 ${channel.iconColor}`} />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{channel.title}</h3>
                  <p className="mb-4 text-xs font-semibold text-slate-400">{channel.value}</p>
                  <p className="mb-8 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{channel.desc}</p>
                </div>
                <a
                  href={channel.link}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  {channel.action}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
