import React, { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import type { ConversationViewModel } from '@/types'
import { ConversationCard } from './ConversationCard'

interface ConversationListProps {
  conversations: ConversationViewModel[]
  activeConversationId?: string
  onSelect: (id: string) => void
}

export const ConversationList: React.FC<ConversationListProps> = React.memo(({
  conversations,
  activeConversationId,
  onSelect
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'support' | 'disputes' | 'archived'>('all')
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState('')

  // Debounce search input by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue)
    }, 250)

    return () => {
      clearTimeout(handler)
    }
  }, [inputValue])

  const filteredConversations = useMemo(() => {
    // Deduplicate conversations to prevent duplicate rendering
    const seenIds = new Set<string>()
    const uniqueConversations = conversations.filter(c => {
      if (seenIds.has(c.id)) return false
      seenIds.add(c.id)
      return true
    })

    return uniqueConversations.filter(c => {
      const otherUser = c.otherUser
      const otherName = otherUser.full_name?.toLowerCase() || ''
      const otherEmail = otherUser.email?.toLowerCase() || ''
      const latestMessagePreview = c.lastMessage?.message_text?.toLowerCase() || ''
      
      const searchTerm = search.toLowerCase()
      
      // Search matches: otherUser.full_name, email, latest message preview (case insensitive)
      const matchesSearch = 
        otherName.includes(searchTerm) || 
        otherEmail.includes(searchTerm) ||
        latestMessagePreview.includes(searchTerm)
      
      if (!matchesSearch) return false

      if (filter === 'archived') {
        if (!c.isArchived) return false
      } else {
        if (c.isArchived) return false
        if (filter === 'unread' && c.unreadCount === 0) return false
        if (filter === 'support' && c.type !== 'support') return false
        if (filter === 'disputes' && c.type !== 'dispute') return false
      }

      return true
    }).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      const dateA = new Date(a.updated_at).getTime()
      const dateB = new Date(b.updated_at).getTime()
      return dateB - dateA
    })
  }, [conversations, filter, search])

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border p-4">
        <h2 className="mb-4 font-heading text-lg font-bold">Conversations</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['all', 'unread', 'support', 'disputes', 'archived'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No conversations found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map(conv => (
              <ConversationCard 
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => onSelect(conv.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
