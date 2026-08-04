import React from 'react'
import type { Order } from '@/types'
import { FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/utils/currency'

interface ReceiptCardProps {
  order: Order
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ order }) => {
  const commission = order.amount * 0.05
  const netAmount = order.amount - commission

  const handleDownload = () => {
    toast.success('Receipt downloading as PDF...')
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[24px] border border-white/5 bg-slate-900/30">
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-white">Transaction Receipt</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Status: Completed</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-4 p-6 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Buyer</span>
          <span className="font-bold text-slate-300">{order.buyer?.full_name || order.buyer_id.slice(0,8)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Seller</span>
          <span className="font-bold text-slate-300">{order.seller?.full_name || order.seller_id.slice(0,8)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Platform</span>
          <span className="font-bold text-slate-300">Remote Job Hub Escrow</span>
        </div>
        
        <div className="my-2 h-px w-full border-t border-dashed border-white/10" />
        
        <div className="flex justify-between">
          <span className="text-slate-400">Gross Amount</span>
          <span className="font-mono font-bold text-slate-300">{formatCurrency(order.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Commission (5%)</span>
          <span className="font-mono font-bold text-rose-400">-{formatCurrency(commission)}</span>
        </div>
        
        <div className="my-2 h-px w-full border-t border-dashed border-white/10" />
        
        <div className="flex justify-between text-base">
          <span className="font-bold text-white">Net Amount</span>
          <span className="font-mono font-black text-emerald-400">{formatCurrency(netAmount)}</span>
        </div>
      </div>

      <div className="p-6 pt-0">
        <button
          onClick={handleDownload}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
        >
          <Download className="h-4 w-4" /> Download PDF
        </button>
      </div>
    </div>
  )
}
