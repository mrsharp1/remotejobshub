import React, { useMemo } from 'react'
import type { Notification } from '@/types'
import { NotificationCard } from './NotificationCard'
import { isToday, isYesterday } from 'date-fns'
import { motion } from 'framer-motion'

interface NotificationTimelineProps {
  notifications: Notification[]
  onAction: () => void
}

type GroupedNotifications = {
  [key: string]: Notification[]
}

export const NotificationTimeline: React.FC<NotificationTimelineProps> = ({
  notifications,
  onAction,
}) => {
  const grouped = useMemo(() => {
    const groups: GroupedNotifications = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    }

    notifications.forEach((notif) => {
      const date = new Date(notif.created_at)
      if (isToday(date)) {
        groups['Today'].push(notif)
      } else if (isYesterday(date)) {
        groups['Yesterday'].push(notif)
      } else {
        groups['Earlier'].push(notif)
      }
    })

    return groups
  }, [notifications])

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([label, items]) => {
        if (items.length === 0) return null

        return (
          <div key={label} className="relative">
            {/* Timeline separator */}
            <div className="sticky top-0 z-10 flex items-center gap-4 bg-white/95 py-2 backdrop-blur-md dark:bg-slate-900/95">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {label}
              </h3>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Items */}
            <div className="mt-4 space-y-3">
              {items.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NotificationCard notification={notif} onAction={onAction} />
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
