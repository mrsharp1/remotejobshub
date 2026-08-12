import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messageService } from '@/features/messaging/services'
import type { Message } from '@/types'

interface SendMessageArgs {
  conversationId: string
  senderId: string
  text: string
  fileUrl?: string | null
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation<Message, Error, SendMessageArgs>({
    mutationFn: ({ conversationId, senderId, text, fileUrl }) => 
      messageService.sendMessage(conversationId, senderId, text, fileUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })
}
