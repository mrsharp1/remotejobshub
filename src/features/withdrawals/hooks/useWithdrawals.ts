import { useQuery } from '@tanstack/react-query'
import { withdrawalService } from '../services/withdrawal.service'

export const useWithdrawals = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['withdrawals', userId],
    queryFn: () => withdrawalService.getMyWithdrawals(userId!),
    enabled: !!userId,
  })
}
