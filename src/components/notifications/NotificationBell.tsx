import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { notificationService } from '@/services/marketplace/notification.service'
import { useEventSubscriber } from '@/hooks/useEventSubscriber'
import { NotificationDrawer } from './NotificationDrawer'

export const NotificationBell: React.FC = () => {
  const { user } = useAuthStore()
  const userId = user?.id

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationService.getNotifications(userId!),
    enabled: !!userId,
  })

  // Refetch when relevant events occur
  const triggerRefetch = () => {
    refetch()
  }

  useEventSubscriber('ORDER_CREATED', triggerRefetch)
  useEventSubscriber('PAYMENT_CONFIRMED', triggerRefetch)
  useEventSubscriber('ESCROW_LOCKED', triggerRefetch)
  useEventSubscriber('CREDENTIALS_UPLOADED', triggerRefetch)
  useEventSubscriber('VAULT_OPENED', triggerRefetch)
  useEventSubscriber('VERIFICATION_STARTED', triggerRefetch)
  useEventSubscriber('VERIFICATION_COMPLETED', triggerRefetch)
  useEventSubscriber('ESCROW_RELEASED', triggerRefetch)
  useEventSubscriber('SELLER_WALLET_CREDITED', triggerRefetch)
  useEventSubscriber('DISPUTE_OPENED', triggerRefetch)
  useEventSubscriber('DISPUTE_RESOLVED', triggerRefetch)
  useEventSubscriber('ORDER_COMPLETED', triggerRefetch)
  useEventSubscriber('REVIEW_SUBMITTED', triggerRefetch)

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 shadow-sm ring-2 ring-white dark:ring-slate-900"
            />
          )}
        </AnimatePresence>
      </button>

      {isDrawerOpen && (
        <NotificationDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          notifications={notifications}
          onReadAction={triggerRefetch}
        />
      )}
    </>
  )
}
