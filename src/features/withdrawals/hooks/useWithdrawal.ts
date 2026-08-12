import { useQuery } from '@tanstack/react-query'
import { withdrawalService } from '../services/withdrawal.service'

export const useWithdrawal = (requestId: string | undefined) => {
  return useQuery({
    queryKey: ['withdrawal', requestId],
    queryFn: () => withdrawalService.getWithdrawal(requestId!),
    enabled: !!requestId,
  })
}
