import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bell, ArrowRight } from 'lucide-react'
import type { Notification } from '@/types'

interface NotificationCenterProps {
  notifications: Notification[]
  unreadCount: number
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [],
  unreadCount = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-500" />
          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            Unread Notifications
          </h3>
        </div>
        {unreadCount > 0 && (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="space-y-4">
        {notifications.filter(n => !n.is_read).slice(0, 3).map((notif) => (
          <div
            key={notif.id}
            className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {notif.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {notif.message}
              </p>
            </div>
          </div>
        ))}

        {unreadCount === 0 && (
          <div className="text-center py-6 text-slate-500 text-sm">
            All caught up! No unread alerts.
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
        <Link
          to="/dashboard/notifications"
          className="group flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          View Notification Center
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  )
}
