import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Activity, Banknote } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'

export const GlobalPresence: React.FC = () => {
  const { globalStats } = useCMSStore()

  return (
    <section className="relative overflow-hidden bg-white py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            A Global Marketplace
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Connecting buyers and sellers across continents, with 24/7 support and instantaneous escrow settlements.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* Abstract Map Background */}
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-10 dark:invert" />

          {/* Floating Stats */}
          <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Countries Served', value: globalStats.countries, icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { label: 'Active Users', value: globalStats.users, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { label: 'Active Escrow', value: globalStats.activeEscrow, icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { label: 'Total Transactions', value: globalStats.transactions, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="premium-card flex flex-col items-center p-8 text-center"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h4 className="font-heading text-3xl font-black text-foreground">{stat.value}</h4>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
