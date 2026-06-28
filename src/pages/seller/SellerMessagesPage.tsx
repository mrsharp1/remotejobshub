import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MessageSquare,
  Search,
  Send,
  Loader2,
  Paperclip,
  ExternalLink,
  User,
} from 'lucide-react'
import { messageService } from '@/services/marketplace/message.service'
import { useAuthStore } from '@/stores/authStore'
import { Message } from '@/types'

export const SellerMessagesPage: React.FC = () => {
  const { user } = useAuthStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Selection states
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  // Fetch all conversations
  const {
    data: conversations = [],
    refetch: refetchConvs,
    isLoading,
  } = useQuery({
    queryKey: ['seller-conversations-list', user?.id],
    queryFn: () => (user?.id ? messageService.getConversations(user.id) : []),
    enabled: !!user?.id,
  })

  // Selected conversation detail
  const activeConv = conversations.find((c) => c.id === selectedConvId)
  const otherParticipant = activeConv?.participants?.find(
    (p) => p.user_id !== user?.id
  )

  // Fetch initial messages when selectedConvId changes
  useEffect(() => {
    if (!selectedConvId) return
    const fetchInitMessages = async () => {
      const data = await messageService.getMessages(selectedConvId)
      setMessages(data)
      if (user?.id) {
        await messageService.markAsRead(selectedConvId, user.id)
        refetchConvs()
      }
    }
    fetchInitMessages()

    // Subscribe to realtime messages channel
    const channel = messageService.subscribeToMessages(
      selectedConvId,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev
          return [...prev, newMsg]
        })
        if (user?.id) {
          messageService.markAsRead(selectedConvId, user.id)
        }
      }
    )

    return () => {
      channel.unsubscribe()
    }
  }, [selectedConvId, user?.id, refetchConvs])

  // Scroll to bottom of message feed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handlers
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConvId || !user || !inputText.trim()) return
    try {
      const msg = await messageService.sendMessage(
        selectedConvId,
        user.id,
        inputText.trim(),
        fileUrl.trim() || null
      )
      setMessages((prev) => [...prev, msg])
      setInputText('')
      setFileUrl('')
      refetchConvs()
    } catch {
      alert('Failed to send message')
    }
  }

  // Filtered conversations
  const filteredConvs = conversations.filter((c) => {
    const peer = c.participants?.find((p) => p.user_id !== user?.id)
    return (
      (peer?.profile?.full_name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (c.listing?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Quick Replies
  const quickReplies = [
    'Hello, thank you for your query! Yes, the credentials are ready for transfer.',
    'I can complete the escrow handoff within 1 hour.',
    'The listing price is fixed, but I can offer assistance configuring it.',
    'Let me know when you secure the funds in escrow, and I will deliver.',
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Seller Message Center
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Chat securely in real-time with buyers regarding listing details.
        </p>
      </div>

      <div className="grid h-[600px] grid-cols-1 items-stretch gap-6 overflow-hidden rounded-xl border bg-card shadow-sm md:grid-cols-12">
        {/* Left Side: Conversations List */}
        <div className="bg-muted/10 flex h-full flex-col border-r md:col-span-4">
          <div className="space-y-2 border-b p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Customer Chats
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search customers or listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background py-1.5 pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          <div className="divide-border/50 flex-1 divide-y overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="py-12 text-center text-xs italic text-muted-foreground">
                No active conversations.
              </div>
            ) : (
              filteredConvs.map((c) => {
                const peer = c.participants?.find((p) => p.user_id !== user?.id)
                const currentParticipant = c.participants?.find(
                  (p) => p.user_id === user?.id
                )
                const hasUnread =
                  currentParticipant && currentParticipant.unread_count > 0

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={`flex w-full gap-3 p-3.5 text-left transition-colors ${
                      selectedConvId === c.id
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'hover:bg-muted/30 bg-background'
                    }`}
                  >
                    <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted font-bold text-muted-foreground">
                      {peer?.profile?.avatar_url ? (
                        <img
                          src={peer.profile.avatar_url}
                          alt={peer.profile.full_name || 'Buyer'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        peer?.profile?.full_name?.charAt(0) || (
                          <User className="h-4.5 w-4.5" />
                        )
                      )}
                    </div>

                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-start justify-between gap-1">
                        <span className="block truncate font-bold text-foreground">
                          {peer?.profile?.full_name || 'Buyer'}
                        </span>
                        {hasUnread && (
                          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                            {currentParticipant.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {c.listing?.title || 'Account Asset'}
                      </p>
                      <p className="mt-1 truncate text-[10px] font-medium text-foreground">
                        {c.last_message_text || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Window Workspace */}
        <div className="flex h-full flex-col bg-background md:col-span-8">
          {selectedConvId && activeConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-muted/10 flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-muted font-bold">
                    {otherParticipant?.profile?.avatar_url ? (
                      <img
                        src={otherParticipant.profile.avatar_url}
                        alt={otherParticipant.profile.full_name || 'Buyer'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      otherParticipant?.profile?.full_name?.charAt(0) || (
                        <User className="h-4.5 w-4.5" />
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1 font-heading text-xs font-bold text-foreground">
                      {otherParticipant?.profile?.full_name || 'Buyer'}
                    </h3>
                    <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      Listing:{' '}
                      <span className="font-bold">
                        {activeConv.listing?.title}
                      </span>
                    </span>
                  </div>
                </div>

                {activeConv.listing_id && (
                  <a
                    href={`/listings/${activeConv.listing_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-muted"
                  >
                    View Listing <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Chat Messages Log */}
              <div className="bg-muted/5 flex-1 space-y-3.5 overflow-y-auto p-4">
                {messages.map((msg) => {
                  const isSelf = msg.sender_id === user?.id
                  return (
                    <div
                      key={msg.id}
                      className={`flex max-w-[70%] flex-col rounded-xl border p-3 text-xs leading-relaxed ${
                        isSelf
                          ? 'border-primary/20 ml-auto bg-primary text-white shadow-sm'
                          : 'border-border/80 shadow-xs bg-card text-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.message_text}</p>
                      {msg.attachments?.map((at) => (
                        <div
                          key={at.id}
                          className="bg-background/10 mt-2 overflow-hidden rounded-lg border"
                        >
                          <img
                            src={at.file_url}
                            alt="uploaded asset"
                            className="max-h-40 w-full cursor-pointer object-cover hover:opacity-90"
                            onClick={() => window.open(at.file_url, '_blank')}
                          />
                        </div>
                      ))}
                      <span
                        className={`mt-1.5 block text-right text-[8px] font-bold ${
                          isSelf ? 'text-white/80' : 'text-muted-foreground'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies Panel */}
              <div className="scrollbar-none bg-muted/10 flex gap-1.5 overflow-x-auto whitespace-nowrap border-t px-4 py-2">
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(qr)}
                    className="rounded border bg-background px-2.5 py-1 text-[10px] font-bold text-muted-foreground transition-colors hover:bg-muted"
                  >
                    {qr.slice(0, 30)}...
                  </button>
                ))}
              </div>

              {/* Chat Input form box */}
              <form
                onSubmit={handleSendMessage}
                className="space-y-3 border-t bg-background p-4"
              >
                {fileUrl && (
                  <div className="bg-muted/40 flex items-center justify-between rounded-lg border p-2 text-[10px]">
                    <span className="truncate font-semibold text-muted-foreground">
                      Attachment Link: {fileUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFileUrl('')}
                      className="font-bold text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt(
                        'Enter image screenshot URL link to attach:'
                      )
                      if (url) setFileUrl(url)
                    }}
                    className="rounded-lg border p-2 text-muted-foreground hover:bg-muted"
                    title="Attach Image"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  <input
                    type="text"
                    placeholder="Type secure message details..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 rounded-lg border bg-background p-2.5 text-xs text-foreground"
                    required
                  />

                  <button
                    type="submit"
                    className="hover:bg-primary/95 rounded-lg bg-primary p-2.5 text-white transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="m-4 flex flex-1 flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed p-6 text-center">
              <MessageSquare className="h-10 w-10 animate-bounce text-muted-foreground" />
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Select a customer
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Select a buyer from the left customer listing panel.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default SellerMessagesPage
