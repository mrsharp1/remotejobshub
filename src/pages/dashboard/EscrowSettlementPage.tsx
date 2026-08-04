import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/marketplace/order.service'
import { paymentService } from '@/services/marketplace/payment.service'
import { EventEngine } from '@/lib/events/EventEngine'

import { SettlementHero } from '@/components/settlement/SettlementHero'
import { PaymentBreakdown } from '@/components/settlement/PaymentBreakdown'
import { EscrowTimeline } from '@/components/settlement/EscrowTimeline'
import { SettlementEngine } from '@/components/settlement/SettlementEngine'
import { SettlementSummary } from '@/components/settlement/SettlementSummary'
import { RevenuePanel } from '@/components/settlement/RevenuePanel'
import { SecurityPanel } from '@/components/checkout/SecurityPanel'
import { ReceiptCard } from '@/components/settlement/ReceiptCard'
import { SettlementSuccess } from '@/components/settlement/SettlementSuccess'
import { BuyerNotification } from '@/components/settlement/BuyerNotification'
import { SellerNotification } from '@/components/settlement/SellerNotification'
import { LoadingSettlement } from '@/components/settlement/LoadingSettlement'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export const EscrowSettlementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [isProcessing, setIsProcessing] = useState(false)

  const { data: order, isLoading, isError, refetch } = useQuery({
    queryKey: ['settlement-order', id],
    queryFn: () => {
      if (!id) throw new Error('No order ID')
      return orderService.getOrder(id)
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingSettlement />
  if (isError || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <p className="text-slate-400">Order not found.</p>
      </div>
    )
  }

  const isCompleted = order.status === 'completed'

  const handleExecuteRelease = async () => {
    try {
      setIsProcessing(true)
      
      // Fetch the payment for this order
      const payment = await paymentService.getPaymentByOrderId(order.id)
      if (!payment) throw new Error('Payment not found for this order')

      // Execute financial release flow (which updates order status to completed internally)
      await paymentService.markReleased(payment.id)
      
      const price = Number(order.amount || 0)
      
      EventEngine.publish('ESCROW_RELEASED', {
        orderId: order.id,
        amount: price,
        sellerId: order.seller_id
      })
      
      EventEngine.publish('SELLER_WALLET_CREDITED', {
        orderId: order.id,
        amount: price,
        sellerId: order.seller_id
      })
      
      EventEngine.publish('ORDER_COMPLETED', {
        orderId: order.id
      })

      toast.success('Funds successfully released to seller wallet.')
      refetch()
    } catch (err) {
      toast.error('Failed to execute settlement.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 pb-32">
        <BuyerNotification order={order} />
        <SellerNotification order={order} />
        
        <div className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span className="text-sm font-bold text-white">Settlement Record</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              STL-{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
          <SettlementSuccess />
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SettlementSummary order={order} />
            </div>
            <div className="lg:col-span-4">
              <ReceiptCard order={order} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button 
            onClick={() => navigate(`/verification/${order.id}`)}
            className="group flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Verification
          </button>
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Settlement Engine
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:space-y-8">
        <SettlementHero order={order} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-8">
            <PaymentBreakdown order={order} />
            <SettlementEngine 
              order={order} 
              isProcessing={isProcessing} 
              onExecute={handleExecuteRelease} 
            />
            <EscrowTimeline />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            <RevenuePanel order={order} />
            <SettlementSummary order={order} />
            <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6">
              <SecurityPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
