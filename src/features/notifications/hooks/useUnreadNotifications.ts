import { useMemo } from 'react'
import { useNotifications } from './useNotifications'

export const useUnreadNotifications = (userId: string | undefined) => {
  const { data: notifications, isLoading, error } = useNotifications(userId)

  const unreadCount = useMemo(() => {
    if (!notifications) return 0
    return notifications.filter(n => !n.is_read).length
  }, [notifications])

  return {
    unreadCount,
    isLoading,
    error
  }
}
