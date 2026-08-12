import { useQuery } from '@tanstack/react-query'
import { conversationService } from '@/features/messaging/services'
import type { ConversationViewModel } from '@/types'

export const useConversations = (userId: string | undefined) => {
  return useQuery<ConversationViewModel[]>({
    queryKey: ['conversations', userId],
    queryFn: () => conversationService.getConversations(userId!),
    enabled: !!userId,
  })
}
