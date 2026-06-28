import React, { useState } from 'react'
import { X, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react'
import { Listing } from '@/types'

interface PurchaseSummaryModalProps {
  listing: Listing
  onClose: () => void
  onConfirmPurchase: () => Promise<void>
}

export const PurchaseSummaryModal: React.FC<PurchaseSummaryModalProps> = ({
  listing,
  onClose,
  onConfirmPurchase,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await onConfirmPurchase()
    } catch (err) {
      console.error(err)
      setError(
        'An unexpected error occurred while placing your order. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-50 max-h-[90vh] w-full max-w-lg space-y-6 overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <ShieldCheck className="h-5.5 w-5.5 text-primary" /> Purchase
            Summary
          </h3>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Listing & Price details */}
        <div className="bg-muted/40 space-y-3 rounded-lg p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {listing.platform} Asset
          </span>
          <h4 className="font-heading text-sm font-bold leading-snug text-foreground">
            {listing.title}
          </h4>
          <div className="border-border/50 flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">List Price:</span>
            <span className="font-heading text-base font-extrabold text-foreground">
              ${Number(listing.price).toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Escrow Process Details */}
        <div className="space-y-4">
          <h5 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Escrow Delivery Process
          </h5>
          <div className="space-y-3">
            {[
              {
                title: '1. Funds Held in Escrow',
                desc: 'Your purchase payment is safely deposited in our secure escrow holding account. The seller does not receive any payment yet.',
              },
              {
                title: '2. Credentials Verification',
                desc: 'Our staff will contact the seller, verify all account metrics and owner details, and update the order timeline.',
              },
              {
                title: '3. Ownership Transfer & Release',
                desc: 'We assist you in completing the secure account handoff. The escrow funds are only released to the seller after you confirm successful login.',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <div>
                  <h6 className="font-semibold text-foreground">
                    {step.title}
                  </h6>
                  <p className="mt-0.5 text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error alerts */}
        {error && (
          <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* CTAs */}
        <div className="border-border/50 flex gap-3 border-t pt-4">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-border bg-background py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating Escrow...
              </>
            ) : (
              'Confirm Order Creation'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
