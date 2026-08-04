import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, Loader2 } from 'lucide-react'

interface MessageComposerProps {
  onSend: (text: string, fileUrl?: string) => Promise<void>
  disabled?: boolean
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  disabled
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
  }

  return (
    <div className="border-t border-border bg-card p-4 pb-safe shrink-0">
      <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <button
          type="button"
          disabled={disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          placeholder="Type a message..."
          className="max-h-[150px] min-h-[40px] w-full resize-none bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
          rows={1}
        />

        <button
          type="button"
          disabled={disabled}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors sm:flex disabled:opacity-50"
        >
          <Smile className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || isSending || !text.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4 -ml-0.5" />}
        </button>
      </div>
      <div className="mt-2 text-center text-[10px] text-muted-foreground">
        Secure, end-to-end encrypted workspace. Never share credentials here.
      </div>
    </div>
  )
}
