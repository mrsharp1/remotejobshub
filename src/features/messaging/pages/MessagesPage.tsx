import React, { useEffect, useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { messageService } from '@/features/messaging/services'
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/features/messaging/hooks'
import { useQueryClient } from '@tanstack/react-query'
import type { Message } from '@/types'
import { ConversationLayout } from '@/features/messaging/components/ConversationLayout'
import { ConversationList } from '@/features/messaging/components/ConversationList'
import { ChatHeader } from '@/features/messaging/components/ChatHeader'

import { MessageComposer } from '@/features/messaging/components/MessageComposer'
import { ConversationSidebar } from '@/features/messaging/components/ConversationSidebar'
import { EmptyConversation } from '@/features/messaging/components/EmptyConversation'
import { MessageList } from '@/features/messaging/components/MessageList'
import { Loader2 } from 'lucide-react'

export const MessagesPage: React.FC = () => {
  const { user } = useAuthStore()
  const userId = user?.id || ''
  const queryClient = useQueryClient()
  const location = useLocation()
  const incomingActiveId = location.state?.activeConversationId
  
  const [activeId, setActiveId] = useState<string | undefined>(incomingActiveId)
  
  useEffect(() => {
    if (incomingActiveId) {
      setActiveId(incomingActiveId)
    }
  }, [incomingActiveId])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: conversations = [], isLoading: loading } = useConversations(userId)
  const { data: messages = [], isLoading: loadingMessages } = useMessages(activeId)
  
  const sendMessageMutation = useSendMessage()
  const markAsReadMutation = useMarkAsRead()

  // Mark as read when activeId changes and we have messages
  useEffect(() => {
    if (activeId && userId && messages.length > 0) {
      markAsReadMutation.mutate({ conversationId: activeId, userId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, userId, messages.length])

  // Setup realtime subscription
  useEffect(() => {
    if (!activeId || !userId) return
    let isMounted = true

    const subscription = messageService.subscribeToMessages(activeId, (newMsg: any) => {
      if (isMounted) {
        // Update query cache for messages
        queryClient.setQueryData<Message[]>(['messages', activeId], (old) => {
          if (!old) return [newMsg]
          // prevent duplicate
          if (old.some(m => m.id === newMsg.id)) return old
          return [...old, newMsg]
        })
        
        if (newMsg.sender_id !== userId) {
          markAsReadMutation.mutate({ conversationId: activeId, userId })
        }
      }
    })

    const typingSub = messageService.subscribeToTyping(activeId, (typingUserId) => {
      if (typingUserId !== userId) {
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
  }, [activeId, userId, queryClient, markAsReadMutation])

  const handleSendMessage = async (text: string, fileUrl?: string) => {
    if (!activeId || !userId) return
    sendMessageMutation.mutate({ conversationId: activeId, senderId: userId, text, fileUrl })
  }

  const handleTyping = () => {
    if (activeId && userId) {
      messageService.broadcastTyping(activeId, userId)
    }
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
        sender_id: userId,
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
  }, [messages, isMutationPending, mutationVariables, activeId, userId])

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const leftPanel = (
    <ConversationList 
      conversations={conversations}
      activeConversationId={activeId}
      onSelect={setActiveId}
    />
  )

  const centerPanel = activeConversation ? (
    <>
      <ChatHeader 
        conversation={activeConversation} 
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onBack={() => setActiveId(undefined)}
        isTyping={isTyping}
      />
      
      <div className="flex-1 overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a]">
        <MessageList 
          messages={augmentedMessages} 
          userId={userId} 
          loading={loadingMessages} 
        />
      </div>

      <MessageComposer onSend={handleSendMessage} disabled={loadingMessages} onTyping={handleTyping} />
    </>
  ) : (
    <EmptyConversation />
  )

  const rightPanel = activeConversation ? (
    <ConversationSidebar conversation={activeConversation} />
  ) : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <ConversationLayout 
        sidebarOpen={sidebarOpen}
        leftPanel={leftPanel}
        centerPanel={centerPanel}
        rightPanel={rightPanel}
        hasActiveId={!!activeId}
      />
    </motion.div>
  )
}
