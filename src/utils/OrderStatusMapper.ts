import { Order } from '@/types'

export type PremiumOrderStatus =
  | 'ORDER_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'ESCROW_LOCKED'
  | 'SELLER_DELIVERING'
  | 'CREDENTIALS_DELIVERED'
  | 'BUYER_VERIFYING'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'CANCELLED'

/**
 * Maps the backend database order status literal to the requested premium UI label.
 * This ensures consistency across the entire platform.
 */
export const getPremiumOrderStatus = (status: Order['status']): PremiumOrderStatus => {
  switch (status) {
    case 'pending':
      return 'ORDER_CREATED'
    case 'payment_pending':
      return 'PAYMENT_RECEIVED'
    case 'payment_received':
      return 'ESCROW_LOCKED' // We consider payment_received as Escrow Locked in this business logic flow
    case 'seller_processing':
      return 'SELLER_DELIVERING'
    case 'buyer_review':
      return 'BUYER_VERIFYING' // The credentials are delivered and buyer is verifying
    case 'completed':
      return 'COMPLETED'
    case 'disputed':
      return 'DISPUTED'
    case 'cancelled':
      return 'CANCELLED'
    // Map missing literals gracefully
    default:
      return 'ORDER_CREATED'
  }
}

/**
 * Returns a human-readable display label for the premium status
 */
export const getOrderStatusDisplayLabel = (status: Order['status']): string => {
  const premiumStatus = getPremiumOrderStatus(status)
  
  const labels: Record<PremiumOrderStatus, string> = {
    ORDER_CREATED: 'Order Created',
    PAYMENT_RECEIVED: 'Payment Received',
    ESCROW_LOCKED: 'Escrow Locked',
    SELLER_DELIVERING: 'Seller Delivering',
    CREDENTIALS_DELIVERED: 'Credentials Delivered',
    BUYER_VERIFYING: 'Buyer Verifying',
    COMPLETED: 'Completed',
    DISPUTED: 'Disputed',
    REFUNDED: 'Refunded',
    CANCELLED: 'Cancelled'
  }

  return labels[premiumStatus]
}
