import { supabase } from '@/lib/supabase'
import { notificationService } from '@/features/notifications/services'
import type { WithdrawalRequest } from '../types'

export const withdrawalService = {
  async requestWithdrawal(
    userId: string,
    amount: number,
    bankName: string,
    accountNumber: string,
    accountName: string
  ): Promise<WithdrawalRequest> {
    try {
      const idempotencyKey = `WD-${userId}-${Date.now()}`

      const { data, error } = await supabase.rpc('rpc_request_withdrawal', {
        p_amount: amount,
        p_bank_name: bankName,
        p_account_number: accountNumber,
        p_account_name: accountName,
        p_idempotency_key: idempotencyKey,
      })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.message)
      }

      // Send self-notification (Allowed by RLS)
      await notificationService.createNotification({
        user_id: userId,
        title: 'Withdrawal Request Submitted',
        message: 'Your withdrawal request has been submitted successfully and is awaiting admin review.',
        type: 'withdrawal_requested',
        link: '/dashboard/wallet',
        metadata: {
          reference_type: 'withdrawal',
          reference_id: data.request_id,
        }
      })

      return {
        id: data.request_id,
        user_id: userId,
        amount,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    } catch (err) {
      console.error('Error in requestWithdrawal:', err)
      throw err
    }
  },

  async cancelWithdrawal(requestId: string): Promise<void> {
    try {
      const withdrawal = await withdrawalService.getWithdrawal(requestId)
      if (!withdrawal) throw new Error('Withdrawal request not found')

      const { data, error } = await supabase.rpc('rpc_cancel_withdrawal', {
        p_request_id: requestId,
      })

      if (error) throw error

      if (data && !data.success) {
        throw new Error(data.message)
      }

      await notificationService.createNotification({
        user_id: withdrawal.user_id,
        title: 'Withdrawal Cancelled',
        message: 'Your withdrawal request has been cancelled successfully.',
        type: 'withdrawal_cancelled',
        link: '/dashboard/wallet',
        metadata: {
          reference_type: 'withdrawal',
          reference_id: requestId,
        }
      })
    } catch (err) {
      console.error('Error in cancelWithdrawal:', err)
      throw err
    }
  },

  async getMyWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as WithdrawalRequest[]
    } catch (err) {
      console.error('Error in getMyWithdrawals:', err)
      throw err
    }
  },

  async getWithdrawal(requestId: string): Promise<WithdrawalRequest | null> {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*, profile:profiles(*)')
        .eq('id', requestId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }
      return data as WithdrawalRequest
    } catch (err) {
      console.error('Error in getWithdrawal:', err)
      throw err
    }
  },

  async adminApproveWithdrawal(requestId: string): Promise<void> {
    try {
      const withdrawal = await withdrawalService.getWithdrawal(requestId)
      if (!withdrawal) throw new Error('Withdrawal request not found')

      const { data, error } = await supabase.rpc('rpc_process_withdrawal', {
        p_request_id: requestId,
        p_action: 'approve',
        p_reason: '',
      })

      if (error) throw error

      if (data && !data.success) {
        throw new Error(data.message)
      }

      await notificationService.createNotification({
        user_id: withdrawal.user_id,
        title: 'Withdrawal Approved',
        message: 'Your withdrawal has been approved and payment is being processed.',
        type: 'withdrawal_approved',
        link: '/dashboard/wallet',
        metadata: {
          reference_type: 'withdrawal',
          reference_id: requestId,
        }
      })
    } catch (err) {
      console.error('Error in adminApproveWithdrawal:', err)
      throw err
    }
  },

  async adminRejectWithdrawal(requestId: string, reason: string): Promise<void> {
    try {
      const withdrawal = await withdrawalService.getWithdrawal(requestId)
      if (!withdrawal) throw new Error('Withdrawal request not found')

      const { data, error } = await supabase.rpc('rpc_process_withdrawal', {
        p_request_id: requestId,
        p_action: 'reject',
        p_reason: reason,
      })

      if (error) throw error

      if (data && !data.success) {
        throw new Error(data.message)
      }

      await notificationService.createNotification({
        user_id: withdrawal.user_id,
        title: 'Withdrawal Rejected',
        message: 'Your withdrawal request has been rejected. Any held balance has been returned to your wallet.',
        type: 'withdrawal_rejected',
        link: '/dashboard/wallet',
        metadata: {
          reference_type: 'withdrawal',
          reference_id: requestId,
          reason,
        }
      })
    } catch (err) {
      console.error('Error in adminRejectWithdrawal:', err)
      throw err
    }
  },
}
