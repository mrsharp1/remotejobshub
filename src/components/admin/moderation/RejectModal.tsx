import React, { useState } from 'react'
import { AlertOctagon, X } from 'lucide-react'

interface RejectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (notes: string) => void
  titleLabel?: string
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  titleLabel = 'Reject Account Listing',
}) => {
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('credentials')

  if (!isOpen) return null

  const handleConfirmClick = () => {
    const fullNotes = `[${reason.toUpperCase()}] ${notes}`
    onConfirm(fullNotes)
    setNotes('')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 text-xs">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-455">
          <AlertOctagon className="h-6 w-6" />
        </div>

        <div className="text-center space-y-1">
          <h4 className="font-heading text-sm font-bold text-slate-900 dark:text-white">{titleLabel}</h4>
          <p className="text-slate-450 text-[10px] leading-relaxed">
            State the verification issues below. The seller will be notified of these fixes to resubmit.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Rejection Category</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-2.5 text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
            >
              <option value="credentials">Credentials verification failure</option>
              <option value="screenshots">Screenshot authenticity issue</option>
              <option value="pricing">Price discrepancy validation</option>
              <option value="identity">KYC status conflict</option>
              <option value="other">Other listing details issues</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Moderator Audit Comments</label>
            <textarea
              placeholder="e.g. Please upload a higher resolution screenshot of your monthly payments performance dashboard..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-250 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
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
            onClick={handleConfirmClick}
            disabled={!notes}
            className="flex-1 rounded-xl bg-rose-650 hover:bg-rose-700 py-2.5 font-bold text-white shadow transition disabled:opacity-50"
          >
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  )
}
