import { useQuery } from '@tanstack/react-query'
import { messageService } from '@/features/messaging/services'
import type { Message } from '@/types'

export const useMessages = (conversationId: string | undefined) => {
  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => messageService.getMessages(conversationId!),
    enabled: !!conversationId,
  })
}
