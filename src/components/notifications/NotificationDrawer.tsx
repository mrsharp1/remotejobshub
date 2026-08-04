import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'
import { notificationService } from '@/services/marketplace/notification.service'
import type { Notification } from '@/types'
import { NotificationTimeline } from './NotificationTimeline'
import { NotificationFilters } from './NotificationFilters'
import { NotificationEmptyState } from './NotificationEmptyState'

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onReadAction: () => void
}

export type NotificationCategory = 'all' | 'unread' | 'payment' | 'escrow' | 'marketplace' | 'verification' | 'wallet' | 'security' | 'disputes' | 'reviews' | 'system' | 'order'

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onReadAction,
}) => {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all')
  const [isMarkingAll, setIsMarkingAll] = useState(false)

  // Filter notifications based on active category
  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    if (activeCategory === 'unread') {
      filtered = filtered.filter(n => !n.is_read)
    } else if (activeCategory !== 'all') {
      filtered = filtered.filter(n => n.type === activeCategory)
    }

    return filtered
  }, [notifications, activeCategory])

  const handleMarkAllRead = async () => {
    if (notifications.length === 0) return
    setIsMarkingAll(true)
    try {
      const userId = notifications[0]?.user_id
      if (userId) {
        await notificationService.markAllAsRead(userId)
        onReadAction()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsMarkingAll(false)
    }
  }

  // Handle escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm dark:bg-slate-900/60"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-md bg-white shadow-2xl dark:bg-slate-900 flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Notifications
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                disabled={isMarkingAll || notifications.filter(n => !n.is_read).length === 0}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50 dark:hover:bg-slate-800"
                title="Mark all as read"
                aria-label="Mark all as read"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors dark:hover:bg-slate-800"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="shrink-0 border-b border-slate-100 dark:border-slate-800">
            <NotificationFilters 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
            />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 custom-scrollbar" aria-live="polite">
            {filteredNotifications.length > 0 ? (
              <NotificationTimeline 
                notifications={filteredNotifications} 
                onAction={onReadAction}
              />
            ) : (
              <NotificationEmptyState category={activeCategory} />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
