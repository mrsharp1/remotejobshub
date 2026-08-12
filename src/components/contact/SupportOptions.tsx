import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Loader2 } from 'lucide-react'
import { SUPPORT_CONTACTS } from '@/config/support'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { conversationService } from '@/features/messaging/services/conversation.service'
import { toast } from 'sonner'

export const SupportOptions: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleInAppSupportClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
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
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initialize support chat.')
    } finally {
      setIsLoading(false)
    }
  }

  const options = [
    {
      icon: Phone,
      title: 'WhatsApp Support 1',
      desc: SUPPORT_CONTACTS.whatsapp1.number,
      action: 'Chat on WhatsApp',
      link: SUPPORT_CONTACTS.whatsapp1.url,
      gradient: 'from-green-500/20 to-green-500/0',
      iconColor: 'text-green-500',
    },
    {
      icon: Phone,
      title: 'WhatsApp Support 2',
      desc: SUPPORT_CONTACTS.whatsapp2.number,
      action: 'Chat on WhatsApp',
      link: SUPPORT_CONTACTS.whatsapp2.url,
      gradient: 'from-green-500/20 to-green-500/0',
      iconColor: 'text-green-500',
    },
    {
      icon: Mail,
      title: 'Email Support',
      desc: SUPPORT_CONTACTS.email.address,
      action: 'Email Us',
      link: SUPPORT_CONTACTS.email.url,
      gradient: 'from-blue-500/20 to-blue-500/0',
      iconColor: 'text-blue-500',
    },
    {
      icon: MessageSquare,
      title: 'Telegram Community',
      desc: 'Join our verified, scam-free ecosystem to ask general trade questions.',
      action: 'Join Telegram Community →',
      link: SUPPORT_CONTACTS.telegram.url,
      gradient: 'from-sky-500/20 to-sky-500/0',
      iconColor: 'text-sky-500',
    },
    {
      icon: MessageSquare,
      title: 'In-App Support',
      desc: 'Chat directly with the Remote Jobs Hub support team inside the platform.',
      action: 'Chat with Support →',
      link: '#',
      onClick: handleInAppSupportClick,
      gradient: 'from-violet-500/20 to-violet-500/0',
      iconColor: 'text-violet-500',
      isLoading: isLoading
    },
  ]

  return (
    <section className="relative z-20 -mt-20 px-4 pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {options.map((opt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card group relative overflow-hidden p-8"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
                    <opt.icon className={`h-7 w-7 ${opt.iconColor}`} />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{opt.title}</h3>
                  <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{opt.desc}</p>
                </div>
                {opt.onClick ? (
                  <button
                    onClick={opt.onClick}
                    disabled={opt.isLoading}
                    className={`inline-flex items-center justify-center rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 disabled:opacity-50`}
                  >
                    {opt.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {opt.action}
                  </button>
                ) : (
                  <a
                    href={opt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}
                  >
                    {opt.action}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
