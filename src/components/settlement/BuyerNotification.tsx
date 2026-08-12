import React, { useEffect } from 'react'
import { toast } from 'sonner'
import type { Order } from '@/types'

interface BuyerNotificationProps {
  order: Order
}

export const BuyerNotification: React.FC<BuyerNotificationProps> = ({ order }) => {
  useEffect(() => {
    // Simulate pushing a notification to the buyer
    const timer = setTimeout(() => {
      toast('Transaction Completed', {
        description: `Your order ORD-${order.id.slice(0, 6).toUpperCase()} has been successfully settled.`,
        action: {
          label: 'View Receipt',
          onClick: () => {
            if (import.meta.env.DEV) console.log('View receipt')
          }
        }
      })
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [order.id])

  return null
}
