import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { ConversationViewModel } from '@/types'
import { ShieldCheck, User } from 'lucide-react'

interface ConversationCardProps {
  conversation: ConversationViewModel
  isActive: boolean
  onClick: () => void
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isActive,
  onClick
}) => {
  const otherUser = conversation.otherUser
  const unreadCount = conversation.unreadCount || 0
  const isSupport = otherUser.role === 'admin' || conversation.type === 'support'
  const name = isSupport ? 'Support Team' : (otherUser.full_name || 'Unknown User')
  
  // Format last message for preview
  let lastMessageText = conversation.lastMessage?.message_text || 'Active conversation'

  const timeAgo = conversation.updated_at 
    ? formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })
    : ''

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 transition-colors hover:bg-muted/50 ${
        isActive ? 'bg-muted/80' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {otherUser.avatar_url && !isSupport ? (
            <img src={otherUser.avatar_url} alt={name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${isSupport ? 'bg-indigo-500' : 'bg-primary'}`}>
              {isSupport ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
          )}
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
          {otherUser.online && !isSupport && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className={`truncate text-sm font-semibold ${unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
              {name}
            </h3>
            <span className="whitespace-nowrap text-xs text-muted-foreground ml-2">
              {timeAgo}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <p className={`truncate text-xs ${unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              {lastMessageText}
            </p>
            {isSupport && (
              <span className="ml-2 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-indigo-500">
                Support
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
