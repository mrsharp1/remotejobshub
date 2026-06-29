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

  async creditWallet(
    walletId: string,
    amount: number,
    description: string,
    type: 'deposit' | 'bonus' | 'referral' | 'credit' = 'credit'
  ): Promise<void> {
    try {
      // 1. Fetch current wallet balances
      const { data: wallet, error: getErr } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single()

      if (getErr) throw getErr

      let available = Number(wallet.available_balance)
      let bonus = Number(wallet.bonus_credits)
      let referral = Number(wallet.referral_earnings)

      if (type === 'bonus') {
        bonus += amount
      } else if (type === 'referral') {
        referral += amount
      } else {
        available += amount
      }

      // 2. Update wallet
      const { error: updateErr } = await supabase
        .from('wallets')
        .update({
          available_balance: available,
          bonus_credits: bonus,
          referral_earnings: referral,
          updated_at: new Date().toISOString(),
        })
        .eq('id', walletId)

      if (updateErr) throw updateErr

      // 3. Add transaction record
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: walletId,
          amount,
          type,
          status: 'completed',
          description,
        },
      ])

      // 4. Send notification
      await notificationService.createNotification({
        user_id: wallet.user_id,
        title: 'Wallet Credited 💰',
        message: `Your wallet was credited with $${amount.toFixed(2)}. Reason: ${description}`,
        type: 'system',
        reference_type: 'order', // default placeholder
        reference_id: walletId,
      })
    } catch (err) {
      console.error('Error in creditWallet:', err)
      throw err
    }
  },

  async debitWallet(
    walletId: string,
    amount: number,
    description: string,
    type: 'withdrawal' | 'debit' = 'debit'
  ): Promise<void> {
    try {
      // 1. Fetch current wallet
      const { data: wallet, error: getErr } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single()

      if (getErr) throw getErr

      if (Number(wallet.available_balance) < amount) {
        throw new Error('Insufficient wallet balance')
      }

      const available = Number(wallet.available_balance) - amount

      // 2. Update wallet
      const { error: updateErr } = await supabase
        .from('wallets')
        .update({
          available_balance: available,
          updated_at: new Date().toISOString(),
        })
        .eq('id', walletId)

      if (updateErr) throw updateErr

      // 3. Add transaction
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: walletId,
          amount: -amount,
          type,
          status: 'completed',
          description,
        },
      ])

      // 4. Send notification
      await notificationService.createNotification({
        user_id: wallet.user_id,
        title: 'Wallet Debited 💸',
        message: `Your wallet was debited by $${amount.toFixed(2)}. Reason: ${description}`,
        type: 'system',
        reference_type: 'order',
        reference_id: walletId,
      })
    } catch (err) {
      console.error('Error in debitWallet:', err)
      throw err
    }
  },

  async transferToEscrow(
    walletId: string,
    amount: number,
    referenceId?: string
  ): Promise<void> {
    try {
      // Fetch wallet
      const { data: wallet, error: getErr } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single()

      if (getErr) throw getErr

      if (Number(wallet.available_balance) < amount) {
        throw new Error('Insufficient wallet balance')
      }

      const available = Number(wallet.available_balance) - amount
      const escrow = Number(wallet.escrow_balance) + amount

      await supabase
        .from('wallets')
        .update({
          available_balance: available,
          escrow_balance: escrow,
          updated_at: new Date().toISOString(),
        })
        .eq('id', walletId)

      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: walletId,
          amount: -amount,
          type: 'escrow_hold',
          status: 'completed',
          description: `Funds committed to escrow order #${referenceId?.slice(0, 8)}`,
          reference_id: referenceId,
        },
      ])

      await notificationService.createNotification({
        user_id: wallet.user_id,
        title: 'Escrow Funded 🔒',
        message: `$${amount.toFixed(2)} was held in escrow for order transfer verification checks.`,
        type: 'system',
        reference_type: 'order',
        reference_id: referenceId || walletId,
      })
    } catch (err) {
      console.error('Error in transferToEscrow:', err)
      throw err
    }
  },

  async releaseEscrow(
    walletId: string,
    amount: number,
    referenceId?: string
  ): Promise<void> {
    try {
      // Fetch wallet
      const { data: wallet, error: getErr } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single()

      if (getErr) throw getErr

      const escrow = Math.max(0, Number(wallet.escrow_balance) - amount)
      const available = Number(wallet.available_balance) + amount

      await supabase
        .from('wallets')
        .update({
          available_balance: available,
          escrow_balance: escrow,
          updated_at: new Date().toISOString(),
        })
        .eq('id', walletId)

      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: walletId,
          amount,
          type: 'escrow_release',
          status: 'completed',
          description: `Escrow released for order #${referenceId?.slice(0, 8)}`,
          reference_id: referenceId,
        },
      ])

      await notificationService.createNotification({
        user_id: wallet.user_id,
        title: 'Escrow Released ✅',
        message: `$${amount.toFixed(2)} was released from escrow into your available balance.`,
        type: 'system',
        reference_type: 'order',
        reference_id: referenceId || walletId,
      })
    } catch (err) {
      console.error('Error in releaseEscrow:', err)
      throw err
    }
  },

  async requestWithdrawal(
    userId: string,
    amount: number,
    bankName: string,
    accountNumber: string,
    accountName: string
  ): Promise<WithdrawalRequest> {
    try {
      const wallet = await this.getWallet(userId)
      if (Number(wallet.available_balance) < amount) {
        throw new Error('Insufficient wallet balance for withdrawal')
      }

      // 1. Move available balance to pending balance
      const available = Number(wallet.available_balance) - amount
      const pending = Number(wallet.pending_balance) + amount

      const { error: walletErr } = await supabase
        .from('wallets')
        .update({
          available_balance: available,
          pending_balance: pending,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id)

      if (walletErr) throw walletErr

      // 2. Insert withdrawal request
      const { data: request, error: reqErr } = await supabase
        .from('withdrawal_requests')
        .insert([
          {
            user_id: userId,
            amount,
            bank_name: bankName,
            account_number: accountNumber,
            account_name: accountName,
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (reqErr) throw reqErr

      // 3. Add pending transaction
      await supabase.from('wallet_transactions').insert([
        {
          wallet_id: wallet.id,
          amount: -amount,
          type: 'withdrawal',
          status: 'pending',
          description: `Withdrawal request submitted to ${bankName}`,
          reference_id: request.id,
        },
      ])

      // 4. Send notification
      await notificationService.createNotification({
        user_id: userId,
        title: 'Withdrawal Submitted ⏳',
        message: `Your request to withdraw $${amount.toFixed(2)} is pending administration review.`,
        type: 'system',
        reference_type: 'order',
        reference_id: request.id,
      })

      return request as WithdrawalRequest
    } catch (err) {
      console.error('Error in requestWithdrawal:', err)
      throw err
    }
  },

  async approveWithdrawal(requestId: string): Promise<void> {
    try {
      // 1. Fetch withdrawal request details
      const { data: request, error: getReqErr } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (getReqErr) throw getReqErr

      if (request.status !== 'pending') {
        throw new Error('Withdrawal request is already processed')
      }

      // 2. Fetch user wallet details
      const wallet = await this.getWallet(request.user_id)
      const pending = Math.max(
        0,
        Number(wallet.pending_balance) - Number(request.amount)
      )

      // 3. Update wallet pending balance
      await supabase
        .from('wallets')
        .update({
          pending_balance: pending,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id)

      // 4. Update request status
      await supabase
        .from('withdrawal_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      // 5. Update transaction status
      await supabase
        .from('wallet_transactions')
        .update({ status: 'completed' })
        .eq('wallet_id', wallet.id)
        .eq('reference_id', requestId)

      // 6. Notify user
      await notificationService.createNotification({
        user_id: request.user_id,
        title: 'Withdrawal Approved 🎉',
        message: `Your payout withdrawal of $${Number(request.amount).toFixed(2)} has been approved and processed!`,
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
      // 1. Fetch request details
      const { data: request, error: getReqErr } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (getReqErr) throw getReqErr

      if (request.status !== 'pending') {
        throw new Error('Withdrawal request is already processed')
      }

      // 2. Fetch user wallet details
      const wallet = await this.getWallet(request.user_id)
      const pending = Math.max(
        0,
        Number(wallet.pending_balance) - Number(request.amount)
      )
      const available =
        Number(wallet.available_balance) + Number(request.amount)

      // 3. Revert wallet available balance from pending balance
      await supabase
        .from('wallets')
        .update({
          available_balance: available,
          pending_balance: pending,
          updated_at: new Date().toISOString(),
        })
        .eq('id', wallet.id)

      // 4. Update request status
      await supabase
        .from('withdrawal_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      // 5. Fail transaction status
      await supabase
        .from('wallet_transactions')
        .update({
          status: 'failed',
          description: `Withdrawal rejected: ${reason}`,
        })
        .eq('wallet_id', wallet.id)
        .eq('reference_id', requestId)

      // 6. Notify user
      await notificationService.createNotification({
        user_id: request.user_id,
        title: 'Withdrawal Rejected ⚠️',
        message: `Your request of $${Number(request.amount).toFixed(2)} was rejected. Reason: ${reason}`,
        type: 'system',
        reference_type: 'order',
        reference_id: requestId,
      })
    } catch (err) {
      console.error('Error in rejectWithdrawal:', err)
      throw err
    }
  },
}
