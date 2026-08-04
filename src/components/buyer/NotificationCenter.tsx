import React from 'react'
import { Bell, ShieldCheck, CreditCard, MessageSquare, AlertCircle } from 'lucide-react'
import type { Notification } from '@/types'

interface NotificationCenterProps {
  notifications: Notification[]
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'order_update': return <CreditCard className="h-4 w-4 text-emerald-400" />
      case 'security': return <ShieldCheck className="h-4 w-4 text-indigo-400" />
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-400" />
      default: return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/30 p-6 text-center">
        <Bell className="mx-auto h-8 w-8 text-slate-600" />
        <h3 className="font-heading text-sm font-bold text-slate-400">No recent notifications</h3>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
          Recent Activity
        </h3>
        <span className="text-[10px] font-bold text-indigo-400 hover:underline cursor-pointer">
          Mark all as read
        </span>
      </div>
      
      <div className="space-y-3">
        {notifications.slice(0, 5).map((notif) => (
          <div key={notif.id} className="flex items-start gap-3 rounded-xl bg-slate-900/50 p-3 transition-colors hover:bg-slate-800">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <h4 className={`text-xs font-bold ${notif.is_read ? 'text-slate-400' : 'text-white'}`}>
                {notif.title}
              </h4>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-500">
                {notif.message}
              </p>
            </div>
            <span className="shrink-0 text-[9px] font-medium text-slate-600">
              {new Date(notif.created_at).toLocaleDateString()}
            </span>
            {!notif.is_read && (
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
