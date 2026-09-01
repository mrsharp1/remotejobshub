import React, { useState } from 'react'

export function getInitials(name?: string | null): string {
  if (!name) return '?'
  const cleanName = name.trim()
  if (!cleanName) return '?'
  const parts = cleanName.split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase()
  return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase()
}

interface ConversationAvatarProps {
  name: string
  role?: string
  className?: string
}

export const ConversationAvatar: React.FC<ConversationAvatarProps> = ({
  name,
  role,
  className = 'h-10 w-10 text-sm'
}) => {
  const normalizedName = name.toLowerCase()
  const isSupport = role === 'admin' || normalizedName.includes('support team')
  const isSystem = normalizedName.includes('remote jobs hub')
  const isSpecial = isSupport || isSystem

  const [imageFailed, setImageFailed] = useState(false)

  // Normal users ONLY get initials
  if (!isSpecial) {
    const initials = getInitials(name)
    return (
      <div 
        className={`flex shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold tracking-wide select-none overflow-hidden ${className}`}
        title={name}
      >
        {initials}
      </div>
    )
  }

  // Support / System gets DP
  if (!imageFailed) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center select-none ${className}`}>
        <img
          src="/images/support-avatar.png"
          alt={name}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  // Fallbacks
  const fallbackInitials = isSystem ? 'RJ' : 'ST'
  return (
    <div 
      className={`flex shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white font-bold tracking-wide select-none overflow-hidden ${className}`}
      title={name}
    >
      {fallbackInitials}
    </div>
  )
}
