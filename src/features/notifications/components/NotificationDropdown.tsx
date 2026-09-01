import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Check, Loader2, MessageCircle, ShoppingBag, ShieldCheck, Megaphone, Info, Zap, AlertTriangle, Gift } from 'lucide-react'
import type { Notification } from '../types'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks'

interface NotificationDropdownProps {
  userId: string | undefined
  onClose: () => void
  onNavigate?: (url: string) => void
}

const getIconForCategoryAndType = (category?: string | null, type?: string) => {
  const check = category || type
  switch (check) {
    case 'message':
    case 'messages': return <MessageCircle className="w-5 h-5" />
    case 'order':
    case 'orders':
    case 'order_new':
    case 'order_update': return <ShoppingBag className="w-5 h-5" />
    case 'verification':
    case 'kyc': return <ShieldCheck className="w-5 h-5" />
    case 'admin_broadcast':
    case 'announcements': return <Megaphone className="w-5 h-5" />
    case 'escrow':
    case 'escrow_update':
    case 'escrow_released': return <ShoppingBag className="w-5 h-5" />
    case 'wallet':
    case 'wallet_deposit':
    case 'payment':
    case 'payments':
    case 'payment_completed': return <Check className="w-5 h-5" />
    case 'security': return <AlertTriangle className="w-5 h-5" />
    case 'system': return <Zap className="w-5 h-5" />
    case 'promotions': return <Gift className="w-5 h-5" />
    case 'disputes': return <AlertTriangle className="w-5 h-5" />
    default: return <Info className="w-5 h-5" />
  }
}

const getPriorityStyles = (priority?: string | null) => {
  switch (priority) {
    case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
    case 'important': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
    case 'promotional': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800'
    case 'informational':
    default: return 'text-primary bg-primary/10 border-primary/20'
  }
}

const getFallbackLink = (notification: Notification) => {
  if (notification.target_url) return notification.target_url
  if (notification.link) return notification.link
  if (notification.reference_type === 'order' && notification.reference_id) {
    return `/orders/${notification.reference_id}`
  }
  return undefined
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId, onClose, onNavigate }) => {
  const { data: notifications = [], isLoading } = useNotifications(userId)
  const markAsReadMutation = useMarkNotificationRead(userId)
  const markAllAsReadMutation = useMarkAllNotificationsRead(userId)

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id)
    }
    const finalLink = getFallbackLink(notification)
    if (finalLink && onNavigate) {
      onNavigate(finalLink)
      onClose()
    }
  }

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate('/dashboard/notifications')
      onClose()
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-auto sm:right-0 sm:-right-2 sm:top-full sm:mt-2 sm:w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden z-[100] origin-top-right">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-50 dark:bg-slate-900">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            {markAllAsReadMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-white dark:bg-slate-950">
            <Bell className="w-10 h-10 mb-3 opacity-20 text-primary" />
            <p className="text-sm font-medium">You're all caught up!</p>
            <p className="text-xs mt-1">No new notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-border bg-white dark:bg-slate-950">
            {notifications.map((notification) => {
              const avatar = notification.metadata?.avatar_url
              const priorityStyles = getPriorityStyles(notification.priority)
              const icon = getIconForCategoryAndType(notification.category, notification.type)
              
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left flex items-start gap-3 p-4 transition-colors focus-visible:outline-none focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800 ${!notification.is_read ? 'bg-primary/5 hover:bg-primary/10' : 'bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                  aria-label={`${notification.is_read ? 'Read' : 'Unread'} notification: ${notification.title}`}
                >
                  <div className="relative shrink-0 pt-0.5">
                    {avatar ? (
                      <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-background" />
                    ) : (
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border bg-white dark:bg-slate-950 ${priorityStyles}`}>
                        {icon}
                      </div>
                    )}
                    {!notification.is_read && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white dark:border-slate-950" aria-hidden="true" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm break-words whitespace-normal ${!notification.is_read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                        {notification.title}
                      </p>
                      {notification.priority === 'critical' && (
                        <span className="shrink-0 text-[9px] uppercase font-bold tracking-wider text-red-600 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 break-words whitespace-normal ${!notification.is_read ? 'text-foreground/90 font-medium' : 'text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                      {notification.category && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {notification.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="border-t border-border p-2 bg-slate-50 dark:bg-slate-900">
          <button 
            onClick={handleViewAll}
            className="w-full py-2 text-xs font-semibold text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors text-center"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}
