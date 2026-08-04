import React from 'react'
import { MoreVertical, Phone, Video, ShieldCheck, User, ChevronLeft } from 'lucide-react'
import type { ConversationViewModel } from '@/types'

interface ChatHeaderProps {
  conversation: ConversationViewModel
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  onBack?: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onToggleSidebar,
  isSidebarOpen,
  onBack
}) => {
  const otherUser = conversation.otherUser
  const isSupport = otherUser.role === 'admin' || conversation.type === 'support'
  const name = isSupport ? 'Support Team' : (otherUser.full_name || 'Unknown User')

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 z-10 shrink-0">
      <div className="flex items-center gap-3">
        {onBack && (
          <button 
            onClick={onBack}
            className="md:hidden -ml-2 p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div className="relative">
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
        <div>
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            {name}
            {isSupport && (
              <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-indigo-500">
                Support
              </span>
            )}
          </h2>
          {otherUser.online && !isSupport && (
            <p className="text-xs text-emerald-500 font-medium">Online</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
        <button className="hidden rounded-full p-2 hover:bg-muted sm:block transition-colors">
          <Phone className="h-4 w-4" />
        </button>
        <button className="hidden rounded-full p-2 hover:bg-muted sm:block transition-colors">
          <Video className="h-4 w-4" />
        </button>
        
        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
        
        <button 
          onClick={onToggleSidebar}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hidden xl:block ${
            isSidebarOpen ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
        >
          {isSidebarOpen ? 'Hide Info' : 'Show Info'}
        </button>

        <button className="rounded-full p-2 hover:bg-muted transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
