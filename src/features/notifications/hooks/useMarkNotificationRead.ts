import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../services'
import type { Notification } from '../types'

export const useMarkNotificationRead = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      if (!userId) return

      await queryClient.cancelQueries({ queryKey: ['notifications', userId] })

      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications', userId])

      queryClient.setQueryData<Notification[]>(['notifications', userId], (old) => {
        if (!old) return old
        return old.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
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
