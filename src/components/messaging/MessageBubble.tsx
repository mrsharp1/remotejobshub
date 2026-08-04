import React from 'react'
import { format } from 'date-fns'
import type { Message } from '@/types'
import { FileText, Download } from 'lucide-react'
import { SystemMessage } from './SystemMessage'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage
}) => {
  if (message.is_system || message.message_type === 'system' || message.message_text.startsWith('__SYSTEM__:')) {
    const payloadText = message.message_text.startsWith('__SYSTEM__:') 
      ? message.message_text.replace('__SYSTEM__:', '')
      : message.message_text

    return (
      <SystemMessage 
        payload={payloadText} 
        timestamp={message.created_at} 
        eventType={message.event_type}
      />
    )
  }

  const timeStr = format(new Date(message.created_at), 'h:mm a')
  const hasAttachments = message.attachments && message.attachments.length > 0

  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div 
          className={`relative rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground rounded-br-sm' 
              : 'bg-muted text-foreground rounded-bl-sm border border-border/50'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.message_text}</p>
          
          {hasAttachments && (
            <div className="mt-3 flex flex-col gap-2">
              {message.attachments!.map(att => (
                <div 
                  key={att.id}
                  className={`flex items-center gap-3 rounded-xl p-2 ${
                    isOwnMessage ? 'bg-primary-foreground/10' : 'bg-background'
                  }`}
                >
                  {att.file_type?.includes('image') ? (
                    <img 
                      src={att.file_url} 
                      alt="attachment" 
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                      <FileText className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-xs font-semibold">{att.file_name || 'Attachment'}</p>
                    <p className="text-[10px] opacity-70 uppercase">{att.file_type || 'File'}</p>
                  </div>
                  <a 
                    href={att.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`mt-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
          <span>{timeStr}</span>
        </div>
      </div>
    </div>
  )
}
