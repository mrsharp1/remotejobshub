import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  MessageSquare,
  Shield,
  Eye,
  Trash2,
  AlertTriangle,
  Loader2,
  Download,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Conversation, Message } from '@/types'

export const AdminMessagesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isMsgLoading, setIsMsgLoading] = useState(false)

  // Fetch all platform conversations
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['admin-all-conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, listing:listings(*)')
        .order('updated_at', { ascending: false })

      if (error) throw error

      const parsedConvs: Conversation[] = []
      if (data) {
        for (const c of data) {
          const { data: parts } = await supabase
            .from('conversation_participants')
            .select('*, profile:profiles(*)')
            .eq('conversation_id', c.id)

          parsedConvs.push({
            ...c,
            participants: parts || [],
          } as Conversation)
        }
      }
      return parsedConvs
    },
  })

  // Select handler to audit chat logs
  const handleInspectConversation = async (id: string) => {
    setSelectedConvId(id)
    setIsMsgLoading(true)
    try {
      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages((msgs || []) as Message[])
    } catch {
      alert('Failed to fetch messages')
    } finally {
      setIsMsgLoading(false)
    }
  }

  // Export transcript as JSON
  const handleExportTranscript = () => {
    if (!selectedConvId) return
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(messages, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute(
      'download',
      `transcript-${selectedConvId.slice(0, 8)}.json`
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Filtered list
  const filteredConvs = conversations.filter((c) => {
    const titles = c.listing?.title || ''
    const participantNames =
      c.participants?.map((p) => p.profile?.full_name || '').join(' ') || ''
    return (
      titles.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participantNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const activeConv = conversations.find((c) => c.id === selectedConvId)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
          Security Administrator Control Panel
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Platform Conversations Audit Log
        </h1>
      </div>

      <div className="grid h-[600px] grid-cols-1 items-stretch gap-6 overflow-hidden rounded-xl border bg-card shadow-sm lg:grid-cols-12">
        {/* Left Side: Audit list */}
        <div className="bg-muted/10 flex h-full flex-col border-r lg:col-span-4">
          <div className="space-y-2 border-b p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Conversations History
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by ID, profiles, or listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background py-1.5 pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          <div className="divide-border/40 flex-1 divide-y overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-destructive" />
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="py-10 text-center text-xs italic text-muted-foreground">
                No conversations logged on platform.
              </div>
            ) : (
              filteredConvs.map((c) => {
                const participantsText = c.participants
                  ?.map((p) => p.profile?.full_name || 'User')
                  .join(' & ')
                return (
                  <button
                    key={c.id}
                    onClick={() => handleInspectConversation(c.id)}
                    className={`w-full p-3.5 text-left transition-colors ${
                      selectedConvId === c.id
                        ? 'bg-destructive/5 border-l-4 border-destructive'
                        : 'hover:bg-muted/30 bg-background'
                    }`}
                  >
                    <div className="truncate text-[10px] font-bold text-foreground">
                      Case #{c.id.slice(0, 8)}
                    </div>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      Participants: {participantsText}
                    </p>
                    <span className="mt-1.5 block text-[8px] text-muted-foreground">
                      Last update:{' '}
                      {c.last_message_sent_at
                        ? new Date(c.last_message_sent_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Auditor Workspace */}
        <div className="flex h-full flex-col bg-background lg:col-span-8">
          {selectedConvId && activeConv ? (
            isMsgLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-destructive" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-muted/10 flex items-center justify-between border-b p-4">
                  <div>
                    <h3 className="font-heading text-xs font-bold text-foreground">
                      Auditing Conversation Case #{activeConv.id.slice(0, 8)}
                    </h3>
                    <div className="mt-0.5 text-[9px] text-muted-foreground">
                      Listing Reference:{' '}
                      <span className="font-bold">
                        {activeConv.listing?.title || 'Account Asset'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleExportTranscript}
                      className="inline-flex items-center gap-1.5 rounded border bg-background px-3 py-1.5 text-[10px] font-bold hover:bg-muted"
                    >
                      <Download className="h-3.5 w-3.5" /> Export JSON
                    </button>
                  </div>
                </div>

                {/* Audit Chat Messages logs */}
                <div className="bg-muted/5 flex-1 space-y-3.5 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <p className="py-20 text-center text-xs italic text-muted-foreground">
                      No messages sent yet in this conversation.
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="shadow-xs border-border/60 space-y-1 rounded-lg border bg-card p-3 text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="font-bold text-foreground">
                            {msg.sender?.full_name || 'Participant'}
                          </span>
                          <span>
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-mono leading-relaxed text-muted-foreground">
                          {msg.message_text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )
          ) : (
            <div className="m-4 flex flex-1 flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed p-6 text-center">
              <Shield className="h-10 w-10 animate-pulse text-muted-foreground" />
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Audit Panel Idle
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Select a conversation from the sidebar list to inspect
                  transcripts.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AdminMessagesPage
