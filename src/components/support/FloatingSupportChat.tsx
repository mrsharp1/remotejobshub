import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Loader2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { conversationService } from '@/features/messaging/services/conversation.service'
import { toast } from 'sonner'
// SUPPORT_CONTACTS import removed (no longer used)

export const FloatingSupportChat: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleInAppSupportClick = async () => {
    // Unauthenticated visitor
    if (!user) {
      navigate('/login')
      return
    }

    // Authenticated user
    setIsLoading(true)
    try {
      const conversation = await conversationService.createSupportConversation(user.id)
      if (conversation) {
        navigate('/dashboard/messages', { state: { activeConversationId: conversation.id } })
        setIsOpen(false)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initialize support chat.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 sm:bottom-6 z-50 flex flex-col items-end">
      {/* Popover Panel */}
      {isOpen && (
        <div 
          ref={panelRef}
          className="mb-4 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 origin-bottom-right"
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div>
              <h3 className="text-lg font-bold text-foreground">Need Help? 👋</h3>
              <p className="text-sm text-muted-foreground">Choose how you'd like to contact Remote Jobs Hub.</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close support panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col p-2">
            {/* WhatsApp Support */}
            <a 
              href="https://wa.me/2348108938663"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full flex-col items-start gap-1 rounded-xl p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="font-semibold text-foreground">WhatsApp Support</span>
              </div>
              <span className="text-sm text-slate-500 ml-8">Message us on WhatsApp.</span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 ml-8 group-hover:underline">Open WhatsApp &rarr;</span>
            </a>
            {/* In-App Support */}
            <button 
              onClick={handleInAppSupportClick}
              disabled={isLoading}
              className="group flex w-full flex-col items-start gap-1 rounded-xl p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquare className="h-3.5 w-3.5" />}
                </div>
                <span className="font-semibold text-foreground">In-App Support</span>
              </div>
              <span className="text-sm text-slate-500 ml-8">Chat with our support team.</span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-8 group-hover:underline">Open Support →</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background dark:bg-blue-600 dark:hover:bg-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? "Close support menu" : "Contact Support"}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">Contact Support</span>
      </button>
    </div>
  )
}
