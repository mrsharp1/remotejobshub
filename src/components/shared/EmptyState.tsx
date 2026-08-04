import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

import { springs } from '@/lib/framer-physics'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={springs.gentle}
      className="premium-card flex min-h-[350px] w-full flex-col items-center justify-center p-8 text-center"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springs.bouncy, delay: 0.1 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 shadow-inner"
      >
        <Icon className="h-10 w-10 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
      </motion.div>
      <h3 className="mb-3 font-heading text-2xl font-black tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springs.snappy}
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
