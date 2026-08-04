import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { 
  Check, 
  Trash2,
  Package,
  CreditCard,
  ShieldAlert,
  Scale,
  ShieldCheck,
  Wallet,
  Star,
  Info,
  Lock,
} from 'lucide-react'
import type { Notification, NotificationPriority } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

interface NotificationCardProps {
  notification: Notification
  onAction: () => void
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onAction,
}) => {
  // Infer priority based on type
  const getPriority = (type: string): NotificationPriority => {
    switch (type) {
      case 'security':
      case 'disputes':
        return 'critical'
      case 'payment':
      case 'wallet':
      case 'verification':
      case 'escrow':
        return 'high'
      case 'order':
      case 'marketplace':
      case 'reviews':
        return 'normal'
      case 'system':
      case 'announcements':
      default:
        return 'low'
    }
  }

  const priority = getPriority(notification.type)

  const getIcon = () => {
    switch (notification.type) {
      case 'order': return <Package className="w-5 h-5" />
      case 'payment': return <CreditCard className="w-5 h-5" />
      case 'escrow': return <Lock className="w-5 h-5" />
      case 'security': return <ShieldAlert className="w-5 h-5" />
      case 'disputes': return <Scale className="w-5 h-5" />
      case 'verification': return <ShieldCheck className="w-5 h-5" />
      case 'wallet': return <Wallet className="w-5 h-5" />
      case 'reviews': return <Star className="w-5 h-5" />
      case 'system':
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = () => {
    switch (priority) {
      case 'critical':
        return 'border-rose-100 bg-rose-50/50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-900/10 dark:text-rose-400'
      case 'high':
        return 'border-amber-100 bg-amber-50/50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-900/10 dark:text-amber-400'
      case 'normal':
        return 'border-blue-100 bg-blue-50/50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/10 dark:text-blue-400'
      case 'low':
      default:
        return 'border-slate-100 bg-slate-50/50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'
    }
  }

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await notificationService.markAsRead(notification.id)
      onAction()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await notificationService.deleteNotification(notification.id)
      onAction()
    } catch (err) {
      console.error(err)
    }
  }

  const Wrapper = notification.reference_id ? Link : 'div'
  const wrapperProps = notification.reference_id 
    ? { to: `/dashboard/orders/${notification.reference_id}` } 
    : {}

  return (
    <Wrapper
      {...wrapperProps as any}
      className={`group relative flex items-start gap-4 rounded-2xl border p-4 transition-all hover:shadow-md ${getStyles()} ${
        !notification.is_read ? 'opacity-100 ring-1 ring-current' : 'opacity-70'
      }`}
    >
      {/* Unread indicator dot */}
      {!notification.is_read && (
        <div className="absolute -left-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-current shadow-sm ring-2 ring-white dark:ring-slate-900" />
      )}

      <div className="shrink-0 rounded-xl bg-white/50 p-2 backdrop-blur-sm dark:bg-slate-900/50">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
          {notification.title}
        </h4>
        <p className="text-xs text-slate-600 mt-1 line-clamp-2 dark:text-slate-300">
          {notification.message}
        </p>
        <span className="text-[10px] font-medium text-slate-500 mt-2 block opacity-70">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </span>
      </div>

      <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.is_read && (
          <button
            onClick={handleMarkAsRead}
            className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
            title="Mark as read"
            aria-label="Mark as read"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="rounded-lg p-1.5 hover:bg-rose-500/10 text-rose-500 dark:hover:bg-rose-500/20"
          title="Delete"
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Wrapper>
  )
}
