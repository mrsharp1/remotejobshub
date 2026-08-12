import { supabase } from '@/lib/supabase'
import { Order, OrderTimeline, OrderMessage } from '@/types'

const PROFILE_SELECT = 'id, full_name, avatar_url, seller_verified'

export const orderService = {
  async checkoutWithWallet(listingId: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('rpc_checkout_with_wallet', {
        p_listing_id: listingId,
      })

      if (error) {
        console.error('Checkout error:', error)
        throw new Error(error.message || 'Failed to complete checkout')
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to complete checkout')
      }

      // Notifications are now handled purely by the rpc_checkout_with_wallet trigger/rpc natively
      // to guarantee atomicity and prevent duplicate notifications.

      return data
    } catch (err: any) {
      console.error('Error in checkoutWithWallet:', err)
      throw new Error(err.message || 'Checkout failed')
    }
  },

  async getBuyerOrders(buyerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, listing:listings(*), seller:profiles!orders_seller_id_fkey(${PROFILE_SELECT})`)
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
        .select(`*, listing:listings(*), buyer:profiles!orders_buyer_id_fkey(${PROFILE_SELECT})`)
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
        .select(`*, listing:listings(*), buyer:profiles!orders_buyer_id_fkey(${PROFILE_SELECT}), seller:profiles!orders_seller_id_fkey(${PROFILE_SELECT})`)
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

  async markSellerProcessing(orderId: string, sellerId: string): Promise<void> {
    try {
      const { data: order, error: fetchErr } = await supabase.from('orders').select('id, seller_id, buyer_id, status').eq('id', orderId).single()
      if (fetchErr) throw fetchErr
      if (!order) throw new Error('Order not found')
      if (order.seller_id !== sellerId) throw new Error('Unauthorized: only seller can update')
      if (order.status !== 'payment_received') throw new Error('Invalid state transition: order must be payment_received')

      const { error: updateErr } = await supabase.from('orders').update({ status: 'seller_processing' }).eq('id', orderId)
      if (updateErr) throw updateErr

      await supabase.from('order_timeline').insert([{ order_id: orderId, status: 'seller_processing', notes: 'Seller has accepted and is processing your account transfer.' }])
    } catch (err) {
      console.error('Error in markSellerProcessing:', err)
      throw err
    }
  },

  async markBuyerReview(orderId: string, sellerId: string): Promise<void> {
    try {
      const { data: order, error: fetchErr } = await supabase.from('orders').select('id, seller_id, buyer_id, status').eq('id', orderId).single()
      if (fetchErr) throw fetchErr
      if (!order) throw new Error('Order not found')
      if (order.seller_id !== sellerId) throw new Error('Unauthorized: only seller can update')
      if (order.status !== 'seller_processing') throw new Error('Invalid state transition: order must be seller_processing')

      const { error: updateErr } = await supabase.from('orders').update({ status: 'buyer_review' }).eq('id', orderId)
      if (updateErr) throw updateErr

      await supabase.from('order_timeline').insert([{ order_id: orderId, status: 'buyer_review', notes: 'Listing details submitted for final review.' }])
    } catch (err) {
      console.error('Error in markBuyerReview:', err)
      throw err
    }
  },

  async markDisputed(orderId: string, userId: string, notes: string): Promise<void> {
    try {
      const { data: order, error: fetchErr } = await supabase.from('orders').select('id, seller_id, buyer_id, status').eq('id', orderId).single()
      if (fetchErr) throw fetchErr
      if (!order) throw new Error('Order not found')
      if (order.buyer_id !== userId && order.seller_id !== userId) throw new Error('Unauthorized: only participants can dispute')
      if (['completed', 'cancelled', 'disputed'].includes(order.status)) throw new Error('Invalid state transition: order is already in a terminal state')

      const { error: updateErr } = await supabase.from('orders').update({ status: 'disputed' }).eq('id', orderId)
      if (updateErr) throw updateErr

      await supabase.from('order_timeline').insert([{ order_id: orderId, status: 'disputed', notes }])
    } catch (err) {
      console.error('Error in markDisputed:', err)
      throw err
    }
  },

  async cancelOrder(orderId: string, userId: string, notes: string): Promise<void> {
    try {
      const { data: order, error: fetchErr } = await supabase.from('orders').select('id, seller_id, buyer_id, status').eq('id', orderId).single()
      if (fetchErr) throw fetchErr
      if (!order) throw new Error('Order not found')
      if (order.seller_id !== userId && order.buyer_id !== userId) throw new Error('Unauthorized: only participants can cancel')
      if (order.status !== 'pending' && order.status !== 'payment_pending') {
        throw new Error('Order has already been funded or processed. Please contact support to cancel.')
      }

      const { error: updateErr } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
      if (updateErr) throw updateErr

      await supabase.from('order_timeline').insert([{ order_id: orderId, status: 'cancelled', notes }])
    } catch (err) {
      console.error('Error in cancelOrder:', err)
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
        .select(`*, sender:profiles!order_messages_sender_id_fkey(${PROFILE_SELECT})`)
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
        .select(`*, sender:profiles!order_messages_sender_id_fkey(${PROFILE_SELECT})`)
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
        .select(`*, listing:listings(*), buyer:profiles!orders_buyer_id_fkey(${PROFILE_SELECT}), seller:profiles!orders_seller_id_fkey(${PROFILE_SELECT})`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Order[]
    } catch (err) {
      console.error('Error in getAllOrders:', err)
      return []
    }
  },
}
