import React, { useState } from 'react'
import { Search } from 'lucide-react'
import type { ConversationViewModel } from '@/types'
import { ConversationCard } from './ConversationCard'

interface ConversationListProps {
  conversations: ConversationViewModel[]
  activeConversationId?: string
  onSelect: (id: string) => void
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelect
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'support' | 'disputes'>('all')
  const [search, setSearch] = useState('')

  const filteredConversations = [...conversations].filter(c => {
    const otherUser = c.otherUser
    const otherName = otherUser.full_name?.toLowerCase() || ''
    const otherUsername = otherUser.username?.toLowerCase() || ''
    const otherEmail = otherUser.email?.toLowerCase() || ''
    
    const searchTerm = search.toLowerCase()
    const matchesSearch = 
      otherName.includes(searchTerm) || 
      otherUsername.includes(searchTerm) ||
      otherEmail.includes(searchTerm) ||
      (c.listing?.title?.toLowerCase() || '').includes(searchTerm)
    
    if (!matchesSearch) return false

    if (filter === 'unread') {
      // V2 unread logic pending; currently unsupported on client
      return false
    }
    
    // Simplistic check for support/disputes
    if (filter === 'support' && c.type !== 'support') return false
    if (filter === 'disputes' && c.type !== 'dispute') return false

    return true
  }).sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime()
    const dateB = new Date(b.updated_at).getTime()
    return dateB - dateA
  })

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border p-4">
        <h2 className="mb-4 font-heading text-lg font-bold">Conversations</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['all', 'unread', 'support', 'disputes'] as const).map(f => (
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
}
