import { supabase } from '@/lib/supabase'
import { Dispute, DisputeMessage, DisputeEvidence } from '@/types'
import { notificationService } from '@/services/marketplace/notification.service'

export const disputeService = {
  async createDispute(disputeData: {
    order_id: string
    opened_by: string
    reason: string
  }): Promise<Dispute> {
    try {
      // 1. Insert dispute row
      const { data: dispute, error } = await supabase
        .from('disputes')
        .insert([
          {
            ...disputeData,
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (error) throw error

      // 2. Set order status to disputed and insert order timeline log
      const { data: order } = await supabase
        .from('orders')
        .update({ status: 'disputed' })
        .eq('id', disputeData.order_id)
        .select()
        .single()

      if (order) {
        await supabase.from('order_timeline').insert([
          {
            order_id: disputeData.order_id,
            status: 'disputed',
            notes: `Dispute opened. Reason: ${disputeData.reason}`,
          },
        ])

        // 3. Notify Buyer and Seller
        await notificationService.createNotification({
          user_id: order.buyer_id,
          title: 'Dispute Case Opened ⚠️',
          message: `A dispute has been opened for Order #${order.id.slice(0, 8)}. A moderator will review it.`,
          type: 'system',
          reference_type: 'order',
          reference_id: order.id,
        })

        await notificationService.createNotification({
          user_id: order.seller_id,
          title: 'Order Dispute Opened ⚠️',
          message: `A dispute has been opened for Order #${order.id.slice(0, 8)}. Please submit evidence.`,
          type: 'system',
          reference_type: 'order',
          reference_id: order.id,
        })
      }

      return dispute as Dispute
    } catch (err) {
      console.error('Error in createDispute:', err)
      throw err
    }
  },

  async getDisputes(): Promise<Dispute[]> {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select(
          '*, order:orders(*, listing:listings(*)), opened_by_profile:profiles!disputes_opened_by_fkey(*), admin:profiles!disputes_admin_id_fkey(*)'
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Dispute[]
    } catch (err) {
      console.error('Error in getDisputes:', err)
      return []
    }
  },

  async getDispute(id: string): Promise<Dispute | null> {
    try {
      const { data: dispute, error } = await supabase
        .from('disputes')
        .select(
          '*, order:orders(*, listing:listings(*), buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*)), opened_by_profile:profiles!disputes_opened_by_fkey(*), admin:profiles!disputes_admin_id_fkey(*)'
        )
        .eq('id', id)
        .single()

      if (error) throw error

      // Fetch Chat messages
      const { data: messages } = await supabase
        .from('dispute_messages')
        .select('*, sender:profiles(*)')
        .eq('dispute_id', id)
        .order('created_at', { ascending: true })

      // Fetch Evidence list
      const { data: evidence } = await supabase
        .from('dispute_evidence')
        .select('*, submitted_by_profile:profiles(*)')
        .eq('dispute_id', id)
        .order('created_at', { ascending: true })

      return {
        ...dispute,
        messages: messages || [],
        evidence: evidence || [],
      } as Dispute
    } catch (err) {
      console.error('Error in getDispute:', err)
      return null
    }
  },

  async updateDisputeStatus(
    id: string,
    status: Dispute['status'],
    notes?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          status,
          resolution_notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error in updateDisputeStatus:', err)
      throw err
    }
  },

  async assignAdmin(id: string, adminId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          admin_id: adminId,
          status: 'under_review',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error in assignAdmin:', err)
      throw err
    }
  },

  async submitEvidence(evidenceData: {
    dispute_id: string
    submitted_by: string
    description: string
    file_url?: string | null
  }): Promise<DisputeEvidence> {
    try {
      const { data, error } = await supabase
        .from('dispute_evidence')
        .insert([evidenceData])
        .select()
        .single()

      if (error) throw error

      // Notify other participants of evidence submissions
      const { data: dispute } = await supabase
        .from('disputes')
        .select('*, order:orders(*)')
        .eq('id', evidenceData.dispute_id)
        .single()

      if (dispute && dispute.order) {
        const notifyTarget =
          evidenceData.submitted_by === dispute.order.buyer_id
            ? dispute.order.seller_id
            : dispute.order.buyer_id

        await notificationService.createNotification({
          user_id: notifyTarget,
          title: 'Evidence Submitted 📁',
          message: `The counterparty has uploaded evidence regarding order #${dispute.order.id.slice(0, 8)}.`,
          type: 'system',
          reference_type: 'order',
          reference_id: dispute.order.id,
        })
      }

      return data as DisputeEvidence
    } catch (err) {
      console.error('Error in submitEvidence:', err)
      throw err
    }
  },

  async sendMessage(messageData: {
    dispute_id: string
    sender_id: string
    message_text: string
  }): Promise<DisputeMessage> {
    try {
      const { data, error } = await supabase
        .from('dispute_messages')
        .insert([messageData])
        .select()
        .single()

      if (error) throw error

      // Notify parties
      const { data: dispute } = await supabase
        .from('disputes')
        .select('*, order:orders(*)')
        .eq('id', messageData.dispute_id)
        .single()

      if (dispute && dispute.order) {
        const isSenderAdmin = messageData.sender_id === dispute.admin_id

        if (isSenderAdmin) {
          // Notify both buyer and seller of Admin response
          await notificationService.createNotification({
            user_id: dispute.order.buyer_id,
            title: 'Moderator Responded ⚖️',
            message: `A dispute moderator sent a message regarding order #${dispute.order.id.slice(0, 8)}.`,
            type: 'system',
            reference_type: 'order',
            reference_id: dispute.order.id,
          })

          await notificationService.createNotification({
            user_id: dispute.order.seller_id,
            title: 'Moderator Responded ⚖️',
            message: `A dispute moderator sent a message regarding order #${dispute.order.id.slice(0, 8)}.`,
            type: 'system',
            reference_type: 'order',
            reference_id: dispute.order.id,
          })
        }
      }

      return data as DisputeMessage
    } catch (err) {
      console.error('Error in sendMessage:', err)
      throw err
    }
  },

  async resolveBuyer(id: string, notes: string): Promise<void> {
    try {
      // 1. Fetch Dispute details to find order
      const { data: dispute } = await supabase
        .from('disputes')
        .select('*, order:orders(*)')
        .eq('id', id)
        .single()

      if (!dispute) throw new Error('Dispute not found')

      // 2. Set dispute status to resolved_buyer and resolution notes
      const { error: disputeError } = await supabase
        .from('disputes')
        .update({
          status: 'resolved_buyer',
          resolution_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (disputeError) throw disputeError

      // 3. Update order status to cancelled (refunded buyer)
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', dispute.order_id)

      if (orderError) throw orderError

      // 4. Update order timeline
      await supabase.from('order_timeline').insert([
        {
          order_id: dispute.order_id,
          status: 'cancelled',
          notes: `Dispute resolved in favor of buyer. Refund processed. Notes: ${notes}`,
        },
      ])

      // 5. Notify both buyer and seller
      await notificationService.createNotification({
        user_id: dispute.order.buyer_id,
        title: 'Dispute Resolved - Refunded 🎉',
        message: `Dispute for order #${dispute.order.id.slice(0, 8)} resolved in your favor. Refund processed.`,
        type: 'payment',
        reference_type: 'order',
        reference_id: dispute.order_id,
      })

      await notificationService.createNotification({
        user_id: dispute.order.seller_id,
        title: 'Dispute Resolved - Refunded',
        message: `Dispute for order #${dispute.order.id.slice(0, 8)} resolved in favor of buyer. Funds refunded.`,
        type: 'system',
        reference_type: 'order',
        reference_id: dispute.order_id,
      })
    } catch (err) {
      console.error('Error in resolveBuyer:', err)
      throw err
    }
  },

  async resolveSeller(id: string, notes: string): Promise<void> {
    try {
      // 1. Fetch Dispute details to find order
      const { data: dispute } = await supabase
        .from('disputes')
        .select('*, order:orders(*)')
        .eq('id', id)
        .single()

      if (!dispute) throw new Error('Dispute not found')

      // 2. Set dispute status to resolved_seller and resolution notes
      const { error: disputeError } = await supabase
        .from('disputes')
        .update({
          status: 'resolved_seller',
          resolution_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (disputeError) throw disputeError

      // 3. Update order status to completed (funds released to seller)
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', dispute.order_id)

      if (orderError) throw orderError

      // 4. Update order timeline
      await supabase.from('order_timeline').insert([
        {
          order_id: dispute.order_id,
          status: 'completed',
          notes: `Dispute resolved in favor of seller. Payout released. Notes: ${notes}`,
        },
      ])

      // 5. Notify both buyer and seller
      await notificationService.createNotification({
        user_id: dispute.order.seller_id,
        title: 'Dispute Resolved - Funds Released 🎉',
        message: `Dispute for order #${dispute.order.id.slice(0, 8)} resolved in your favor. Payout released.`,
        type: 'payment',
        reference_type: 'order',
        reference_id: dispute.order_id,
      })

      await notificationService.createNotification({
        user_id: dispute.order.buyer_id,
        title: 'Dispute Resolved - Funds Released',
        message: `Dispute for order #${dispute.order.id.slice(0, 8)} resolved in favor of seller. Payout released.`,
        type: 'system',
        reference_type: 'order',
        reference_id: dispute.order_id,
      })
    } catch (err) {
      console.error('Error in resolveSeller:', err)
      throw err
    }
  },

  async closeDispute(id: string): Promise<void> {
    try {
      const { data: dispute } = await supabase
        .from('disputes')
        .select('*, order:orders(*)')
        .eq('id', id)
        .single()

      if (!dispute) throw new Error('Dispute not found')

      const { error: disputeError } = await supabase
        .from('disputes')
        .update({
          status: 'closed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (disputeError) throw disputeError

      // Notify parties
      await notificationService.createNotification({
        user_id: dispute.order.buyer_id,
        title: 'Dispute Case Closed',
        message: `Dispute case for order #${dispute.order.id.slice(0, 8)} has been closed.`,
        type: 'system',
        reference_type: 'order',
        reference_id: dispute.order_id,
      })

      await notificationService.createNotification({
        user_id: dispute.order.seller_id,
        title: 'Dispute Case Closed',
        message: `Dispute case for order #${dispute.order.id.slice(0, 8)} has been closed.`,
        type: 'system',
        reference_type: 'order',
        reference_id: dispute.order_id,
      })
    } catch (err) {
      console.error('Error in closeDispute:', err)
      throw err
    }
  },
}
