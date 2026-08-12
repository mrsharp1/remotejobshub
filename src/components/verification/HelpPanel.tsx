import React from 'react'
import { LifeBuoy, MessageSquare, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import type { Order } from '@/types'

interface HelpPanelProps {
  order: Order
}

export const HelpPanel: React.FC<HelpPanelProps> = ({ order }) => {
  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Verification Support
      </h3>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => toast.info(`Navigating to dashboard inbox for ORD-${order.id.slice(0, 6).toUpperCase()}...`)}
          className="flex w-full items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            Message Seller
          </div>
          <ExternalLink className="h-3 w-3 text-slate-500" />
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
