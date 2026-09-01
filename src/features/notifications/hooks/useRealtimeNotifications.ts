import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import type { Notification } from '@/types'
import { notificationSoundService } from '@/features/notifications/services/notification-sound.service'
import { setupOnMessageListener, getServiceWorkerRegistration } from '@/lib/firebase'

export const useRealtimeNotifications = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const processedIds = useRef<Set<string>>(new Set())
  const playedSoundIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!user?.id) return

    let unsubscribeFCM: (() => void) | void;

    // 1. Setup Firebase Foreground Listener
    setupOnMessageListener((payload) => {
      const fcmId = payload.data?.notification_id || payload.notification?.title;
      
      // Deduplicate sound
      if (fcmId && !playedSoundIds.current.has(fcmId)) {
        playedSoundIds.current.add(fcmId);
        notificationSoundService.play().catch(console.error);
      }
      
      // Native desktop notification for foreground messages
      if (Notification.permission === 'granted') {
        getServiceWorkerRegistration().then((reg) => {
          const title = payload.notification?.title || payload.data?.title || 'Remote Jobs Hub';
          const options = {
            body: payload.notification?.body || payload.data?.body || 'You have a new notification.',
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            silent: !notificationSoundService.isSoundEnabled(),
            data: { url: payload.data?.url || payload.data?.targetUrl || '/' }
          };
          
          if (reg) {
            reg.showNotification(title, options);
          } else {
            new Notification(title, options);
          }
        }).catch(console.error);
      }
    }).then((unsub) => {
      unsubscribeFCM = unsub;
    }).catch(console.error);

    // 2. Setup Supabase Realtime Listener
    const channel = supabase
      .channel(`public:notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification

          if (processedIds.current.has(newNotif.id)) return
          processedIds.current.add(newNotif.id)

          if (processedIds.current.size > 100) {
            const arr = Array.from(processedIds.current)
            processedIds.current = new Set(arr.slice(arr.length - 50))
          }

          if (!playedSoundIds.current.has(newNotif.id)) {
            playedSoundIds.current.add(newNotif.id);
            notificationSoundService.play().catch(console.error);
          }
          
          if (playedSoundIds.current.size > 100) {
            const arr = Array.from(playedSoundIds.current)
            playedSoundIds.current = new Set(arr.slice(arr.length - 50))
          }

          if (newNotif.priority === 'critical') {
            toast.error(newNotif.title, { description: newNotif.message })
          } else if (newNotif.type === 'payment' || newNotif.type === 'wallet' || newNotif.type === 'escrow') {
            toast.success(newNotif.title, { description: newNotif.message })
          } else {
            toast.info(newNotif.title, { description: newNotif.message })
          }

          queryClient.invalidateQueries({ queryKey: ['recent-notifications', user.id] })
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
          queryClient.invalidateQueries({ queryKey: ['unread-notifications', user.id] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      if (unsubscribeFCM) {
        unsubscribeFCM()
      }
    }
  }, [user?.id, queryClient])
}
