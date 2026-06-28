import { supabase } from '@/lib/supabase'
import { Order, OrderTimeline, OrderMessage } from '@/types'

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
}
