import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CreditCard,
  ShoppingBag,
  Settings,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { notificationService } from '@/services/marketplace/notification.service'
import { useAuthStore } from '@/stores/authStore'
import { Notification } from '@/types'

export const NotificationBell: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  // Fetch unread count & recent notifications list
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['recent-notifications', user?.id],
    queryFn: () => {
      if (!user?.id) return []
      return notificationService.getNotifications(user.id)
    },
    enabled: !!user?.id,
    refetchInterval: 8000, // Auto refresh mock polling
  })

  const unreadCount = useMemoUnreadCount(notifications)

  // Auto-close overlay click listener
  useEffect(() => {
    if (!isOpen) return
    const handleClose = () => setIsOpen(false)
    window.addEventListener('click', handleClose)
    return () => window.removeEventListener('click', handleClose)
  }, [isOpen])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.id) return
    try {
      await notificationService.markAllAsRead(user.id)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleNotificationClick = async (notif: Notification) => {
    setIsOpen(false)
    try {
      await notificationService.markAsRead(notif.id)
      refetch()

      // Redirect depending on reference parameter type
      if (notif.reference_type === 'order' && notif.reference_id) {
        navigate(`/orders/${notif.reference_id}`)
      } else if (notif.reference_type === 'listing') {
        navigate('/seller') // Redirect listing studio checks
      } else {
        navigate('/dashboard/notifications')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-primary" />
      case 'payment':
        return <CreditCard className="h-4 w-4 text-emerald-500" />
      case 'listing':
        return <Settings className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="relative">
      {/* Trigger Bell Button */}
      <button
        onClick={handleToggle}
        className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-50 mt-2.5 w-80 space-y-3 rounded-xl border border-border bg-card p-4 text-left shadow-2xl"
        >
          <div className="border-border/50 flex items-center justify-between border-b pb-2">
            <h4 className="flex items-center gap-1.5 font-heading text-xs font-bold text-foreground">
              Notifications{' '}
              {unreadCount > 0 && (
                <span className="text-[10px] text-primary">
                  ({unreadCount} new)
                </span>
              )}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[9px] font-bold text-primary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List content limit to 5 logs */}
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`hover:bg-muted/50 flex cursor-pointer gap-3 rounded-lg p-2 transition-colors ${
                    !notif.is_read
                      ? 'bg-primary/5 border-primary/10 border'
                      : 'border border-transparent'
                  }`}
                >
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h5 className="truncate text-[11px] font-bold text-foreground">
                      {notif.title}
                    </h5>
                    <p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                      {notif.message}
                    </p>
                    <span className="text-muted-foreground/75 block text-[8px]">
                      {new Date(notif.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No notification alerts found.
              </div>
            )}
          </div>

          <div className="border-border/50 border-t pt-2 text-center">
            <button
              onClick={() => {
                setIsOpen(false)
                navigate('/dashboard/notifications')
              }}
              className="text-[10px] font-bold text-muted-foreground transition-colors hover:text-primary"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function useMemoUnreadCount(notifications: Notification[]) {
  return React.useMemo(() => {
    return notifications.filter((n) => !n.is_read).length
  }, [notifications])
}
export default NotificationBell
