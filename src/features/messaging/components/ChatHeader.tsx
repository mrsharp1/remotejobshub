import React, { useState } from 'react'
import { MoreVertical, ShieldCheck, User, ChevronLeft, Pin, Archive } from 'lucide-react'
import type { ConversationViewModel } from '@/types'
import { conversationService } from '@/features/messaging/services'
import { useQueryClient } from '@tanstack/react-query'


interface ChatHeaderProps {
  conversation: ConversationViewModel
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  onBack?: () => void
  isTyping?: boolean
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({
  conversation,
  onToggleSidebar,
  isSidebarOpen,
  onBack,
  isTyping
}) => {
  const otherUser = conversation.otherUser
  const isSupport = otherUser.role === 'admin' || conversation.type === 'support'
  const name = otherUser.full_name || 'Unknown User'
  
  const queryClient = useQueryClient()
  const [menuOpen, setMenuOpen] = useState(false)

  const handlePin = async () => {
    await conversationService.pinConversation(conversation.id)
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
    setMenuOpen(false)
  }

  const handleArchive = async () => {
    await conversationService.archiveConversation(conversation.id)
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
    if (onBack) onBack()
    setMenuOpen(false)
  }

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 z-10 shrink-0 w-full min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {onBack && (
          <button 
            onClick={onBack}
            className="md:hidden -ml-2 p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors shrink-0"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div className="relative shrink-0">
          {otherUser.avatar_url && !isSupport ? (
            <img src={otherUser.avatar_url} alt={name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${isSupport ? 'bg-indigo-500' : 'bg-primary'}`}>
              {isSupport ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
          )}
          {otherUser.online && !isSupport && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-1.5 sm:gap-2">
            <span className="truncate block max-w-[100px] xs:max-w-[130px] sm:max-w-[200px] md:max-w-none">{name}</span>
            {isSupport && (
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-indigo-500 shrink-0">
                Support
              </span>
            )}
            {conversation.isPinned && (
              <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
            {conversation.isArchived && (
              <Archive className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </h2>
          {isTyping ? (
            <p className="text-xs text-primary font-medium animate-pulse truncate">Typing...</p>
          ) : otherUser.online && !isSupport ? (
            <p className="text-xs text-emerald-500 font-medium truncate">Online</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground relative">

        
        <button 
          onClick={onToggleSidebar}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hidden xl:block ${
            isSidebarOpen ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          {isSidebarOpen ? 'Hide Info' : 'Show Info'}
        </button>

        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 hover:bg-muted transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover text-popover-foreground shadow-md z-50">
            <div className="flex flex-col p-1">
              <button onClick={handlePin} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted w-full text-left">
                <Pin className="h-4 w-4" />
                {conversation.isPinned ? 'Unpin' : 'Pin'} Conversation
              </button>
              <button onClick={handleArchive} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted w-full text-left">
                <Archive className="h-4 w-4" />
                {conversation.isArchived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
