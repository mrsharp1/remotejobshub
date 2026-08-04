import React from 'react'
import { X, ExternalLink, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Order } from '@/types'

import { EscrowStatus } from './EscrowStatus'
import { VerificationCountdown } from './VerificationCountdown'
import { DocumentCenter } from './DocumentCenter'
import { HelpCenter } from './HelpCenter'

interface OrderDetailsDrawerProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ order, isOpen, onClose }) => {
  const navigate = useNavigate()
  
  if (!order) return null

  const canAccessVault = ['seller_processing', 'buyer_review', 'completed'].includes(order.status)

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div 
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out sm:w-[480px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-slate-950/80 p-6 backdrop-blur-md">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Order Details</h2>
            <p className="text-xs text-slate-400">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 p-6">
          {/* Asset Info */}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/30 p-5">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                {order.listing?.platform || 'Platform'}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Purchased {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div>
              <h3 className="font-heading text-lg font-bold text-white">{order.listing?.title}</h3>
              <a href={`/listing/${order.listing_id}`} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 text-xs font-bold text-indigo-400 hover:underline">
                View Original Listing <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                  {order.seller?.full_name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Seller</span>
                  <span className="text-sm font-bold text-white">{order.seller?.full_name || 'Verified Vendor'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Paid</span>
                <span className="font-mono text-lg font-bold text-white">₦{Number(order.amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {canAccessVault && (
            <button
              onClick={() => navigate(`/vault/${order.id}`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-indigo-500 active:scale-95"
            >
              <Lock className="h-4 w-4" /> Enter Secure Vault
            </button>
          )}

          <VerificationCountdown order={order} />

          <EscrowStatus order={order} />
          
          <DocumentCenter order={order} />

          <HelpCenter order={order} />

        </div>
      </div>
    </>
  )
}
