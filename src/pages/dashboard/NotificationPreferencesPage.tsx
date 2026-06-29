import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Save, BellRing } from 'lucide-react'
import { broadcastService } from '@/services/marketplace/broadcast.service'
import { useAuthStore } from '@/stores/authStore'

export const NotificationPreferencesPage: React.FC = () => {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState(true)
  const [payments, setPayments] = useState(true)
  const [messages, setMessages] = useState(true)
  const [promotions, setPromotions] = useState(true)
  const [updates, setUpdates] = useState(true)
  const [announcements, setAnnouncements] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch initial preferences
  const {
    data: prefs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user-notification-preferences', user?.id],
    queryFn: () =>
      user?.id ? broadcastService.getNotificationPreferences(user.id) : null,
    enabled: !!user?.id,
  })

  // Sync state
  useEffect(() => {
    if (prefs) {
      setOrders(prefs.orders_enabled)
      setPayments(prefs.payments_enabled)
      setMessages(prefs.messages_enabled)
      setPromotions(prefs.promotions_enabled)
      setUpdates(prefs.updates_enabled)
      setAnnouncements(prefs.announcements_enabled)
    }
  }, [prefs])

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    setIsSaving(true)
    try {
      await broadcastService.updateNotificationPreferences(user.id, {
        orders_enabled: orders,
        payments_enabled: payments,
        messages_enabled: messages,
        promotions_enabled: promotions,
        updates_enabled: updates,
        announcements_enabled: announcements,
      })
      await refetch()
      alert('Preferences updated successfully!')
    } catch {
      alert('Failed to update preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const switchesList = [
    {
      label: 'Transactional Orders Updates',
      desc: 'Alerts regarding order updates, milestones, and seller deliverables.',
      value: orders,
      setter: setOrders,
    },
    {
      label: 'Escrow Payment Handshakes',
      desc: 'Secure alerts when funds are deposited, cleared, or released from escrow.',
      value: payments,
      setter: setPayments,
    },
    {
      label: 'Chat Messaging Alerts',
      desc: 'Notification alerts when buyers or sellers send you direct in-app messages.',
      value: messages,
      setter: setMessages,
    },
    {
      label: 'Platform Promotions & Referrals',
      desc: 'Announcements detailing promotional discount credits and referral earnings.',
      value: promotions,
      setter: setPromotions,
    },
    {
      label: 'System Software Updates',
      desc: 'Notifications on platform feature additions, updates, and maintenance cycles.',
      value: updates,
      setter: setUpdates,
    },
    {
      label: 'Targeted Admin Announcements',
      desc: 'Targeted platform alerts and announcements composed by system moderators.',
      value: announcements,
      setter: setAnnouncements,
    },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <h1 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
          <BellRing className="h-6 w-6 text-primary" /> Notification Settings
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Choose which channels and categories you want to opt-in or opt-out
          from.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form
          onSubmit={handleSavePreferences}
          className="space-y-6 rounded-xl border bg-card p-5 shadow-sm"
        >
          <div className="space-y-5">
            {switchesList.map((item, idx) => (
              <div
                key={idx}
                className="border-border/30 flex items-start justify-between gap-4 border-b pb-4 last:border-b-0"
              >
                <div className="text-xs">
                  <h4 className="font-bold text-foreground">{item.label}</h4>
                  <p className="mt-0.5 leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save Preferences Configuration
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
export default NotificationPreferencesPage
