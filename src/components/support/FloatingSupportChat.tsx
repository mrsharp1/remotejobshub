import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Loader2, X, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { conversationService } from '@/features/messaging/services/conversation.service'
import { toast } from 'sonner'
import { SUPPORT_CONTACTS } from '@/config/support'

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
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
            {/* WhatsApp 1 */}
            <a 
              href={SUPPORT_CONTACTS.whatsapp1.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start gap-1 rounded-xl p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-foreground">WhatsApp Support 1</span>
              </div>
              <span className="text-sm text-slate-500 ml-8">{SUPPORT_CONTACTS.whatsapp1.number}</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-8 group-hover:underline">Chat on WhatsApp →</span>
            </a>

            <div className="mx-4 h-px bg-slate-100 dark:bg-slate-800" />

            {/* WhatsApp 2 */}
            <a 
              href={SUPPORT_CONTACTS.whatsapp2.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start gap-1 rounded-xl p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-foreground">WhatsApp Support 2</span>
              </div>
              <span className="text-sm text-slate-500 ml-8">{SUPPORT_CONTACTS.whatsapp2.number}</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-8 group-hover:underline">Chat on WhatsApp →</span>
            </a>

            <div className="mx-4 h-px bg-slate-100 dark:bg-slate-800" />

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
