import React from 'react'
import { ShieldCheck, X } from 'lucide-react'

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 text-xs">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <div className="text-center space-y-1">
          <h4 className="font-heading text-sm font-bold text-slate-900 dark:text-white">Approve Marketplace Listing</h4>
          <p className="text-slate-450 text-[10px] leading-relaxed">
            Approving this listing publishes it to the public feeds. Buyers can buy and escrow contract pipelines will unlock.
          </p>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 py-2.5 font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-emerald-650 hover:bg-emerald-700 py-2.5 font-bold text-white shadow transition"
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  )
}
