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
        // If not found, provision it dynamically
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert([{ user_id: userId, available_balance: 0.00, pending_balance: 0.00, escrow_balance: 0.00, bonus_credits: 10.00, referral_earnings: 0.00 }])
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

  async requestWithdrawal(
    userId: string,
    amount: number,
    bankName: string,
    accountNum: string,
    accountName: string
  ): Promise<WithdrawalRequest> {
    try {
      // 1. Get user wallet
      const wallet = await this.getWallet(userId)
      if (wallet.available_balance < amount) {
        throw new Error('Insufficient available balance for withdrawal.')
      }

      // 2. Debit available balance and add to pending
      const { error: walletError } = await supabase
        .from('wallets')
        .update({
          available_balance: wallet.available_balance - amount,
          pending_balance: wallet.pending_balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)

      if (walletError) throw walletError

      // 3. Create transaction log
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: wallet.id,
          amount: amount,
          type: 'withdrawal',
          status: 'pending',
          description: `Withdrawal request to ${bankName} (${accountNum})`,
        }
      ])

      // 4. Create request
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .insert([
          {
            user_id: userId,
            amount: amount,
            bank_name: bankName,
            account_number: accountNum,
            account_name: accountName,
            status: 'pending',
          }
        ])
        .select()
        .single()

      if (error) throw error

      // 5. Notify user
      await notificationService.createNotification({
        user_id: userId,
        title: 'Withdrawal Submitted 💸',
        message: `Your withdrawal request of $${amount.toFixed(2)} has been submitted for platform review.`,
        type: 'system',
        reference_type: 'order',
        reference_id: data.id,
      })

      return data as WithdrawalRequest;
    } catch (err) {
      console.error('Error in requestWithdrawal:', err)
      throw err
    }
  },

  async approveWithdrawal(requestId: string): Promise<void> {
    try {
      // 1. Get request
      const { data: request, error: reqError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (reqError) throw reqError
      if (request.status !== 'pending') {
        throw new Error('Request is already processed.')
      }

      // 2. Update request status
      await supabase
        .from('withdrawal_requests')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', requestId)

      // 3. Get user wallet and deduct pending_balance
      const wallet = await this.getWallet(request.user_id)
      await supabase
        .from('wallets')
        .update({
          pending_balance: Math.max(0, wallet.pending_balance - request.amount),
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)

      // 4. Update transaction status
      const { data: tx } = await supabase
        .from('wallet_transactions')
        .select('id')
        .eq('wallet_id', wallet.id)
        .eq('type', 'withdrawal')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (tx) {
        await supabase
          .from('wallet_transactions')
          .update({ status: 'completed' })
          .eq('id', tx.id)
      }

      // 5. Notify user
      await notificationService.createNotification({
        user_id: request.user_id,
        title: 'Withdrawal Approved! 🎉',
        message: `Your payout of $${request.amount.toFixed(2)} has been processed successfully.`,
        type: 'system',
        reference_type: 'order',
        reference_id: requestId,
      })
    } catch (err) {
      console.error('Error in approveWithdrawal:', err)
      throw err
    }
  },

  async rejectWithdrawal(requestId: string, reason: string): Promise<void> {
    try {
      // 1. Get request
      const { data: request, error: reqError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (reqError) throw reqError
      if (request.status !== 'pending') {
        throw new Error('Request is already processed.')
      }

      // 2. Update request status
      await supabase
        .from('withdrawal_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      // 3. Get user wallet and restore available_balance
      const wallet = await this.getWallet(request.user_id)
      await supabase
        .from('wallets')
        .update({
          pending_balance: Math.max(0, wallet.pending_balance - request.amount),
          available_balance: wallet.available_balance + request.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)

      // 4. Update transaction status
      const { data: tx } = await supabase
        .from('wallet_transactions')
        .select('id')
        .eq('wallet_id', wallet.id)
        .eq('type', 'withdrawal')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (tx) {
        await supabase
          .from('wallet_transactions')
          .update({ status: 'failed', description: `Rejected: ${reason}` })
          .eq('id', tx.id)
      }

      // 5. Notify user
      await notificationService.createNotification({
        user_id: request.user_id,
        title: 'Withdrawal Rejected ❌',
        message: `Your payout of $${request.amount.toFixed(2)} was rejected. Reason: ${reason}`,
        type: 'system',
        reference_type: 'order',
        reference_id: requestId,
      })
    } catch (err) {
      console.error('Error in rejectWithdrawal:', err)
      throw err
    }
  },

  async adminAdjustBalance(
    userId: string,
    type: 'credit' | 'debit',
    amount: number,
    description: string
  ): Promise<void> {
    try {
      const wallet = await this.getWallet(userId)
      let nextBalance = wallet.available_balance

      if (type === 'credit') {
        nextBalance += amount
      } else {
        nextBalance = Math.max(0, nextBalance - amount)
      }

      // 1. Update wallet balance
      await supabase
        .from('wallets')
        .update({
          available_balance: nextBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)

      // 2. Add transaction
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: wallet.id,
          amount: amount,
          type: type === 'credit' ? 'credit' : 'debit',
          status: 'completed',
          description: description || `Admin balance adjustment`,
        }
      ])

      // 3. Notify user
      await notificationService.createNotification({
        user_id: userId,
        title: `Wallet ${type === 'credit' ? 'Credited' : 'Debited'} 💼`,
        message: `An administrator adjusted your balance. Amount: $${amount.toFixed(2)}.`,
        type: 'system',
        reference_type: 'order',
        reference_id: wallet.id,
      })
    } catch (err) {
      console.error('Error in adminAdjustBalance:', err)
      throw err
    }
  }
}
