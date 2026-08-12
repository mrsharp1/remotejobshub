import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../services'
import type { Notification } from '../types'

export const useMarkAllNotificationsRead = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('User ID required')
      return notificationService.markAllAsRead(userId)
    },
    onMutate: async () => {
      if (!userId) return

      await queryClient.cancelQueries({ queryKey: ['notifications', userId] })

      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications', userId])

      queryClient.setQueryData<Notification[]>(['notifications', userId], (old) => {
        if (!old) return old
        return old.map(n => ({ ...n, is_read: true }))
      })

      return { previousNotifications }
    },
    onError: (_, __, context) => {
      if (context?.previousNotifications && userId) {
        queryClient.setQueryData(['notifications', userId], context.previousNotifications)
      }
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
      }
    },
  })
}
