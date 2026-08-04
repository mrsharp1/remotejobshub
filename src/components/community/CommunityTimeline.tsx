import React from 'react'
import { motion } from 'framer-motion'

export const CommunityTimeline: React.FC = () => {
  const roadmap = [
    { step: '01', title: 'Join', desc: 'Secure entry into the official verified Telegram channel.' },
    { step: '02', title: 'Learn', desc: 'Absorb trade strategies, safety guidelines, and profile evaluation methodologies.' },
    { step: '03', title: 'Connect', desc: 'Build relationships with top sellers, bulk buyers, and community moderators.' },
    { step: '04', title: 'Buy Safely', desc: 'Securely acquire aged profiles with zero risk using our built-in Escrow Engine.' },
    { step: '05', title: 'Sell Successfully', desc: 'List your assets, utilize AI optimization, and receive fast payouts.' },
    { step: '06', title: 'Grow', desc: 'Scale your remote freelance operation, contract capacity, and brand equity.' },
  ]

  return (
    <section className="bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            The Member Journey
          </h2>
        </div>

        <div className="relative border-l-2 border-violet-100 dark:border-violet-900/50 md:mx-auto md:w-3/4">
          {roadmap.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative mb-16 pl-8 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-violet-500 shadow-sm dark:border-slate-950 dark:bg-violet-400" />
              
              <div className="mb-1 flex items-center gap-4">
                <span className="font-mono text-xl font-black text-violet-600 dark:text-violet-400">
                  Step {m.step}
                </span>
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">{m.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
