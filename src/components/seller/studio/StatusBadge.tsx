import React from 'react'

interface StatusBadgeProps {
  status: 'draft' | 'submitted' | 'published' | 'sold' | 'archived'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'submitted':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'sold':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'archived':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStyles()}`}
    >
      {status}
    </span>
  )
}
