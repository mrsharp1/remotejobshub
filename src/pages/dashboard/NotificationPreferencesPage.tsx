import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Save, BellRing } from 'lucide-react'
import { broadcastService } from '@/services/marketplace/broadcast.service'
import { useAuthStore } from '@/stores/authStore'
import { DeviceNotificationControl } from '@/features/notifications/components/DeviceNotificationControl'

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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Title */}
      <div className="border-border/40 border-b pb-5">
        <h1 className="flex items-center gap-2 font-heading text-3xl font-bold text-foreground">
          <BellRing className="h-7 w-7 text-primary" /> Notification Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose which channels and categories you want to opt-in or opt-out from across your account.
        </p>
      </div>

      {/* Device Notifications Section */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground">Push Notifications</h2>
        <DeviceNotificationControl userId={user?.id} />
      </section>

      {/* Email / In-App Preferences */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-foreground">Notification Channels</h2>
        {isLoading ? (
          <div className="flex justify-center py-20 rounded-xl border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form
            onSubmit={handleSavePreferences}
            className="space-y-2 rounded-xl border bg-card shadow-sm overflow-hidden"
          >
            <div className="divide-y divide-border/50">
              {switchesList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 p-5 hover:bg-muted/10 transition-colors"
                >
                  <div className="text-sm">
                    <h4 className="font-bold text-foreground">{item.label}</h4>
                    <p className="mt-1 leading-relaxed text-muted-foreground max-w-[85%]">
                      {item.desc}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center mt-1 shrink-0">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-border bg-muted/20">
              <button
                type="submit"
                disabled={isSaving}
                className="hover:bg-primary/90 flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all disabled:opacity-60 ml-auto shadow-sm"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Channel Preferences
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
export default NotificationPreferencesPage
