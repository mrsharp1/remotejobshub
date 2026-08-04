import React from 'react'
import { MessageSquare } from 'lucide-react'

export const EmptyConversation: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-card">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MessageSquare className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
        Your Messages Workspace
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Select a conversation from the sidebar to view your transaction timeline, chat securely, and access support.
      </p>
    </div>
  )
}
