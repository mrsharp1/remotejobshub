import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { messageService } from '@/features/messaging/services'
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/features/messaging/hooks'
import { useQueryClient } from '@tanstack/react-query'
import type { Message } from '@/types'

import { AdminUserDirectory } from '@/features/messaging/components/AdminUserDirectory'
import { ConversationList } from '@/features/messaging/components/ConversationList'
import { ChatHeader } from '@/features/messaging/components/ChatHeader'
import { ConversationSidebar } from '@/features/messaging/components/ConversationSidebar'
import { EmptyConversation } from '@/features/messaging/components/EmptyConversation'
import { MessageList } from '@/features/messaging/components/MessageList'
import { MessageComposer } from '@/features/messaging/components/MessageComposer'
import { Loader2, ArrowLeft } from 'lucide-react'

type MobileView = 'directory' | 'conversations' | 'chat' | 'details'

export const AdminMessagesPage: React.FC = () => {
  const { user } = useAuthStore()
  const adminId = user?.id || ''
  const queryClient = useQueryClient()
  
  const [activeId, setActiveId] = useState<string | undefined>()
  const [mobileView, setMobileView] = useState<MobileView>('directory')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: conversations = [], isLoading: loading } = useConversations(adminId)
  const { data: messages = [], isLoading: loadingMessages } = useMessages(activeId)
  
  const sendMessageMutation = useSendMessage()
  const markAsReadMutation = useMarkAsRead()

  // Desktop media query
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (activeId && adminId && messages.length > 0) {
      markAsReadMutation.mutate({ conversationId: activeId, userId: adminId })
    }
  }, [activeId, adminId, messages.length])

  useEffect(() => {
    if (!activeId || !adminId) return
    let isMounted = true

    const subscription = messageService.subscribeToMessages(activeId, (newMsg: any) => {
      if (isMounted) {
        queryClient.setQueryData<Message[]>(['messages', activeId], (old) => {
          if (!old) return [newMsg]
          if (old.some(m => m.id === newMsg.id)) return old
          return [...old, newMsg]
        })
        
        if (newMsg.sender_id !== adminId) {
          markAsReadMutation.mutate({ conversationId: activeId, userId: adminId })
        }
      }
    })

    const typingSub = messageService.subscribeToTyping(activeId, (typingUserId) => {
      if (typingUserId !== adminId) {
        setIsTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
      typingSub.unsubscribe()
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [activeId, adminId, queryClient, markAsReadMutation])

  const handleSendMessage = async (text: string, fileUrl?: string) => {
    if (!activeId || !adminId) return
    sendMessageMutation.mutate({ conversationId: activeId, senderId: adminId, text, fileUrl })
  }

  const handleTyping = () => {
    if (activeId && adminId) {
      messageService.broadcastTyping(activeId, adminId)
    }
  }

  const handleUserSelected = (conversationId: string) => {
    setActiveId(conversationId)
    setMobileView('chat')
  }

  const handleConversationSelected = (conversationId: string) => {
    setActiveId(conversationId)
    setMobileView('chat')
  }

  const activeConversation = conversations.find(c => c.id === activeId)

  // Construct augmented messages list with sending status for optimistic updates
  const mutationVariables = sendMessageMutation.variables
  const isMutationPending = sendMessageMutation.isPending

  const augmentedMessages = useMemo(() => {
    if (isMutationPending && mutationVariables && mutationVariables.conversationId === activeId) {
      const tempMsg: Message = {
        id: 'temp-msg-' + Date.now(),
        conversation_id: activeId,
        sender_id: adminId,
        message_text: mutationVariables.text,
        message_type: 'text',
        is_system: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'sending'
      }
      if (!messages.some(m => m.message_text === tempMsg.message_text && Math.abs(new Date(m.created_at).getTime() - new Date(tempMsg.created_at).getTime()) < 3000)) {
        return [...messages, tempMsg]
      }
    }
    return messages
  }, [messages, isMutationPending, mutationVariables, activeId, adminId])

  // -------------------------------------------------------------
  // Panes
  // -------------------------------------------------------------

  const directoryPane = (
    <div className={`h-full w-full lg:w-[320px] flex-shrink-0 ${!isDesktop && mobileView !== 'directory' ? 'hidden' : 'block'}`}>
      <AdminUserDirectory onUserSelected={handleUserSelected} adminId={adminId} />
    </div>
  )

  const conversationsPane = (
    <div className={`h-full w-full lg:w-[320px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col ${!isDesktop && mobileView !== 'conversations' ? 'hidden' : 'flex'}`}>
      {!isDesktop && (
        <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <button onClick={() => setMobileView('directory')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold">Conversations</h2>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <ConversationList 
            conversations={conversations}
            activeConversationId={activeId}
            onSelect={handleConversationSelected}
          />
        )}
      </div>
    </div>
  )

  const chatPane = (
    <div className={`h-full flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0f172a] relative ${!isDesktop && mobileView !== 'chat' ? 'hidden' : 'flex'}`}>
      {activeConversation ? (
        <>
          <div className="flex-shrink-0">
            {!isDesktop && (
              <div className="absolute top-0 left-0 z-10 p-2">
                <button 
                  onClick={() => setMobileView('conversations')}
                  className="p-2 bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 rounded-full shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            )}
            <ChatHeader 
              conversation={activeConversation} 
              isSidebarOpen={sidebarOpen}
              onToggleSidebar={() => {
                if (isDesktop) setSidebarOpen(!sidebarOpen)
                else setMobileView('details')
              }}
              onBack={!isDesktop ? () => setMobileView('conversations') : undefined}
              isTyping={isTyping}
            />
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <MessageList 
              messages={augmentedMessages} 
              userId={adminId} 
              loading={loadingMessages} 
            />
          </div>

          <MessageComposer onSend={handleSendMessage} disabled={loadingMessages} onTyping={handleTyping} />
        </>
      ) : (
        <EmptyConversation />
      )}
    </div>
  )

  const detailsPane = activeConversation && (
    <div className={`h-full w-full lg:w-[320px] flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${!isDesktop && mobileView !== 'details' ? 'hidden' : sidebarOpen || !isDesktop ? 'block' : 'hidden'}`}>
      {!isDesktop && (
        <div className="flex items-center p-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <button onClick={() => setMobileView('chat')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold">Details</h2>
        </div>
      )}
      <ConversationSidebar conversation={activeConversation} />
    </div>
  )

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Mobile nav hints at bottom or top if needed, but per instruction, it's back buttons. */}
      {/* On desktop, show 3 or 4 panes side by side */}
      
      {/* 1. Directory */}
      {directoryPane}
      
      {/* 2. Conversations */}
      {conversationsPane}
      
      {/* 3. Chat */}
      {chatPane}
      
      {/* 4. Details Sidebar */}
      {detailsPane}
    </div>
  )
}
