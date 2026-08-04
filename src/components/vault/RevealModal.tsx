import React from 'react'
import { ShieldAlert, AlertTriangle, Eye, Loader2 } from 'lucide-react'

interface RevealModalProps {
  isOpen: boolean
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const RevealModal: React.FC<RevealModalProps> = ({ isOpen, isLoading, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="bg-amber-500/10 p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 ring-4 ring-amber-500/10">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-xl font-bold text-white">Security Warning</h2>
        </div>
        
        <div className="p-6">
          <p className="text-sm leading-relaxed text-slate-300">
            You are about to decrypt and reveal the escrowed credentials for this account.
          </p>
          
          <div className="mt-6 space-y-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <p className="text-xs text-rose-200">
                This action is permanently logged to the immutable ledger for dispute protection.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <p className="text-xs text-rose-200">
                Once revealed, the seller will be notified that you have accessed the payload.
              </p>
            </div>
          </div>

          {/* Audit trail placeholder */}
          <div className="mt-6 rounded-lg bg-slate-950 p-3 text-[10px] font-medium text-slate-500">
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <span className="text-slate-300">{new Date().toISOString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Device:</span>
              <span className="text-slate-300">Auth Token Verification</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Decrypt Payload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
