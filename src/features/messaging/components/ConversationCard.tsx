import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { ConversationViewModel } from '@/types'
import { ShieldCheck, User, Pin, Archive } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { conversationService } from '@/features/messaging/services'

interface ConversationCardProps {
  conversation: ConversationViewModel
  isActive: boolean
  onClick: () => void
}

export const ConversationCard: React.FC<ConversationCardProps> = React.memo(({
  conversation,
  isActive,
  onClick
}) => {
  const otherUser = conversation.otherUser
  const unreadCount = conversation.unreadCount || 0
  const isSupport = otherUser.role === 'admin' || conversation.type === 'support'
  const name = otherUser.full_name || 'Unknown User'
  
  const queryClient = useQueryClient()

  // Format last message for preview
  const lastMessageText = conversation.lastMessage?.message_text || 'Active conversation'

  const timeAgo = conversation.updated_at 
    ? formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })
    : ''

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    await conversationService.pinConversation(conversation.id)
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
  }

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    await conversationService.archiveConversation(conversation.id)
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
  }

  return (
    <div
      className={`group relative w-full transition-colors hover:bg-muted/50 ${
        isActive ? 'bg-muted/80' : ''
      }`}
    >
      <button
        onClick={onClick}
        aria-label={`Conversation with ${name}`}
        className="w-full text-left p-4 focus-visible:outline-none focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <div className="flex items-center gap-3 pr-16">
          <div className="relative flex-shrink-0">
            {otherUser.avatar_url && !isSupport ? (
              <img src={otherUser.avatar_url} alt={name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${isSupport ? 'bg-indigo-500' : 'bg-primary'}`}>
                {isSupport ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
            )}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            {otherUser.online && !isSupport && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`truncate text-sm font-semibold flex items-center gap-1 ${unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {name}
                {conversation.isPinned && <Pin className="w-3 h-3 text-primary fill-primary flex-shrink-0" />}
                {conversation.isArchived && <Archive className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
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

      {/* Action buttons shown on hover */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-background/95 dark:bg-slate-800/95 p-1 rounded-md shadow-md border border-border z-10">
        <button
          onClick={handlePin}
          title={conversation.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}
          className="p-1 hover:bg-muted dark:hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
        >
          <Pin className={`h-3.5 w-3.5 ${conversation.isPinned ? 'fill-primary text-primary' : ''}`} />
        </button>
        <button
          onClick={handleArchive}
          title={conversation.isArchived ? 'Unarchive Conversation' : 'Archive Conversation'}
          className="p-1 hover:bg-muted dark:hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
        >
          <Archive className={`h-3.5 w-3.5 ${conversation.isArchived ? 'fill-primary text-primary' : ''}`} />
        </button>
      </div>
    </div>
  )
})
