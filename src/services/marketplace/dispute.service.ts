import { supabase } from '@/lib/supabase'
import { Dispute, DisputeMessage, DisputeEvidence } from '@/types'

export const disputeService = {
  async createDispute(disputeData: {
    order_id: string
    opened_by: string
    reason: string
  }): Promise<Dispute> {
    try {
      // 1. Call atomic RPC to create dispute securely
      const { data, error } = await supabase.rpc('rpc_create_dispute', {
        p_order_id: disputeData.order_id,
        p_reason: disputeData.reason,
      })

      if (error) throw error
      
      // Check for application-level errors returned as JSON
      if (data && data.success === false) {
        throw new Error(data.message || 'Failed to create dispute')
      }

      // Fetch the newly created dispute to return
      const { data: dispute, error: fetchError } = await supabase
        .from('disputes')
        .select('*')
        .eq('id', data.dispute_id)
        .single()

      if (fetchError) throw fetchError

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

      // Notify other participants of evidence submissions handled by DB trigger

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
          // Notifications handled by DB triggers
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
      const { error: rpcError } = await supabase.rpc('rpc_admin_resolve_dispute', {
        p_dispute_id: id,
        p_resolution: 'buyer',
        p_notes: notes,
      })
      if (rpcError) throw rpcError
    } catch (err) {
      console.error('Error in resolveBuyer:', err)
      throw err
    }
  },

  async resolveSeller(id: string, notes: string): Promise<void> {
    try {
      const { error: rpcError } = await supabase.rpc('rpc_admin_resolve_dispute', {
        p_dispute_id: id,
        p_resolution: 'seller',
        p_notes: notes,
      })
      if (rpcError) throw rpcError
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
    } catch (err) {
      console.error('Error in closeDispute:', err)
      throw err
    }
  },
}
