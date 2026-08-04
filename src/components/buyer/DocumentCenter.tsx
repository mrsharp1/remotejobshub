import React from 'react'
import { FileText, Download } from 'lucide-react'
import type { Order } from '@/types'
import { toast } from 'sonner'

interface DocumentCenterProps {
  order: Order
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({ order }) => {
  const handleDownload = (docType: string) => {
    // Simulated PDF generation
    const content = `
    =========================================
          REMOTE JOBS HUB - ${docType.toUpperCase()}
    =========================================
    Order Reference: #${order.id}
    Purchase Date: ${new Date(order.created_at).toLocaleDateString()}
    Item: ${order.listing?.title}
    Amount: ₦${Number(order.amount).toLocaleString()} NGN
    =========================================
    `
    const blob = new Blob([content], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${docType.replace(' ', '_')}_Order_${order.id.slice(0, 8)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`${docType} downloaded successfully`)
  }

  const docs = [
    { label: 'Purchase Invoice', active: true },
    { label: 'Transaction Receipt', active: order.status !== 'payment_pending' },
    { label: 'Escrow Certificate', active: order.status !== 'payment_pending' },
    { label: 'Transfer Agreement', active: order.status === 'completed' },
  ]

  return (
    <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
        Document Center
      </h3>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {docs.map((doc, idx) => (
          <button
            key={idx}
            onClick={() => doc.active && handleDownload(doc.label)}
            disabled={!doc.active}
            className={`flex items-center justify-between rounded-xl border border-white/5 p-4 text-left transition-colors ${
              doc.active 
                ? 'bg-slate-900/50 hover:bg-slate-800' 
                : 'bg-slate-900/20 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                doc.active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'
              }`}>
                <FileText className="h-4 w-4" />
              </div>
              <span className={`text-xs font-bold ${doc.active ? 'text-white' : 'text-slate-500'}`}>
                {doc.label}
              </span>
            </div>
            {doc.active && <Download className="h-4 w-4 text-slate-400" />}
          </button>
        ))}
      </div>
    </div>
  )
}
