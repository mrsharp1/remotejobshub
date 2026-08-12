import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/features/messaging/services'

export const useUserDirectory = (searchQuery?: string, roleFilter?: string, sortBy?: string) => {
  return useQuery({
    queryKey: ['admin-users', searchQuery, roleFilter, sortBy],
    queryFn: () => adminService.getUsers(searchQuery, roleFilter, sortBy),
  })
}
