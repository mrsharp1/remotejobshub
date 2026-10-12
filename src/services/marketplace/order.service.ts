import { supabase } from '@/lib/supabase'
import { Order, OrderTimeline, OrderMessage } from '@/types'
import { EXPECTED_CONSENT_AFFIRMATION } from '@/constants/terms'

const PROFILE_SELECT = 'id, full_name, avatar_url, seller_verified'

export interface TermsAcceptancePayload {
  termsVersion: string
  documentHash: string
  acceptanceToken?: string
  consentAffirmation?: string
  userAgent?: string
}

export interface TermsAcceptanceRecord {
  id: string
  acceptance_reference: string
  buyer_id: string
  order_id: string
  listing_id: string
  consent_intent_id?: string | null
  terms_version: string
  document_hash: string
  accepted_at: string
  ip_address?: string | null
  user_agent?: string | null
  checkout_reference: string
  created_at: string
}

export interface TermsDocumentRecord {
  id: string
  version: string
  title: string
  document_hash: string
  content: string
  status: 'draft' | 'published' | 'archived'
  effective_at: string
  created_at: string
}

export const orderService = {
  async prepareTermsAcceptance(
    listingId: string,
    payload: {
      termsVersion: string
      documentHash: string
      consentAffirmation?: string
    }
  ): Promise<{ acceptance_token: string; terms_version: string; document_hash: string; expires_at: string }> {
    const affirmation =
      payload.consentAffirmation ||
      EXPECTED_CONSENT_AFFIRMATION ||
      `I explicitly accept the Remote Jobs Hub Terms and Conditions version ${payload.termsVersion} and agree to be legally bound thereby.`

    const { data, error } = await supabase.rpc('rpc_prepare_checkout_terms_acceptance', {
      p_listing_id: listingId,
      p_terms_version: payload.termsVersion,
      p_document_hash: payload.documentHash,
      p_consent_affirmation: affirmation,
    })

    if (error) {
      console.error('Error in prepareTermsAcceptance:', error)
      throw new Error(error.message || 'Failed to prepare terms acceptance token')
    }

    return data
  },

  async checkoutWithWallet(
    listingId: string,
    termsPayload?: TermsAcceptancePayload
  ): Promise<any> {
    try {
      const userAgent =
        termsPayload?.userAgent ||
        (typeof navigator !== 'undefined' ? navigator.userAgent : null)

      let token = termsPayload?.acceptanceToken

      // If no token was pre-generated but terms version and hash are present, prepare one now
      if (!token && termsPayload?.termsVersion && termsPayload?.documentHash) {
        const prep = await this.prepareTermsAcceptance(listingId, {
          termsVersion: termsPayload.termsVersion,
          documentHash: termsPayload.documentHash,
          consentAffirmation: termsPayload.consentAffirmation,
        })
        token = prep.acceptance_token
      }

      const { data, error } = await supabase.rpc('rpc_checkout_with_wallet', {
        p_listing_id: listingId,
        p_acceptance_token: token || null,
        p_terms_version: termsPayload?.termsVersion || null,
        p_document_hash: termsPayload?.documentHash || null,
        p_user_agent: userAgent,
        p_ip_address: null,
      })

      if (error) {
        console.error('Checkout error:', error)
        throw new Error(error.message || 'Failed to complete checkout')
      }

      if (!data?.success) {
        throw new Error(data?.message || 'Failed to complete checkout')
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

  async getTermsAcceptance(orderId: string): Promise<TermsAcceptanceRecord | null> {
    try {
      const { data, error } = await supabase
        .from('terms_acceptances')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle()

      if (error) {
        console.error('Error in getTermsAcceptance:', error)
        return null
      }
      return data as TermsAcceptanceRecord | null
    } catch (err) {
      console.error('Error in getTermsAcceptance:', err)
      return null
    }
  },

  async getTermsAcceptanceByReference(reference: string): Promise<TermsAcceptanceRecord | null> {
    try {
      const { data, error } = await supabase
        .from('terms_acceptances')
        .select('*')
        .eq('acceptance_reference', reference)
        .maybeSingle()

      if (error) {
        console.error('Error in getTermsAcceptanceByReference:', error)
        return null
      }
      return data as TermsAcceptanceRecord | null
    } catch (err) {
      console.error('Error in getTermsAcceptanceByReference:', err)
      return null
    }
  },

  async getTermsDocument(version: string): Promise<TermsDocumentRecord | null> {
    try {
      const { data, error } = await supabase
        .from('terms_documents')
        .select('*')
        .eq('version', version)
        .maybeSingle()

      if (error) {
        console.error('Error in getTermsDocument:', error)
        return null
      }
      return data as TermsDocumentRecord | null
    } catch (err) {
      console.error('Error in getTermsDocument:', err)
      return null
    }
  },

  async getAdminTermsAcceptanceLedger(options?: {
    termsVersion?: string
    limit?: number
  }): Promise<TermsAcceptanceRecord[]> {
    try {
      // 1. Try server-enforced security definer RPC first
      const { data: rpcData, error: rpcError } = await supabase.rpc('rpc_export_terms_acceptances', {
        p_terms_version: options?.termsVersion || null,
        p_limit: options?.limit || 1000,
      })

      if (!rpcError && rpcData) {
        return rpcData as TermsAcceptanceRecord[]
      }

      // 2. Fall back to direct query on terms_acceptances protected by RLS (public.is_admin())
      let query = supabase
        .from('terms_acceptances')
        .select('*')
        .order('accepted_at', { ascending: false })

      if (options?.termsVersion) {
        query = query.eq('terms_version', options.termsVersion)
      }
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching admin terms acceptance ledger:', error)
        throw new Error(error.message || 'Access denied or query failed')
      }

      return (data || []) as TermsAcceptanceRecord[]
    } catch (err: any) {
      console.error('Error in getAdminTermsAcceptanceLedger:', err)
      throw new Error(err?.message || 'Access denied. Administrator privileges required.')
    }
  },

  exportAcceptanceLedgerAsCsv(records: TermsAcceptanceRecord[]): string {
    const headers = [
      'Acceptance Reference',
      'Checkout Reference',
      'Order ID',
      'Listing ID',
      'Buyer ID',
      'Terms Version',
      'SHA-256 Hash',
      'Accepted At (ISO)',
      'Client IP',
      'User Agent',
      'Created At (ISO)',
    ]

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""'
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }

    const rows = records.map((r) =>
      [
        escapeCsv(r.acceptance_reference),
        escapeCsv(r.checkout_reference),
        escapeCsv(r.order_id),
        escapeCsv(r.listing_id),
        escapeCsv(r.buyer_id),
        escapeCsv(r.terms_version),
        escapeCsv(r.document_hash),
        escapeCsv(r.accepted_at),
        escapeCsv(r.ip_address || ''),
        escapeCsv(r.user_agent || ''),
        escapeCsv(r.created_at),
      ].join(',')
    )

    return [headers.join(','), ...rows].join('\r\n')
  },

  downloadAcceptanceLedger(records: TermsAcceptanceRecord[], format: 'csv' | 'json' = 'csv') {
    const dateStr = new Date().toISOString().split('T')[0]
    let content: string
    let mimeType: string
    let filename: string

    if (format === 'json') {
      content = JSON.stringify(records, null, 2)
      mimeType = 'application/json'
      filename = `remotejobshub-terms-acceptance-ledger-${dateStr}.json`
    } else {
      content = this.exportAcceptanceLedgerAsCsv(records)
      mimeType = 'text/csv;charset=utf-8;'
      filename = `remotejobshub-terms-acceptance-ledger-${dateStr}.csv`
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}
