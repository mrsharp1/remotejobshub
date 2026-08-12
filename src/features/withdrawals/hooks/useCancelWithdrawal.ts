import { useMutation, useQueryClient } from '@tanstack/react-query'
import { withdrawalService } from '../services/withdrawal.service'

interface CancelWithdrawalArgs {
  requestId: string
  userId: string
}

export const useCancelWithdrawal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ requestId }: CancelWithdrawalArgs) =>
      withdrawalService.cancelWithdrawal(requestId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['withdrawal', variables.requestId] })
      queryClient.invalidateQueries({ queryKey: ['wallet', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['seller-withdrawals', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
    },
  })
}
