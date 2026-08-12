import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageService } from '@/features/messaging/services'

interface MarkAsReadArgs {
  conversationId: string
  userId: string
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, MarkAsReadArgs>({
    mutationFn: ({ conversationId, userId }) => 
      messageService.markAsRead(conversationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })
}
