import { supabase } from '@/lib/supabase'
import { Payment } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'
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
        await featureNotificationService.createNotification({
          user_id: payment.buyer_id,
          title: 'Order Completed',
          message: 'Your order has been completed successfully.',
          type: 'payment_completed',
          category: 'order',
          priority: 'important',
          target_url: `/dashboard/orders/${payment.order_id}`,
          link: `/dashboard/orders/${payment.order_id}`,
          metadata: {
            reference_type: 'order',
            reference_id: payment.order_id,
          }
        })

        // Seller Notification: escrow_released
        await featureNotificationService.createNotification({
          user_id: payment.seller_id,
          title: 'Payment Released',
          message: 'Funds from your completed order have been released to your wallet.',
          type: 'escrow_released',
          category: 'wallet',
          priority: 'important',
          target_url: `/seller/orders/${payment.order_id}`,
          link: `/seller/orders/${payment.order_id}`,
          metadata: {
            reference_type: 'order',
            reference_id: payment.order_id,
          }
        })
      }
    } catch (err) {
      console.error('Error in markReleased:', err)
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
        await notificationService.createNotification({
          user_id: payment.buyer_id,
          title: 'Escrow Funds Refunded 💸',
          message: `Escrow payment of $${payment.amount} has been refunded back to your account.`,
          type: 'payment',
          category: 'wallet',
          priority: 'important',
          target_url: `/dashboard/orders/${payment.order_id}`,
          reference_type: 'order',
          reference_id: payment.order_id,
        })
      }
    } catch (err) {
      console.error('Error in markRefunded:', err)
      throw err
    }
  },
}
