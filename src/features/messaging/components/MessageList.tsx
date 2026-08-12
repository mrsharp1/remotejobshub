import React, { useState, useMemo, useRef, useEffect } from 'react'
import { isToday, isYesterday, isThisWeek } from 'date-fns'
import type { Message } from '@/types'
import { MessageBubble } from './MessageBubble'
import { Loader2, Search, ChevronUp, ChevronDown, X } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  userId: string
  loading: boolean
}

const groupMessages = (messages: Message[]) => {
  const groups: Record<string, Message[]> = {
    'Today': [],
    'Yesterday': [],
    'Earlier this Week': [],
    'Older': []
  }

  messages.forEach(msg => {
    const date = new Date(msg.created_at)
    if (isToday(date)) groups['Today'].push(msg)
    else if (isYesterday(date)) groups['Yesterday'].push(msg)
    else if (isThisWeek(date)) groups['Earlier this Week'].push(msg)
    else groups['Older'].push(msg)
  })

  return Object.entries(groups).filter(([_, msgs]) => msgs.length > 0).reverse()
}

export const MessageList: React.FC<MessageListProps> = ({ messages, userId, loading }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [matchIndex, setMatchIndex] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const matchRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!showSearch) {
      scrollToBottom()
    }
  }, [messages.length, showSearch])

  const grouped = useMemo(() => groupMessages(messages), [messages])

  // Search logic
  const matches = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return messages.filter(m => m.message_text.toLowerCase().includes(q))
  }, [messages, searchQuery])

  useEffect(() => {
    if (matches.length > 0 && showSearch) {
      const target = matchRefs.current[matchIndex]
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add a temporary highlight effect
        target.classList.add('bg-yellow-200/50', 'dark:bg-yellow-500/20', 'transition-colors', 'duration-500')
        setTimeout(() => {
          target.classList.remove('bg-yellow-200/50', 'dark:bg-yellow-500/20')
        }, 1500)
      }
    }
  }, [matchIndex, matches, showSearch])

  const handleNextMatch = () => {
    setMatchIndex(prev => (prev + 1) % matches.length)
  }

  const handlePrevMatch = () => {
    setMatchIndex(prev => (prev === 0 ? matches.length - 1 : prev - 1))
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative" ref={containerRef}>
      {showSearch && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 flex items-center gap-2 border-b border-border shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            placeholder="Search in conversation..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setMatchIndex(0)
            }}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
          />
          {matches.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {matchIndex + 1} of {matches.length}
            </span>
          )}
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMatch} disabled={!matches.length} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button onClick={handleNextMatch} disabled={!matches.length} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={() => { setShowSearch(false); setSearchQuery('') }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!showSearch && (
        <button 
          onClick={() => setShowSearch(true)} 
          className="absolute top-2 right-4 z-10 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-colors"
          title="Search messages"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      <div className="flex-1 overflow-y-auto p-4 pt-12">
        <div className="flex flex-col min-h-full justify-end">
          {grouped.map(([groupName, groupMsgs]) => (
            <div key={groupName} className="mb-6">
              <div className="flex justify-center mb-4 sticky top-2 z-0">
                <span className="bg-muted text-muted-foreground text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full shadow-sm">
                  {groupName}
                </span>
              </div>
              <div className="space-y-2">
                {groupMsgs.map(msg => {
                  const isMatch = showSearch && searchQuery && msg.message_text.toLowerCase().includes(searchQuery.toLowerCase())
                  const matchIdx = matches.findIndex(m => m.id === msg.id)
                  return (
                    <div 
                      key={msg.id} 
                      ref={el => { if (isMatch) matchRefs.current[matchIdx] = el }}
                      className="rounded-xl"
                    >
                      <MessageBubble 
                        message={msg} 
                        isOwnMessage={msg.sender_id === userId} 
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
