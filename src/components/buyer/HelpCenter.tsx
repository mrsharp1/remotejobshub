import React from 'react'
import { LifeBuoy, AlertTriangle, MessageSquare, ExternalLink } from 'lucide-react'
import type { Order } from '@/types'
import { toast } from 'sonner'

interface HelpCenterProps {
  order: Order
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ order }) => {
  return (
    <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
        Need Assistance?
      </h3>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <button 
          onClick={() => toast.info(`Messaging seller for ORD-${order.id.slice(0,6).toUpperCase()} is only available via the dashboard inbox.`)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
        >
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          Message Seller
        </button>
        
        <button 
          onClick={() => toast.error('Dispute process initiated. Support will contact you shortly.')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-400 transition-colors hover:bg-rose-500/20"
        >
          <AlertTriangle className="h-4 w-4" />
          Open Dispute
        </button>
      </div>

      <div className="pt-2 text-center">
        <a 
          href="https://t.me/remotejobshub" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:underline"
        >
          <LifeBuoy className="h-4 w-4" />
          Telegram Community <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
