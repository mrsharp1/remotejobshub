import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ListFilter, AlertTriangle, Megaphone, Settings } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const QuickActions: React.FC = React.memo(() => {
  const actions = [
    {
      label: 'Approve KYC',
      desc: 'Audit compliance registrations',
      to: '/admin/verification',
      icon: ShieldCheck,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/10 dark:bg-indigo-500/5',
    },
    {
      label: 'Review Listings',
      desc: 'Verify account moderations',
      to: '/admin/listings',
      icon: ListFilter,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10 dark:bg-emerald-500/5',
    },
    {
      label: 'Resolve Disputes',
      desc: 'Mediate escrow ticket claims',
      to: '/admin/disputes',
      icon: AlertTriangle,
      color: 'text-destructive bg-destructive/10 border-destructive/10 dark:bg-destructive/5',
    },
    {
      label: 'Broadcast Notice',
      desc: 'Push template alert packages',
      to: '/admin?view=notifications',
      icon: Megaphone,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/10 dark:bg-rose-500/5',
    },
    {
      label: 'CMS Editor',
      desc: 'Reconfigure marketing builders',
      to: '/admin/cms',
      icon: Settings,
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/10 dark:bg-yellow-500/5',
    },
  ]

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card lg:col-span-4 space-y-4">
      <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
        Quick Console Actions
      </h3>
      <div className="grid gap-3">
        {actions.map((action, idx) => (
          <motion.a
            key={idx}
            whileHover={{ x: 6, scale: 1.01 }}
            transition={springs.snappy}
            href={action.to}
            className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/40 transition min-h-[48px] shadow-sm hover:shadow"
          >
            <div className={`rounded-xl p-3 border shrink-0 ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-950 dark:text-white">
                {action.label}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                {action.desc}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
})
