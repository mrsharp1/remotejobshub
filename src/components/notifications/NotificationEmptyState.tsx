import React from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'
import type { NotificationCategory } from './NotificationDrawer'

interface NotificationEmptyStateProps {
  category: NotificationCategory
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  category,
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        {category === 'unread' ? (
          <CheckCircle2 className="h-8 w-8" />
        ) : (
          <Bell className="h-8 w-8" />
        )}
      </div>
      <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
        {category === 'unread' ? "You're all caught up!" : "No notifications yet"}
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
        {category === 'all'
          ? "When you receive notifications about orders, payments, or messages, they'll show up here."
          : `You don't have any ${category === 'unread' ? 'new' : category} notifications right now.`}
      </p>
    </div>
  )
}
