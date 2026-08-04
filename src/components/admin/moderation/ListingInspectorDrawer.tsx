import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Listing } from '@/types'
import { VaultMetadata } from './VaultMetadata'
import { DocumentViewer } from './DocumentViewer'
import { AiRiskPanel } from './AiRiskPanel'
import { FraudSignals } from './FraudSignals'
import { ModerationTimeline } from './ModerationTimeline'
import { DecisionPanel } from './DecisionPanel'
import { ApprovalModal } from './ApprovalModal'
import { RejectModal } from './RejectModal'
import { formatCurrency } from '@/utils/currency'

interface ListingInspectorDrawerProps {
  listing: Listing | null
  onClose: () => void
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, notes: string) => Promise<void>
  onChangesRequested: (id: string, notes: string) => Promise<void>
  onArchive: (id: string) => Promise<void>
  onEscalate: (id: string) => void
}

export const ListingInspectorDrawer: React.FC<ListingInspectorDrawerProps> = ({
  listing,
  onClose,
  onApprove,
  onReject,
  onChangesRequested,
  onArchive,
  onEscalate,
}) => {
  const [activeModal, setActiveModal] = useState<'approve' | 'reject' | 'changes' | null>(null)

  if (!listing) return null

  const handleApproveConfirm = async () => {
    await onApprove(listing.id)
    setActiveModal(null)
  }

  const handleRejectConfirm = async (notes: string) => {
    await onReject(listing.id, notes)
    setActiveModal(null)
  }

  const handleChangesConfirm = async (notes: string) => {
    await onChangesRequested(listing.id, notes)
    setActiveModal(null)
  }

  const imagesList = listing.images?.map((i) => i.image_url) || []

  return (
    <>
      {/* Sidebar Sheet slide-over panel */}
      <div className="fixed inset-0 z-40 bg-black/40 flex justify-end animate-in fade-in duration-300">
        <div
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
        />

        <div className="relative w-full max-w-lg bg-slate-900 border-l border-white/5 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-350 text-xs text-slate-300">
          {/* Header */}
          <div className="border-b border-white/5 p-5 flex items-center justify-between shrink-0 bg-slate-950/60">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-purple-400">
                <span>{listing.platform}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span>{listing.country}</span>
              </div>
              <h3 className="font-heading text-sm font-bold text-white mt-1 leading-snug">{listing.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/5 bg-slate-950 hover:bg-slate-900 p-2 text-slate-400 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Body Scroll area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            {/* Quick Pricing Card */}
            <div className="rounded-2xl border border-white/5 bg-slate-950 p-4.5 flex justify-between items-center">
              <div>
                <span className="text-[8px] font-bold text-slate-450 block uppercase">Monthly Income</span>
                <span className="font-heading text-lg font-black text-white font-mono mt-0.5 block">{formatCurrency(Number(listing.monthly_income || 0))}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-bold text-slate-450 block uppercase">Sale Price</span>
                <span className="font-heading text-lg font-black text-purple-400 font-mono mt-0.5 block">{formatCurrency(Number(listing.price || 0))}</span>
              </div>
            </div>

            {/* AI Risk Score RADAR panels */}
            <AiRiskPanel sellerEmail={listing.seller?.email || 'mock_seller@gmail.com'} />

            {/* Radar Fraud warning alerts list */}
            <FraudSignals sellerEmail={listing.seller?.email || 'mock_seller@gmail.com'} />

            {/* Encrypted Vault status check indicators */}
            <VaultMetadata
              hasRecoveryEmail={listing.recovery_email_included}
              hasCookies={true}
              hasBackupCodes={listing.original_email_included}
              hasPhone={listing.phone_included}
            />

            {/* Zoomable document lightbox screens */}
            <DocumentViewer images={imagesList} />

            {/* Timelines workflow steps audit log */}
            <ModerationTimeline status={listing.status} />

            {/* Action Verdict control panel triggers */}
            <DecisionPanel
              onApprove={() => setActiveModal('approve')}
              onReject={() => setActiveModal('reject')}
              onChangesRequested={() => setActiveModal('changes')}
              onArchive={async () => await onArchive(listing.id)}
              onEscalate={() => onEscalate(listing.id)}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Overlays Modals */}
      <ApprovalModal
        isOpen={activeModal === 'approve'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleApproveConfirm}
      />

      <RejectModal
        isOpen={activeModal === 'reject'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleRejectConfirm}
        titleLabel="Reject Account Listing"
      />

      <RejectModal
        isOpen={activeModal === 'changes'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleChangesConfirm}
        titleLabel="Request Account Fixes"
      />
    </>
  )
}
