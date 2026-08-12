import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import type { Notification } from '@/types'

export const useRealtimeNotifications = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const processedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!user?.id) return

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

          // Deduplicate by ID
          if (processedIds.current.has(newNotif.id)) return
          processedIds.current.add(newNotif.id)

          // Clear old IDs to prevent memory leak
          if (processedIds.current.size > 100) {
            const arr = Array.from(processedIds.current)
            processedIds.current = new Set(arr.slice(arr.length - 50))
          }

          // Trigger Toast
          if (newNotif.priority === 'critical') {
            toast.error(newNotif.title, { description: newNotif.message })
          } else if (newNotif.type === 'payment' || newNotif.type === 'wallet' || newNotif.type === 'escrow') {
            toast.success(newNotif.title, { description: newNotif.message })
          } else {
            toast.info(newNotif.title, { description: newNotif.message })
          }

          // Invalidate React Query caches for notifications and unread counts
          queryClient.invalidateQueries({ queryKey: ['recent-notifications', user.id] })
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
          queryClient.invalidateQueries({ queryKey: ['unread-notifications', user.id] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, queryClient])
}
