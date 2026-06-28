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
      className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <div className="bg-primary/10 rounded-lg p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-heading text-2xl font-bold text-foreground">
          {value}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <span className="mt-2 inline-flex items-center text-xs font-semibold text-emerald-500">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  )
}
