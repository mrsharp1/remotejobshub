import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ShoppingBag, Wallet, MessageSquare, Heart, Headphones } from 'lucide-react'

interface QuickActionsProps {
  isSeller?: boolean
}

export const QuickActions: React.FC<QuickActionsProps> = ({ isSeller = false }) => {
  const actions = [
    {
      label: 'Browse Marketplace',
      to: '/marketplace',
      icon: Search,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'My Orders',
      to: isSeller ? '/seller/orders' : '/dashboard/orders',
      icon: ShoppingBag,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Wallet Ledger',
      to: isSeller ? '/seller/wallet' : '/dashboard/wallet',
      icon: Wallet,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Secure Messages',
      to: isSeller ? '/seller/messages' : '/dashboard/messages',
      icon: MessageSquare,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Saved Listings',
      to: '/marketplace',
      icon: Heart,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      label: 'Contact Support',
      to: '/contact',
      icon: Headphones,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
        Quick Access
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {actions.map((act, idx) => {
          const Icon = act.icon
          
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Link
                to={act.to}
                className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:bg-slate-50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${act.bg} transition-transform group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${act.color}`} />
                </div>
                <span className="text-center text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">
                  {act.label}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
