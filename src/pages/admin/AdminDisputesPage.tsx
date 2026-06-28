import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  Scale,
  User,
  ExternalLink,
  MessageSquare,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  HelpCircle,
  FolderOpen,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { disputeService } from '@/services/marketplace/dispute.service'
import { useAuthStore } from '@/stores/authStore'
import { Dispute, DisputeMessage, DisputeEvidence } from '@/types'

export const AdminDisputesPage: React.FC = () => {
  const { user } = useAuthStore()

  // Tab filter states: 'pending' | 'under_review' | 'resolved' | 'closed' | 'rejected'
  const [activeTab, setActiveTab] = useState<
    'pending' | 'under_review' | 'resolved' | 'closed' | 'rejected'
  >('pending')
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null
  )

  // Input fields
  const [chatMessage, setChatMessage] = useState('')
  const [evidenceDesc, setEvidenceDesc] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')

  // Modals / notes inputs
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [actionTarget, setActionTarget] = useState<'refund' | 'release' | null>(
    null
  )

  // Fetch disputes
  const {
    data: disputes = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['admin-disputes-list'],
    queryFn: () => disputeService.getDisputes(),
  })

  // Fetch single dispute details
  const {
    data: disputeDetails,
    refetch: refetchDetails,
    isLoading: isDetailsLoading,
  } = useQuery({
    queryKey: ['admin-dispute-details', selectedDisputeId],
    queryFn: () =>
      selectedDisputeId ? disputeService.getDispute(selectedDisputeId) : null,
    enabled: !!selectedDisputeId,
  })

  // Filter disputes by active tab
  const filteredDisputes = disputes.filter((d) => {
    if (activeTab === 'pending') return d.status === 'pending'
    if (activeTab === 'under_review') return d.status === 'under_review'
    if (activeTab === 'closed') return d.status === 'closed'
    if (activeTab === 'rejected') return d.status === 'rejected'
    if (activeTab === 'resolved')
      return d.status === 'resolved_buyer' || d.status === 'resolved_seller'
    return true
  })

  // Handlers
  const handleAssignAdmin = async (id: string) => {
    if (!user) return
    try {
      await disputeService.assignAdmin(id, user.id)
      refetch()
      refetchDetails()
    } catch {
      alert('Failed to assign admin')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDisputeId || !user || !chatMessage.trim()) return
    try {
      await disputeService.sendMessage({
        dispute_id: selectedDisputeId,
        sender_id: user.id,
        message_text: chatMessage.trim(),
      })
      setChatMessage('')
      refetchDetails()
    } catch {
      alert('Failed to send message')
    }
  }

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDisputeId || !user || !evidenceDesc.trim()) return
    try {
      await disputeService.submitEvidence({
        dispute_id: selectedDisputeId,
        submitted_by: user.id,
        description: evidenceDesc.trim(),
        file_url: evidenceUrl.trim() || null,
      })
      setEvidenceDesc('')
      setEvidenceUrl('')
      refetchDetails()
    } catch {
      alert('Failed to submit evidence')
    }
  }

  const handleResolveAction = async () => {
    if (!selectedDisputeId || !actionTarget) return
    try {
      if (actionTarget === 'refund') {
        await disputeService.resolveBuyer(selectedDisputeId, resolutionNotes)
      } else if (actionTarget === 'release') {
        await disputeService.resolveSeller(selectedDisputeId, resolutionNotes)
      }
      refetch()
      refetchDetails()
      setActionTarget(null)
      setResolutionNotes('')
    } catch {
      alert(`Failed to resolve dispute as ${actionTarget}`)
    }
  }

  const handleCloseCase = async (id: string) => {
    try {
      await disputeService.closeDispute(id)
      refetch()
      refetchDetails()
    } catch {
      alert('Failed to close dispute')
    }
  }

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
          Security Administrator Control Panel
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Dispute Resolution Center
        </h1>
      </div>

      {/* Tabs Menu */}
      <div className="scrollbar-none flex overflow-x-auto whitespace-nowrap border-b border-border text-xs font-semibold">
        {[
          { key: 'pending', label: 'Pending Assignments' },
          { key: 'under_review', label: 'Under Review' },
          { key: 'resolved', label: 'Resolved Cases' },
          { key: 'closed', label: 'Closed' },
          { key: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any)
              setSelectedDisputeId(null)
            }}
            className={`border-b-2 px-4 py-2.5 transition-all ${
              activeTab === tab.key
                ? 'border-destructive font-bold text-destructive'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Disputes List */}
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm lg:col-span-4">
          <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Dispute Logs
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-destructive" />
            </div>
          ) : filteredDisputes.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No disputes in this category.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDisputes.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisputeId(d.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedDisputeId === d.id
                      ? 'bg-destructive/5 border-destructive'
                      : 'hover:bg-muted/30 border-border bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="block max-w-[150px] truncate text-xs font-bold text-foreground">
                      Case #{d.id.slice(0, 8)}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[8px] font-bold capitalize text-muted-foreground">
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    {d.reason}
                  </p>
                  <span className="mt-2 block text-[8px] text-muted-foreground">
                    Opened: {new Date(d.created_at).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Dispute Inspector Workspace */}
        <div className="space-y-6 lg:col-span-8">
          {selectedDisputeId ? (
            isDetailsLoading || !disputeDetails ? (
              <div className="flex items-center justify-center rounded-xl border bg-card py-12">
                <Loader2 className="h-8 w-8 animate-spin text-destructive" />
              </div>
            ) : (
              <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                {/* Header overview actions */}
                <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Conflict Dispute Ticket Details
                    </h3>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Order Reference:{' '}
                      <span className="font-bold">
                        #{disputeDetails.order?.id}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    {!disputeDetails.admin_id ? (
                      <button
                        onClick={() => handleAssignAdmin(disputeDetails.id)}
                        className="hover:bg-destructive/95 inline-flex items-center gap-1.5 rounded bg-destructive px-3 py-1.5 text-white transition-colors"
                      >
                        <Scale className="h-4 w-4" /> Assign To Me
                      </button>
                    ) : disputeDetails.status === 'under_review' ? (
                      <>
                        <button
                          onClick={() => {
                            setActionTarget('refund')
                            setResolutionNotes('')
                          }}
                          className="rounded bg-emerald-600 px-3 py-1.5 text-white transition-colors hover:bg-emerald-700"
                        >
                          Refund Buyer
                        </button>
                        <button
                          onClick={() => {
                            setActionTarget('release')
                            setResolutionNotes('')
                          }}
                          className="rounded bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700"
                        >
                          Release Payout
                        </button>
                      </>
                    ) : null}

                    {disputeDetails.status !== 'closed' && (
                      <button
                        onClick={() => handleCloseCase(disputeDetails.id)}
                        className="rounded border px-3 py-1.5 transition-colors hover:bg-muted"
                      >
                        Close Case
                      </button>
                    )}
                  </div>
                </div>

                {/* Dispute Metadata properties grid */}
                <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-muted-foreground">
                      Buyer
                    </span>
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {disputeDetails.order?.buyer?.full_name || 'Buyer'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-muted-foreground">
                      Seller
                    </span>
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {disputeDetails.order?.seller?.full_name || 'Seller'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-muted-foreground">
                      Escrow Price
                    </span>
                    <div className="text-sm font-bold text-foreground">
                      $
                      {Number(
                        disputeDetails.order?.amount || 0
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-muted-foreground">
                      Case status
                    </span>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-destructive">
                      {disputeDetails.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Reason description */}
                <div className="space-y-2 text-xs">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Conflict Reason
                  </span>
                  <div className="bg-muted/20 rounded-lg border p-3 italic leading-relaxed text-muted-foreground">
                    "{disputeDetails.reason}"
                  </div>
                </div>

                {/* Resolution Notes */}
                {disputeDetails.resolution_notes && (
                  <div className="space-y-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-foreground">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                      Resolution Decision
                    </span>
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                      {disputeDetails.resolution_notes}
                    </p>
                  </div>
                )}

                {/* Dispute Evidence section */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="flex items-center gap-1 font-heading text-xs font-bold text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />{' '}
                    Submitted Evidence Screen Logs
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    {disputeDetails.evidence?.map((ev: DisputeEvidence) => (
                      <div
                        key={ev.id}
                        className="bg-muted/20 space-y-2 rounded-lg border p-3"
                      >
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="font-bold">
                            By: {ev.submitted_by_profile?.full_name || 'User'}
                          </span>
                          <span>
                            {new Date(ev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="leading-normal text-muted-foreground">
                          {ev.description}
                        </p>
                        {ev.file_url && (
                          <a
                            href={ev.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive hover:underline"
                          >
                            View Evidence Asset{' '}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add evidence form */}
                  <form
                    onSubmit={handleUploadEvidence}
                    className="bg-muted/10 space-y-3 rounded-lg border p-3"
                  >
                    <h5 className="text-[10px] font-bold uppercase text-muted-foreground">
                      Submit Conflict Evidence
                    </h5>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <textarea
                        placeholder="Description of the screenshot details or files..."
                        value={evidenceDesc}
                        onChange={(e) => setEvidenceDesc(e.target.value)}
                        className="h-16 w-full rounded border bg-background p-2 text-xs"
                        required
                      />
                      <input
                        type="url"
                        placeholder="File link URL (e.g. cloud storage or imgur screenshot)"
                        value={evidenceUrl}
                        onChange={(e) => setEvidenceUrl(e.target.value)}
                        className="w-full rounded border bg-background p-2 text-xs"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="hover:bg-destructive/95 rounded bg-destructive px-3 py-1.5 text-[10px] font-bold text-white"
                        >
                          Submit Evidence
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Dispute Chat messages timeline */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="flex items-center gap-1 font-heading text-xs font-bold text-foreground">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />{' '}
                    Dispute Moderator Conversation Log
                  </h4>

                  <div className="bg-muted/10 h-64 space-y-3 overflow-y-auto rounded-lg border p-4">
                    {disputeDetails.messages?.map((msg: DisputeMessage) => {
                      const isAdmin = msg.sender_id === disputeDetails.admin_id
                      return (
                        <div
                          key={msg.id}
                          className={`flex max-w-[80%] flex-col rounded-lg p-2.5 text-xs ${
                            isAdmin
                              ? 'bg-destructive/10 border-destructive/20 ml-auto border text-foreground'
                              : 'border bg-background text-foreground'
                          }`}
                        >
                          <span className="text-[9px] font-bold text-muted-foreground">
                            {msg.sender?.full_name || 'Participant'}{' '}
                            {isAdmin && ' (Moderator)'}
                          </span>
                          <p className="mt-1 whitespace-pre-line leading-relaxed text-muted-foreground">
                            {msg.message_text}
                          </p>
                          <span className="mt-1 block text-right text-[8px] text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Send chat message input form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type message to dispute participants..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 rounded-lg border bg-background p-2.5 text-xs text-foreground"
                    />
                    <button
                      type="submit"
                      className="hover:bg-destructive/95 rounded-lg bg-destructive px-4 text-xs font-bold text-white transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed bg-card py-20 text-center shadow-sm">
              <FolderOpen className="h-10 w-10 animate-bounce text-muted-foreground" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  No Dispute Selected
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Select a case file from the sidebar to inspect.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolution decision input modal overlay */}
      {actionTarget && (
        <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md space-y-4 rounded-xl border bg-background p-6 shadow-2xl duration-150">
            <h3 className="font-heading text-sm font-bold text-foreground">
              {actionTarget === 'refund'
                ? 'Confirm Buyer Payout Refund'
                : 'Release Seller Payout Funds'}
            </h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">
                Resolution Notes
              </label>
              <textarea
                placeholder="Detail the audit findings and decision justification notes..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="h-28 w-full rounded-lg border bg-background p-2 text-xs text-foreground"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setActionTarget(null)}
                className="rounded border px-3 py-2 hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveAction}
                disabled={!resolutionNotes.trim()}
                className="hover:bg-destructive/95 rounded bg-destructive px-4 py-2 text-white disabled:opacity-40"
              >
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminDisputesPage
