import React from 'react'
import { Clock, AlertCircle } from 'lucide-react'

export const UrgencyBadge: React.FC<{
  type?: 'limited' | 'reduced' | 'new'
}> = ({ type = 'limited' }) => {
  if (type === 'reduced') {
    return (
      <div className="flex w-fit items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
        <TrendingDownIcon className="h-3.5 w-3.5" />
        Price recently reduced
      </div>
    )
  }

  if (type === 'new') {
    return (
      <div className="bg-primary/10 flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold text-primary">
        <Clock className="h-3.5 w-3.5" />
        Recently Listed — High Interest
      </div>
    )
  }

  // limited
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-md bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
      <AlertCircle className="h-3.5 w-3.5" />
      Only 2 similar verified accounts available
    </div>
  )
}

function TrendingDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  )
}
