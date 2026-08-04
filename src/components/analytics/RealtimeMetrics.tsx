import React from 'react'
import { useEventSubscriber } from '@/hooks/useEventSubscriber'
import { toast } from 'sonner'

export const RealtimeMetrics: React.FC = () => {
  // Listen for platform events and pop up small realtime toasts or triggers that 
  // could re-fetch analytics data in a full production app without refreshing.

  useEventSubscriber('ORDER_CREATED', () => {
    toast.success('Live Update', {
      description: 'A new order was just created on the platform.',
      duration: 3000
    })
  })

  useEventSubscriber('PAYMENT_CONFIRMED', (payload) => {
    toast.success('Revenue Update', {
      description: `Payment of ₦${Number(payload.amount).toLocaleString()} was just processed.`,
      duration: 3000
    })
  })

  useEventSubscriber('ESCROW_RELEASED', (payload) => {
    toast.success('Settlement Complete', {
      description: `Escrow released ₦${Number(payload.amount).toLocaleString()}.`,
      duration: 3000
    })
  })

  useEventSubscriber('DISPUTE_OPENED', () => {
    toast.error('Trust & Safety Alert', {
      description: 'A new dispute was just opened.',
      duration: 5000
    })
  })

  return null // Renderless component for injecting into Dashboards
}
