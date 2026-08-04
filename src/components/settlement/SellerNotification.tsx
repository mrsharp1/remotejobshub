import React, { useEffect } from 'react'
import { toast } from 'sonner'
import type { Order } from '@/types'

interface SellerNotificationProps {
  order: Order
}

export const SellerNotification: React.FC<SellerNotificationProps> = ({ order }) => {
  useEffect(() => {
    // Simulate pushing a notification to the seller
    const timer = setTimeout(() => {
      toast.success('Funds Released & Wallet Credited', {
        description: `Order ORD-${order.id.slice(0, 6).toUpperCase()} settlement is complete. Funds are ready for withdrawal.`,
        duration: 5000,
      })
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [order.id])

  return null
}
