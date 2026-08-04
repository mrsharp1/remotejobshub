import React, { useRef } from 'react'
import type { NotificationCategory } from './NotificationDrawer'

interface NotificationFiltersProps {
  activeCategory: NotificationCategory
  onSelectCategory: (category: NotificationCategory) => void
}

const CATEGORIES: { id: NotificationCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'payment', label: 'Payments' },
  { id: 'escrow', label: 'Escrow' },
  { id: 'security', label: 'Security' },
  { id: 'disputes', label: 'Disputes' },
  { id: 'verification', label: 'Verification' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'order', label: 'Orders' },
  { id: 'system', label: 'System' },
]

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto py-3 px-6 gap-2 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {/* Fade indicators for horizontal scroll */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent dark:from-slate-900" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent dark:from-slate-900" />
    </div>
  )
}
