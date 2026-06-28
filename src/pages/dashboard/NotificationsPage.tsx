import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CreditCard,
  ShoppingBag,
  Settings,
  AlertCircle,
  Loader2,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { notificationService } from '@/services/marketplace/notification.service'
import { Notification } from '@/types'

export const NotificationsPage: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('all')

  // Fetch Notifications List
  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['all-notifications', user?.id],
    queryFn: () => {
      if (!user?.id) return []
      return notificationService.getNotifications(user.id)
    },
    enabled: !!user?.id,
  })

  // Mark single as read
  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  // Delete single notification
  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  // Mark all read
  const handleMarkAllRead = async () => {
    if (!user?.id) return
    try {
      await notificationService.markAllAsRead(user.id)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  // Navigation redirect matching refs
  const handleNotificationClick = async (notif: Notification) => {
    try {
      if (!notif.is_read) {
        await notificationService.markAsRead(notif.id)
        refetch()
      }

      if (notif.reference_type === 'order' && notif.reference_id) {
        navigate(`/orders/${notif.reference_id}`)
      } else if (notif.reference_type === 'listing') {
        navigate('/seller')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Tab filtering logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'unread') return !n.is_read
      if (activeTab === 'all') return true
      return n.type === activeTab
    })
  }, [notifications, activeTab])

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-primary" />
      case 'payment':
        return <CreditCard className="h-5 w-5 text-emerald-500" />
      case 'listing':
        return <Settings className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4">
      {/* Title Header */}
      <div className="border-border/40 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            User Workspace Logs
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Notification Center
          </h1>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="bg-primary/10 border-primary/20 hover:bg-primary/20 self-start rounded-lg border px-3.5 py-1.5 text-xs font-semibold text-primary transition-all sm:self-center"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs Filter Bar */}
      <div className="scrollbar-none border-border/40 flex gap-2 overflow-x-auto whitespace-nowrap border-b pb-1">
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'unread', label: 'Unread Only' },
          { key: 'order', label: 'Orders' },
          { key: 'payment', label: 'Payments' },
          { key: 'listing', label: 'Listings' },
          { key: 'system', label: 'System' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List cards content */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 shadow-sm transition-colors ${
                !notif.is_read
                  ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                  : 'hover:bg-muted/50 border-border bg-card'
              }`}
            >
              <div className="flex-shrink-0 rounded-lg bg-muted p-2">
                {getIcon(notif.type)}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="truncate font-heading text-xs font-bold leading-snug text-foreground">
                    {notif.title}
                  </h4>
                  <span className="whitespace-nowrap text-[9px] text-muted-foreground">
                    {new Date(notif.created_at).toLocaleDateString()}{' '}
                    {new Date(notif.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {notif.message}
                </p>

                {/* Sub Action elements */}
                <div className="flex items-center justify-end gap-4 pt-1.5">
                  {!notif.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkRead(notif.id)
                      }}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notif.id)
                    }}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-dashed py-16 text-center">
          <XCircle className="text-muted-foreground/60 mx-auto h-12 w-12" />
          <h3 className="font-heading text-base font-bold text-foreground">
            No alerts matching filter
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            There are no notifications logs found matching your active status
            settings.
          </p>
        </div>
      )}
    </div>
  )
}
export default NotificationsPage
