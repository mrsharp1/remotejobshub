import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Loader2,
  Trash2,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Megaphone,
  Check,
  AlertTriangle,
  Gift,
  Info,
  Zap,
  CheckCircle2
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { notificationService } from '@/services/marketplace/notification.service'
import { Notification } from '@/types'
import { formatDistanceToNow } from 'date-fns'

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

      if (notif.target_url) {
        navigate(notif.target_url)
      } else if (notif.link) {
        navigate(notif.link)
      } else if (notif.reference_type === 'order' && notif.reference_id) {
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
      
      const checkCategory = n.category || n.type
      switch(activeTab) {
        case 'messages': return checkCategory === 'message' || checkCategory === 'messages'
        case 'orders': return checkCategory?.includes('order') || checkCategory === 'escrow'
        case 'payments': return checkCategory?.includes('payment') || checkCategory?.includes('wallet')
        case 'security': return checkCategory === 'security'
        case 'system': return checkCategory === 'system' || checkCategory === 'admin_broadcast' || checkCategory === 'announcements'
        case 'promotions': return checkCategory === 'promotions'
        default: return true
      }
    })
  }, [notifications, activeTab])

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

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'messages', label: 'Messages' },
    { key: 'orders', label: 'Orders' },
    { key: 'payments', label: 'Payments' },
    { key: 'security', label: 'Security' },
    { key: 'system', label: 'System' },
    { key: 'promotions', label: 'Promotions' },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-6 lg:p-8">
      {/* Title Header */}
      <div className="border-border/40 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Notification Centre
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Stay up to date with messages, orders, payments, security and account activity.
          </p>
        </div>
        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs Filter Bar */}
      <div className="scrollbar-none border-border/40 flex gap-1 overflow-x-auto whitespace-nowrap border-b pb-0">
        {filters.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-t-lg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List cards content */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
             const priorityStyles = getPriorityStyles(notif.priority)
             const icon = getIconForCategoryAndType(notif.category, notif.type)

             return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNotificationClick(notif);
                  }
                }}
                className={`group flex items-start gap-4 rounded-xl border p-5 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  !notif.is_read
                    ? 'bg-primary/[0.03] border-primary/20 hover:bg-primary/5 hover:border-primary/40'
                    : 'bg-card border-border hover:bg-muted/30'
                }`}
              >
                <div className={`flex-shrink-0 rounded-full border p-2.5 ${priorityStyles}`}>
                  {icon}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <h4 className={`truncate font-heading text-base ${!notif.is_read ? 'font-bold text-foreground' : 'font-semibold text-foreground/80'}`}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-primary inline-block" aria-label="Unread" />
                      )}
                      {notif.priority === 'critical' && (
                        <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                       {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed mt-1 pr-4 ${!notif.is_read ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                    {notif.message}
                  </p>

                  {/* Sub Action elements */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                       {notif.category && (
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider bg-muted px-2 py-1 rounded-md">
                          {notif.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      {!notif.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkRead(notif.id)
                          }}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark as read
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(notif.id)
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
             )
          })}
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-dashed border-border py-16 text-center bg-card">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
             <CheckCircle2 className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            You're all caught up
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-[250px] mx-auto">
            There are no notifications matching your active filter.
          </p>
        </div>
      )}
    </div>
  )
}
export default NotificationsPage
