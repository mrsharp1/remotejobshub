import React from 'react'
import { motion } from 'framer-motion'

export const ActivityTimeline: React.FC = () => {
  const activities = [
    { title: 'Funds Released Securely', desc: 'Arbitration closed successfully. ₦4,200,000 payout released to seller.', time: '2 hours ago' },
    { title: 'Credentials Inspected', desc: 'Buyer verified login auth and updated secondary validation numbers.', time: '6 hours ago' },
    { title: 'Credentials Delivered', desc: 'Seller uploaded secure credentials for contract #FIV-4890.', time: '12 hours ago' },
    { title: 'Escrow Vault Funded', desc: 'Buyer deposited ₦4,200,000. Verification process started.', time: '1 day ago' },
    { title: 'Identity Verified (KYC)', desc: 'Identity verification biometrics passed successfully.', time: '3 days ago' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
        Activity Log
      </h2>

      <div className="relative border-l border-slate-200 pl-6 dark:border-slate-800">
        {activities.map((act, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="relative mb-8 last:mb-0"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-500 shadow-sm dark:border-slate-950 dark:bg-indigo-400" />
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {act.time}
            </span>
            <h4 className="mt-1 font-bold text-slate-900 dark:text-white">
              {act.title}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {act.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
