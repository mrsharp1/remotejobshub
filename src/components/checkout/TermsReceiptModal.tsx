import React from 'react'
import { X, CheckCircle, ShieldCheck, Printer, FileText, Hash, Calendar, Copy, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { orderService, TermsAcceptanceRecord, TermsDocumentRecord } from '@/services/marketplace/order.service'
import { TERMS_TITLE, TERMS_LAST_UPDATED } from '@/constants/terms'

interface TermsReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  record: TermsAcceptanceRecord | null
  orderAmount?: number
  listingTitle?: string
}

export const TermsReceiptModal: React.FC<TermsReceiptModalProps> = ({
  isOpen,
  onClose,
  record,
  orderAmount,
  listingTitle,
}) => {
  const [copiedHash, setCopiedHash] = React.useState(false)
  const [showFullTerms, setShowFullTerms] = React.useState(false)
  const [loadingDoc, setLoadingDoc] = React.useState(false)
  const [termsDoc, setTermsDoc] = React.useState<TermsDocumentRecord | null>(null)
  const [docError, setDocError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Reset document state when record changes
    setTermsDoc(null)
    setShowFullTerms(false)
    setDocError(null)
  }, [record?.id])

  if (!isOpen || !record) return null

  const handleCopyHash = () => {
    if (record?.document_hash) {
      navigator.clipboard.writeText(record.document_hash)
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formattedDate = new Date(record.accepted_at).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/5 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Audit-Verified Acceptance Evidence
              </span>
              <h2 className="text-xl font-bold text-white">
                Terms of Transaction Acceptance Receipt
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/5 bg-slate-950/50 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-6">
          {/* Certificate Badge */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-300">
                  Authenticated Electronic Acceptance Recorded
                </p>
                <p className="text-[11px] text-emerald-400/80">
                  Affirmatively authorized by authenticated account and bound to order reference before checkout execution.
                </p>
              </div>
            </div>
            <span className="shrink-0 font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {record.acceptance_reference}
            </span>
          </div>

          {/* Details Table */}
          <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Acceptance Reference
                </span>
                <span className="font-mono font-bold text-indigo-300">
                  {record.acceptance_reference}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Checkout / Escrow Reference
                </span>
                <span className="font-mono font-medium text-slate-300">
                  {record.checkout_reference}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Buyer Account ID
                </span>
                <span className="font-mono text-slate-300">
                  {record.buyer_id}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Order ID
                </span>
                <span className="font-mono text-slate-300">
                  {record.order_id}
                </span>
              </div>

              {listingTitle && (
                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Purchased Item
                  </span>
                  <span className="text-slate-200 font-medium">
                    {listingTitle}
                    {orderAmount ? ` (₦${orderAmount.toLocaleString()})` : ''}
                  </span>
                </div>
              )}
            </div>

            <hr className="border-white/5" />

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  Terms Document & Version
                </span>
                <div className="flex items-center justify-between text-slate-200">
                  <span>{TERMS_TITLE}</span>
                  <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    Version {record.terms_version} ({TERMS_LAST_UPDATED})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  Acceptance Timestamp
                </span>
                <div className="text-slate-300 font-mono text-[11px]">
                  {formattedDate} ({record.accepted_at})
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-indigo-400" />
                  Cryptographic SHA-256 Fingerprint
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-[11px] text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-white/5 break-all select-all">
                    {record.document_hash}
                  </div>
                  <button
                    onClick={handleCopyHash}
                    className="p-2 rounded-xl border border-white/5 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                    title="Copy Document Hash"
                  >
                    {copiedHash ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {record.user_agent && (
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Recorded User Agent
                  </span>
                  <p className="text-[10px] font-mono text-slate-500 break-all">
                    {record.user_agent}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Legal Acknowledgments Summary */}
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 text-[11px] text-slate-400 space-y-2">
            <p className="font-semibold text-slate-300">Summary of Key Agreed Provisions:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Escrow Vault holding of funds during the mandatory verification period.</li>
              <li>3-day verification review window before auto-release to seller.</li>
              <li>Platform dispute resolution jurisdiction in accordance with Remote Jobs Hub terms.</li>
              <li>Educational guidance and non-refundable mentorship policy as set forth in Version {record.terms_version}.</li>
            </ul>
          </div>

          {/* Historical Verbatim Document Retrieval */}
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <button
              type="button"
              onClick={async () => {
                const nextState = !showFullTerms
                setShowFullTerms(nextState)
                if (nextState && !termsDoc && !loadingDoc) {
                  setLoadingDoc(true)
                  setDocError(null)
                  try {
                    let doc: TermsDocumentRecord | null = null
                    if (record.order_id) {
                      const receiptBundle = await orderService.getTermsAcceptanceReceipt(record.order_id)
                      doc = receiptBundle?.document || null
                    }
                    if (!doc) {
                      doc = await orderService.getTermsDocument(record.terms_version)
                    }
                    if (doc) {
                      setTermsDoc(doc)
                    } else {
                      setDocError('Historical terms document content is unavailable for this version.')
                    }
                  } catch (err: any) {
                    setDocError(err?.message || 'Failed to retrieve historical terms document.')
                  } finally {
                    setLoadingDoc(false)
                  }
                }
              }}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                View Full Historical Accepted Terms Text
              </span>
              {showFullTerms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showFullTerms && (
              <div className="mt-3 pt-3 border-t border-white/5">
                {loadingDoc ? (
                  <div className="flex items-center justify-center py-6 text-xs text-slate-400 gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    Retrieving archived canonical terms text from database...
                  </div>
                ) : docError ? (
                  <div className="text-xs text-rose-400 py-2">
                    {docError}
                  </div>
                ) : termsDoc ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-white/5">
                      <span>Archived Version: <strong className="text-white">{termsDoc.version}</strong></span>
                      <span className={termsDoc.document_hash === record.document_hash ? "text-emerald-400 font-medium flex items-center gap-1" : "text-amber-400 font-medium"}>
                        {termsDoc.document_hash === record.document_hash ? "✓ Cryptographic SHA-256 Verified Match" : "Hash Discrepancy"}
                      </span>
                    </div>
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-white/5 bg-slate-900/90 p-4 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap select-text">
                      {termsDoc.content}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/5 pt-5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print / Save Receipt
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
