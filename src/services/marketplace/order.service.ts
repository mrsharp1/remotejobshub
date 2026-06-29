import { supabase } from '@/lib/supabase'
import { Order, OrderTimeline, OrderMessage } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const orderService = {
  async createOrder(
    orderData: {
      buyer_id: string
      seller_id: string
      listing_id: string
      amount: number
    },
    initialNotes = 'Order created. Payment processing details pending.'
  ): Promise<Order> {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert([
          {
            ...orderData,
            status: 'pending',
            currency: 'USD',
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Insert initial timeline step
      const { error: timelineError } = await supabase
        .from('order_timeline')
        .insert([
          {
            order_id: order.id,
            status: 'pending',
            notes: initialNotes,
          },
        ])

      if (timelineError) throw timelineError

      // Dispatch notifications
      try {
        await notificationService.createNotification({
          user_id: orderData.seller_id,
          title: 'New Order Received',
          message: `A buyer has placed an escrow order for your listing.`,
          type: 'order',
          reference_type: 'order',
          reference_id: order.id,
        })

        await notificationService.createNotification({
          user_id: orderData.buyer_id,
          title: 'Escrow Order Created',
          message: `Your escrow transaction has been initiated. Awaiting payment details.`,
          type: 'order',
          reference_type: 'order',
          reference_id: order.id,
        })
      } catch (notifErr) {
        console.error('Failed to create order notifications:', notifErr)
      }

      return order as Order
    } catch (err) {
      console.error('Error in createOrder:', err)
      throw err
    }
  },

  async getBuyerOrders(buyerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, listing:listings(*), seller:profiles(*)')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Order[]
    } catch (err) {
      console.error('Error in getBuyerOrders:', err)
      return []
    }
  },

  async getSellerOrders(sellerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, listing:listings(*), buyer:profiles(*)')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Order[]
    } catch (err) {
      console.error('Error in getSellerOrders:', err)
      return []
    }
  },

  async getOrder(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, listing:listings(*), buyer:profiles(*), seller:profiles(*)')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error in getOrder:', error.message)
        return null
      }
      return data as Order
    } catch (err) {
      console.error('Error in getOrder:', err)
      return null
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    notes?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error

      // Insert timeline tracking step
      const { error: timelineError } = await supabase
        .from('order_timeline')
        .insert([
          {
            order_id: orderId,
            status,
            notes: notes || `Order status updated to ${status}.`,
          },
        ])

      if (timelineError) throw timelineError

      // Dispatch automatic state change notifications
      try {
        const { data: orderDetails } = await supabase
          .from('orders')
          .select('buyer_id, seller_id, amount')
          .eq('id', orderId)
          .single()

        if (orderDetails) {
          const { buyer_id, seller_id, amount } = orderDetails

          if (status === 'payment_received') {
            await notificationService.createNotification({
              user_id: buyer_id,
              title: 'Escrow Payment Secured',
              message: `Your payment of $${amount} was received and is held in escrow.`,
              type: 'payment',
              reference_type: 'order',
              reference_id: orderId,
            })
            await notificationService.createNotification({
              user_id: seller_id,
              title: 'Buyer Payment Secured',
              message: `Payment has been secured in escrow. Please release account credentials.`,
              type: 'order',
              reference_type: 'order',
              reference_id: orderId,
            })
          } else if (status === 'seller_processing') {
            await notificationService.createNotification({
              user_id: buyer_id,
              title: 'Seller Delivering Credentials',
              message: `The seller has accepted and is processing your account transfer.`,
              type: 'order',
              reference_type: 'order',
              reference_id: orderId,
            })
          } else if (status === 'buyer_review') {
            await notificationService.createNotification({
              user_id: buyer_id,
              title: 'Account Credentials Delivered',
              message: `The seller has marked details as delivered. Please verify and confirm receipt.`,
              type: 'order',
              reference_type: 'order',
              reference_id: orderId,
            })
          } else if (status === 'completed') {
            await notificationService.createNotification({
              user_id: seller_id,
              title: 'Escrow Payment Released',
              message: `The buyer confirmed delivery. Your payout of $${amount} has been released.`,
              type: 'payment',
              reference_type: 'order',
              reference_id: orderId,
            })
            await notificationService.createNotification({
              user_id: buyer_id,
              title: 'Escrow Complete',
              message: `Escrow release completed. Thank you for buying with Remote Jobs Hub!`,
              type: 'order',
              reference_type: 'order',
              reference_id: orderId,
            })
          } else if (status === 'cancelled') {
            await notificationService.createNotification({
              user_id: buyer_id,
              title: 'Escrow Cancelled',
              message: `The order reference #${orderId.slice(0, 8)} has been cancelled.`,
              type: 'system',
              reference_type: 'order',
              reference_id: orderId,
            })
            await notificationService.createNotification({
              user_id: seller_id,
              title: 'Escrow Cancelled',
              message: `The order reference #${orderId.slice(0, 8)} has been cancelled.`,
              type: 'system',
              reference_type: 'order',
              reference_id: orderId,
            })
          } else if (status === 'disputed') {
            await notificationService.createNotification({
              user_id: buyer_id,
              title: 'Escrow Dispute Opened',
              message: `A dispute was opened for order #${orderId.slice(0, 8)}. A moderator will review shortly.`,
              type: 'system',
              reference_type: 'order',
              reference_id: orderId,
            })
            await notificationService.createNotification({
              user_id: seller_id,
              title: 'Escrow Dispute Opened',
              message: `A dispute was opened for order #${orderId.slice(0, 8)}. A moderator will review shortly.`,
              type: 'system',
              reference_type: 'order',
              reference_id: orderId,
            })
          }
        }
      } catch (err) {
        console.error('Failed to trigger order state notifications:', err)
      }
    } catch (err) {
      console.error('Error in updateOrderStatus:', err)
      throw err
    }
  },

  async getTimeline(orderId: string): Promise<OrderTimeline[]> {
    try {
      const { data, error } = await supabase
        .from('order_timeline')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data || []) as OrderTimeline[]
    } catch (err) {
      console.error('Error in getTimeline:', err)
      return []
    }
  },

  async sendMessage(
    orderId: string,
    senderId: string,
    messageText: string
  ): Promise<OrderMessage> {
    try {
      const { data, error } = await supabase
        .from('order_messages')
        .insert([
          {
            order_id: orderId,
            sender_id: senderId,
            message_text: messageText,
          },
        ])
        .select('*, sender:profiles(*)')
        .single()

      if (error) throw error
      return data as OrderMessage
    } catch (err) {
      console.error('Error in sendMessage:', err)
      throw err
    }
  },

  async getOrderMessages(orderId: string): Promise<OrderMessage[]> {
    try {
      const { data, error } = await supabase
        .from('order_messages')
        .select('*, sender:profiles(*)')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data || []) as OrderMessage[]
    } catch (err) {
      console.error('Error in getOrderMessages:', err)
      return []
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, listing:listings(*), buyer:profiles(*), seller:profiles(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Order[]
    } catch (err) {
      console.error('Error in getAllOrders:', err)
      return []
    }
  },
}
