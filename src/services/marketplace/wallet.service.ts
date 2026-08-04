import { supabase } from '@/lib/supabase'
import { Wallet, WalletTransaction, WithdrawalRequest } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const walletService = {
  async getWallet(userId: string): Promise<Wallet> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        // Auto-provision if missing
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert([{ user_id: userId }])
          .select()
          .single()

        if (createError) throw createError
        return newWallet as Wallet
      }

      return data as Wallet
    } catch (err) {
      console.error('Error in getWallet:', err)
      throw err
    }
  },

  async getTransactions(walletId: string): Promise<WalletTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as WalletTransaction[]
    } catch (err) {
      console.error('Error in getTransactions:', err)
      return []
    }
  },
  // Client-side wallet modifications are prohibited by RLS and architecture rules.
  // All financial logic has been moved to secure PostgreSQL RPCs.

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
        title: 'Withdrawal Submitted ⏳',
        message: `Your request to withdraw ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} is pending administration review.`,
        type: 'system',
        reference_type: 'order',
        reference_id: data.request_id,
      })

      return { id: data.request_id } as WithdrawalRequest
    } catch (err) {
      console.error('Error in requestWithdrawal:', err)
      throw err
    }
  },

  async approveWithdrawal(requestId: string): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('rpc_process_withdrawal', {
        p_request_id: requestId,
        p_action: 'approve',
        p_reason: '',
      })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error('Error in approveWithdrawal:', err)
      throw err
    }
  },

  async rejectWithdrawal(requestId: string, reason: string): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('rpc_process_withdrawal', {
        p_request_id: requestId,
        p_action: 'reject',
        p_reason: reason,
      })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error('Error in rejectWithdrawal:', err)
      throw err
    }
  },

  async adminAdjustWallet(
    walletId: string,
    amount: number,
    type: 'credit' | 'debit',
    reason: string
  ): Promise<void> {
    try {
      const idempotencyKey = `ADJ-${walletId}-${Date.now()}`

      const { data, error } = await supabase.rpc('rpc_admin_adjust_wallet', {
        p_wallet_id: walletId,
        p_amount: amount,
        p_type: type,
        p_reason: reason,
        p_idempotency_key: idempotencyKey,
      })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error('Error in adminAdjustWallet:', err)
      throw err
    }
  },
}
