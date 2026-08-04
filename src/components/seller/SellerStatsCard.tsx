import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface SellerStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: string
}

export const SellerStatsCard: React.FC<SellerStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:bg-card"
    >
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </h3>
          {description && (
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">
              {description}
            </p>
          )}
          {trend && (
            <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
