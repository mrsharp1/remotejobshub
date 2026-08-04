import React from 'react'
import { motion } from 'framer-motion'

const SupportTimelineComponent: React.FC = () => {
  const steps = [
    { title: 'User Contacts Support', desc: 'Securely submit your inquiry using the topic-filtered form.' },
    { title: 'Ticket Received', desc: 'Your ticket is logged and encrypted inside our database.' },
    { title: 'Agent Assigned', desc: 'A dedicated risk agent or compliance engineer is assigned to the case.' },
    { title: 'Investigation', desc: 'We coordinate with transacting parties, review chat logs, and verify IDs.' },
    { title: 'Resolution', desc: 'The dispute or ticket is resolved and funds/accounts are safely unlocked.' },
    { title: 'Feedback Provided', desc: 'A post-resolution audit report is shared with all parties.' },
  ]

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Support Journey
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A transparent walkthrough of our standard ticket processing operations.
          </p>
        </div>

        <div className="relative border-l-2 border-indigo-100 dark:border-indigo-900/50 md:mx-auto md:w-3/4">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative mb-16 pl-8 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-indigo-500 shadow-sm dark:border-slate-950 dark:bg-indigo-400" />
              
              <div className="mb-1 flex items-center gap-4">
                <span className="font-mono text-xl font-black text-indigo-600 dark:text-indigo-400">
                  Phase 0{idx + 1}
                </span>
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">{s.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const SupportTimeline = React.memo(SupportTimelineComponent)
