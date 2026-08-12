import type { Profile } from '@/types'

export interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  bank_name: string
  account_number: string
  account_name: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string | null
  created_at: string
  updated_at: string
  profile?: Profile
}
