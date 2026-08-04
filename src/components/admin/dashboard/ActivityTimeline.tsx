import React from 'react'
import { motion } from 'framer-motion'
import { Profile, Listing, Order, Notification } from '@/types'
import { EmptyDashboardState } from './EmptyDashboardState'

interface ActivityTimelineProps {
  activity: {
    users: Profile[];
    listings: Listing[];
    orders: (Order & { buyer?: Profile; listing?: Listing })[];
    notifications: Notification[];
  };
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = React.memo(({ activity }) => {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card lg:col-span-8 space-y-6">
      <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
        System Live Activity Registry
      </h3>

      <div className="grid grid-cols-1 gap-6 text-[10px] md:grid-cols-2">
        {/* Recent Signups */}
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800/80 pb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Recent Signups
          </h4>
          {activity.users.length === 0 ? (
            <EmptyDashboardState
              explanation="No new profile creations logs found inside the registry."
              actionLabel="Check users"
              actionUrl="/admin?view=users"
            />
          ) : (
            <div className="space-y-3">
              {activity.users.map((u) => (
                <motion.div
                  key={u.id}
                  whileHover={{ x: 2, scale: 1.01 }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100/50 hover:bg-slate-50 dark:border-slate-800/40 dark:hover:bg-slate-900/40 transition shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 border border-indigo-500/10 font-bold text-indigo-500 dark:text-indigo-400 text-xs shrink-0">
                    {u.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-900 dark:text-white truncate">
                      {u.full_name || 'New Profile'}
                    </span>
                    <span className="text-[9px] text-slate-455 truncate block mt-0.5">{u.email}</span>
                  </div>
                  <span className="text-[8px] text-slate-455 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg shrink-0 font-black uppercase tracking-widest border border-slate-200/20">
                    {u.role}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Listings */}
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800/80 pb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Recent Listings
          </h4>
          {activity.listings.length === 0 ? (
            <EmptyDashboardState
              explanation="No listing submissions found inside the moderation registry."
              actionLabel="Review listings"
              actionUrl="/admin/listings"
            />
          ) : (
            <div className="space-y-3">
              {activity.listings.map((l) => (
                <motion.div
                  key={l.id}
                  whileHover={{ x: 2, scale: 1.01 }}
                  className="flex justify-between items-center gap-3 p-3 rounded-2xl border border-slate-100/50 hover:bg-slate-50 dark:border-slate-800/40 dark:hover:bg-slate-900/40 transition shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-900 dark:text-white truncate">
                      {l.title}
                    </span>
                    <span className="text-[9px] text-slate-455 uppercase tracking-widest truncate block mt-0.5">
                      {l.platform}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-black text-slate-955 dark:text-white">
                      ₦{Number(l.price).toLocaleString()}
                    </span>
                    <span className="block text-[8px] text-slate-400 capitalize mt-0.5">{l.approval_status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800/80 pb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> Recent Orders
          </h4>
          {activity.orders.length === 0 ? (
            <EmptyDashboardState
              explanation="No transaction order items found inside the escrow logs."
              actionLabel="Inspect Escrow"
              actionUrl="/admin?view=orders"
            />
          ) : (
            <div className="space-y-3">
              {activity.orders.map((o) => (
                <motion.div
                  key={o.id}
                  whileHover={{ x: 2, scale: 1.01 }}
                  className="flex justify-between items-center gap-3 p-3 rounded-2xl border border-slate-100/50 hover:bg-slate-50 dark:border-slate-800/40 dark:hover:bg-slate-900/40 transition shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-900 dark:text-white truncate">
                      {o.listing?.title || 'Account Transfer'}
                    </span>
                    <span className="text-[9px] text-slate-455 truncate block mt-0.5">
                      Buyer: {o.buyer?.full_name || 'Buyer'}
                    </span>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span className="block font-mono font-black text-slate-955 dark:text-white">
                      ₦{Number(o.amount).toLocaleString()}
                    </span>
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400 capitalize text-[8px]">
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* System Alerts */}
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-wider text-slate-455 border-b border-slate-100 dark:border-slate-800/80 pb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> System Alerts
          </h4>
          {activity.notifications.length === 0 ? (
            <EmptyDashboardState
              explanation="No security notifications alert records found."
              actionLabel="Verify logs"
              actionUrl="/admin?view=notifications"
            />
          ) : (
            <div className="space-y-3">
              {activity.notifications.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ x: 2, scale: 1.01 }}
                  className="space-y-1.5 p-3 rounded-2xl border border-slate-100/50 hover:bg-slate-50 dark:border-slate-800/40 dark:hover:bg-slate-900/40 transition shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">{n.title}</span>
                    <span className="text-[8px] text-slate-400 shrink-0 font-mono">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="line-clamp-1 leading-relaxed text-slate-455">
                    {n.message}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
