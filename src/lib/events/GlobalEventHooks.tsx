import { useEventSubscriber } from '@/hooks/useEventSubscriber'
import { useAuditLogStore } from '@/stores/auditLogStore'
import { orderService } from '@/services/marketplace/order.service'
import { messageService, conversationService } from '@/features/messaging/services'
import { useRealtimeNotifications } from '@/features/notifications/hooks/useRealtimeNotifications'

/**
 * GlobalEventHooks orchestrates background side-effects like Analytics, Audit Logging,
 * and Notifications without mounting any UI.
 * Mount this component once in the root App tree.
 */
export const GlobalEventHooks: React.FC = () => {
  const addLog = useAuditLogStore((state) => state.addLog)

  useEventSubscriber('ORDER_CREATED', (payload) => {
    addLog('ORDER_CREATED', payload)
  })

  useEventSubscriber('PAYMENT_CONFIRMED', async (payload) => {
    addLog('PAYMENT_CONFIRMED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        // Messaging
        const conv = await conversationService.createConversation(
          'listing',
          order.listing_id,
          order.buyer_id,
          order.seller_id
        )
        await messageService.createSystemMessage(conv.id, order.buyer_id, 'PAYMENT_RECEIVED', { orderId: payload.orderId, amount: payload.amount })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('ESCROW_LOCKED', async (payload) => {
    addLog('ESCROW_LOCKED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, order.buyer_id, 'ESCROW_LOCKED', { orderId: payload.orderId })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('CREDENTIALS_UPLOADED', async (payload) => {
    addLog('CREDENTIALS_UPLOADED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, order.seller_id, 'CREDENTIALS_UPLOADED', { orderId: payload.orderId })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('VAULT_OPENED', (payload) => {
    addLog('VAULT_OPENED', payload)
  })

  useEventSubscriber('VERIFICATION_STARTED', async (payload) => {
    addLog('VERIFICATION_STARTED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, order.buyer_id, 'VERIFICATION_STARTED', { orderId: payload.orderId })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('VERIFICATION_COMPLETED', async (payload) => {
    addLog('VERIFICATION_COMPLETED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, order.buyer_id, 'VERIFICATION_COMPLETED', { orderId: payload.orderId })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('ESCROW_RELEASED', async (payload) => {
    addLog('ESCROW_RELEASED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, order.seller_id, 'ESCROW_RELEASED', { orderId: payload.orderId, amount: payload.amount })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('SELLER_WALLET_CREDITED', (payload) => {
    addLog('SELLER_WALLET_CREDITED', payload)
  })

  useEventSubscriber('DISPUTE_OPENED', async (payload) => {
    addLog('DISPUTE_OPENED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const targetId = payload.initiatedBy === 'buyer' ? order.seller_id : order.buyer_id
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, targetId, 'DISPUTE_OPENED', { orderId: payload.orderId, initiatedBy: payload.initiatedBy })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('DISPUTE_RESOLVED', async (payload) => {
    addLog('DISPUTE_RESOLVED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, order.buyer_id, 'DISPUTE_RESOLVED', { orderId: payload.orderId, resolution: payload.resolution })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('ORDER_COMPLETED', async (payload) => {
    addLog('ORDER_COMPLETED', payload)
    try {
      const order = await orderService.getOrder(payload.orderId)
      if (order) {
        const conv = await conversationService.createConversation('listing', order.listing_id, order.buyer_id, order.seller_id)
        await messageService.createSystemMessage(conv.id, order.buyer_id, 'ORDER_COMPLETED', { orderId: payload.orderId })
      }
    } catch (e) { console.error(e) }
  })

  useEventSubscriber('REVIEW_SUBMITTED', (payload) => {
    addLog('REVIEW_SUBMITTED', payload)
  })

  useRealtimeNotifications()

  return null
}
