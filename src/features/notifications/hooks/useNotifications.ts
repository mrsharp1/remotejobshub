import { useQuery } from '@tanstack/react-query'
import { notificationService } from '../services'

export const useNotifications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationService.getNotifications(userId!),
    enabled: !!userId,
  })
}
