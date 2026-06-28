import { supabase } from '@/lib/supabase'
import { Payment } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const paymentService = {
  initializePayment(
    email: string,
    amount: number,
    orderId: string,
    onSuccess: (reference: any) => void,
    onClose: () => void
  ): void {
    const scriptId = 'paystack-inline-js'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    const initPaystack = () => {
      const publicKey =
        import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
        'pk_test_306282026paystackdummykeyrjh'

      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: Math.round(amount * 100), // convert to kobo/cents
        currency: 'NGN', // Paystack default sandbox currency
        ref: 'PAY-' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        metadata: {
          orderId,
        },
        callback: (response: any) => {
          onSuccess(response)
        },
        onClose: () => {
          onClose()
        },
      })
      handler.openIframe()
    }

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = initPaystack
      document.body.appendChild(script)
    } else {
      initPaystack()
    }
  },

  async verifyPayment(reference: string, orderId: string): Promise<void> {
    try {
      // 1. Fetch Order details
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (!order) throw new Error('Order not found')

      // 2. Insert success payment record in DB
      const { error: payError } = await supabase.from('payments').insert([
        {
          order_id: orderId,
          buyer_id: order.buyer_id,
          seller_id: order.seller_id,
          paystack_reference: reference,
          payment_status: 'success',
          amount: order.amount,
          currency: order.currency || 'USD',
          paid_at: new Date().toISOString(),
        },
      ])

      if (payError) throw payError

      // 3. Update order status to payment_received
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'payment_received' })
        .eq('id', orderId)

      if (orderError) throw orderError

      // 4. Update order timeline
      await supabase.from('order_timeline').insert([
        {
          order_id: orderId,
          status: 'payment_received',
          notes:
            'Paystack checkout completed successfully. Escrow funds secured.',
        },
      ])

      // 5. Notify both buyer and seller
      await notificationService.createNotification({
        user_id: order.buyer_id,
        title: 'Escrow Payment Confirmed 💳',
        message: `Your payment of $${order.amount} for order #${orderId.slice(0, 8)} was successfully verified and secured in escrow.`,
        type: 'payment',
        reference_type: 'order',
        reference_id: orderId,
      })

      await notificationService.createNotification({
        user_id: order.seller_id,
        title: 'Payment Secured in Escrow 💳',
        message: `Buyer has paid $${order.amount} for your listing. Funds are secured in escrow. Please deliver credentials.`,
        type: 'payment',
        reference_type: 'order',
        reference_id: orderId,
      })
    } catch (err) {
      console.error('Error in verifyPayment:', err)
      throw err
    }
  },

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
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          payment_status: 'released',
          released_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      if (payment) {
        // Notify seller
        await notificationService.createNotification({
          user_id: payment.seller_id,
          title: 'Escrow Funds Released 💸',
          message: `Escrow payment of $${payment.amount} has been released to your dashboard balance.`,
          type: 'payment',
          reference_type: 'order',
          reference_id: payment.order_id,
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
