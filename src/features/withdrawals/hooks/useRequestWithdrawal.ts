import { useMutation, useQueryClient } from '@tanstack/react-query'
import { withdrawalService } from '../services/withdrawal.service'

interface RequestWithdrawalArgs {
  userId: string
  amount: number
  bankName: string
  accountNumber: string
  accountName: string
}

export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, amount, bankName, accountNumber, accountName }: RequestWithdrawalArgs) =>
      withdrawalService.requestWithdrawal(userId, amount, bankName, accountNumber, accountName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['wallet', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['seller-withdrawals', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
    },
  })
}
