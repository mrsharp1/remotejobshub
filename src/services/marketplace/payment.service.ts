import { supabase } from '@/lib/supabase'
import { Payment } from '@/types'

import { notificationService as featureNotificationService } from '@/features/notifications/services'

export const paymentService = {
  // Legacy initializePayment and verifyPayment removed for wallet-only atomic checkout

  async getPayment(id: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(
          '*, order:orders(*), buyer:profiles!payments_buyer_id_fkey(*), seller:profiles!payments_seller_id_fkey(*)'
        )
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Payment
    } catch (err) {
      console.error('Error in getPayment:', err)
      return null
    }
  },

  async getPaymentByOrderId(orderId: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(
          '*, order:orders(*), buyer:profiles!payments_buyer_id_fkey(*), seller:profiles!payments_seller_id_fkey(*)'
        )
        .eq('order_id', orderId)
        .single()

      if (error) throw error
      return data as Payment
    } catch (err) {
      console.error('Error in getPaymentByOrderId:', err)
      return null
    }
  },

  async getBuyerPayments(buyerId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(
          '*, order:orders(*, listing:listings(*)), seller:profiles!payments_seller_id_fkey(*)'
        )
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Payment[]
    } catch (err) {
      console.error('Error in getBuyerPayments:', err)
      return []
    }
  },

  async getSellerPayments(sellerId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(
          '*, order:orders(*, listing:listings(*)), buyer:profiles!payments_buyer_id_fkey(*)'
        )
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Payment[]
    } catch (err) {
      console.error('Error in getSellerPayments:', err)
      return []
    }
  },

  async markReleased(id: string): Promise<void> {
    try {
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single()

      const { data, error } = await supabase.rpc('rpc_release_escrow', { p_payment_id: id })
      
      if (error) throw error
      
      // Check for application-level errors returned as JSON by the RPC
      if (data && data.success === false) {
        throw new Error(data.message || 'Failed to release escrow')
      }

      if (payment) {
        // Buyer Notification: payment_completed
        

        // Seller Notification: escrow_released
        
      }
    } catch (err) {
      console.error('Error in markReleased:', err)
      await featureNotificationService.notifyAdmins({
        type: 'payment',
        title: 'Critical Payment Issue',
        message: 'Escrow release failed.',
        priority: 'critical',
      })
      throw err
    }
  },

  async markRefunded(id: string): Promise<void> {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          payment_status: 'refunded',
          refunded_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      if (payment) {
        // Notify buyer
        
      }
    } catch (err) {
      console.error('Error in markRefunded:', err)
      await featureNotificationService.notifyAdmins({
        type: 'payment',
        title: 'Critical Payment Issue',
        message: 'Refund processing failed.',
        priority: 'critical',
      })
      throw err
    }
  },
}
