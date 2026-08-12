import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface MessageComposerProps {
  onSend: (text: string, fileUrl?: string) => Promise<void>
  disabled?: boolean
  onTyping?: () => void
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  disabled,
  onTyping
}) => {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [text])

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      if (onTyping) onTyping()
    }, 300)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    handleTyping()
  }

  const handleSend = async () => {
    if (!text.trim() || isSending) return
    setIsSending(true)
    try {
      await onSend(text.trim())
      setText('')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === 'Escape') {
      textareaRef.current?.blur()
    }
  }

  return (
    <div className="border-t border-border bg-card p-3 sm:p-4 pb-[env(safe-area-inset-bottom,16px)] shrink-0 w-full max-w-full overflow-hidden">
      <div className="flex items-end gap-1.5 sm:gap-2 rounded-2xl border bg-background p-1.5 sm:p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">


        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          placeholder="Type a message..."
          aria-label="Message text"
          className="max-h-[150px] min-h-[40px] w-full resize-none bg-transparent py-2.5 text-[15px] sm:text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
          rows={1}
        />



        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || isSending || !text.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4 sm:-ml-0.5" />}
        </button>
      </div>
      <div className="mt-2 text-center text-[9px] sm:text-[10px] text-muted-foreground">
        Secure, end-to-end encrypted workspace. Never share credentials here.
      </div>
    </div>
  )
}
