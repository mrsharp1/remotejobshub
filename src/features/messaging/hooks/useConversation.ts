import { useQuery } from '@tanstack/react-query'
import { conversationService } from '@/features/messaging/services'
import type { ConversationViewModel } from '@/types'

export const useConversation = (id: string | undefined, userId: string | undefined) => {
  return useQuery<ConversationViewModel | null>({
    queryKey: ['conversation', id, userId],
    queryFn: () => conversationService.getConversation(id!, userId!),
    enabled: !!id && !!userId,
  })
}
