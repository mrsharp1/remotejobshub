import React, { useState } from 'react'
import { LifeBuoy, MessageSquare, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Order } from '@/types'
import { toast } from 'sonner'
import { conversationService } from '@/features/messaging/services'
import { disputeService } from '@/services/marketplace/dispute.service'

interface HelpSectionProps {
  order: Order
}

export const HelpSection: React.FC<HelpSectionProps> = ({ order }) => {
  const navigate = useNavigate()
  const [isOpeningDispute, setIsOpeningDispute] = useState(false)

  const handleMessageSeller = async () => {
    try {
      const conv = await conversationService.createConversation(
        'listing',
        order.listing_id,
        order.buyer_id,
        order.seller_id
      )
      navigate('/dashboard/messages', { state: { activeConversationId: conv.id } })
    } catch (err) {
      console.error('Failed to start conversation:', err)
      toast.error('Failed to initialize conversation')
    }
  }

  const handleOpenDispute = async () => {
    if (order.status === 'disputed') {
      toast.error('Order is already disputed')
      return
    }

    setIsOpeningDispute(true)
    try {
      await disputeService.createDispute({
        order_id: order.id,
        opened_by: order.buyer_id,
        reason: 'Buyer initiated dispute from Credential Vault',
      })
      toast.success('Dispute opened successfully')
      navigate(`/dashboard/orders/${order.id}`)
    } catch (err) {
      console.error('Failed to open dispute:', err)
      toast.error('Failed to open dispute')
    } finally {
      setIsOpeningDispute(false)
    }
  }

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Verification Support
      </h3>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleMessageSeller}
          className="flex w-full items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            Message Seller
          </div>
          <ExternalLink className="h-3 w-3 text-slate-500" />
        </button>
        
        <button 
          onClick={handleOpenDispute}
          disabled={isOpeningDispute || order.status === 'disputed'}
          className="flex w-full items-center justify-between rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-400 transition-colors hover:bg-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            {isOpeningDispute ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
            {order.status === 'disputed' ? 'Dispute Opened' : 'Open Dispute'}
          </div>
        </button>

        <a 
          href="https://t.me/remotejobshub" 
          target="_blank" 

          rel="noreferrer"
          className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-slate-900/50 px-4 py-3 text-sm font-bold text-blue-400 transition-colors hover:bg-slate-800 hover:text-blue-300"
        >
          <div className="flex items-center gap-3">
            <LifeBuoy className="h-4 w-4" />
            Telegram Community
          </div>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>
      </div>
    </div>
  )
}
