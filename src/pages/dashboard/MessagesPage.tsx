import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { messageService } from '@/services/marketplace/message.service'
import type { ConversationViewModel, Message } from '@/types'
import { ConversationLayout } from '@/components/messaging/ConversationLayout'
import { ConversationList } from '@/components/messaging/ConversationList'
import { ChatHeader } from '@/components/messaging/ChatHeader'
import { MessageBubble } from '@/components/messaging/MessageBubble'
import { MessageComposer } from '@/components/messaging/MessageComposer'
import { ConversationSidebar } from '@/components/messaging/ConversationSidebar'
import { EmptyConversation } from '@/components/messaging/EmptyConversation'
import { Loader2 } from 'lucide-react'

export const MessagesPage: React.FC = () => {
  const { user } = useAuthStore()
  const userId = user?.id || ''
  
  const [conversations, setConversations] = useState<ConversationViewModel[]>([])
  const [activeId, setActiveId] = useState<string | undefined>()
  const [messages, setMessages] = useState<Message[]>([])
  
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch all conversations
  useEffect(() => {
    if (!userId) return
    const fetchConvs = async () => {
      const data = await messageService.getConversations(userId)
      setConversations(data)
      setLoading(false)
    }
    fetchConvs()
  }, [userId])

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeId || !userId) return
    
    let isMounted = true
    setLoadingMessages(true)
    
    const fetchMsgs = async () => {
      const data = await messageService.getMessages(activeId)
      if (isMounted) {
        setMessages(data)
        setLoadingMessages(false)
        await messageService.markAsRead(activeId, userId)
        scrollToBottom()
      }
    }
    
    fetchMsgs()

    // Setup realtime subscription
    const subscription = messageService.subscribeToMessages(activeId, (newMsg: any) => {
      if (isMounted) {
        setMessages(prev => [...prev, newMsg])
        if (newMsg.sender_id !== userId) {
          messageService.markAsRead(activeId, userId)
        }
        setTimeout(scrollToBottom, 100)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [activeId, userId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (text: string, fileUrl?: string) => {
    if (!activeId || !userId) return
    
    // Optimistic UI update could go here, but for simplicity we rely on subscription
    await messageService.sendMessage(activeId, userId, text, fileUrl)
  }

  const activeConversation = conversations.find(c => c.id === activeId)

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
      />
      
      <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] dark:bg-[#0f172a]">
        {loadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col min-h-full justify-end">
            <div className="space-y-2 py-4">
              {messages.map(msg => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isOwnMessage={msg.sender_id === userId} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      <MessageComposer onSend={handleSendMessage} disabled={loadingMessages} />
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
