import React from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, isLoading, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="bg-amber-500/10 p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 ring-4 ring-amber-500/10">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-xl font-bold text-white">Are you sure?</h2>
        </div>
        
        <div className="p-6">
          <p className="text-center text-sm leading-relaxed text-slate-300">
            You are about to release the escrow funds to the seller. 
            <strong className="block mt-2 text-rose-400">Once released, this action cannot be reversed automatically.</strong>
          </p>
          
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
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-400 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Release'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
