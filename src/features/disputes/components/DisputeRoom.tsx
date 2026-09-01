import React, { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, 
  FileText, 
  Scale, 
  User, 
  Clock, 
  Shield,
  Send,
  Loader2,
  Download,
  Upload,
  CheckCircle2
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { disputeService } from '@/services/marketplace/dispute.service'
import type { DisputeMessage } from '@/types'

interface DisputeRoomProps {
  disputeId: string
  role: 'buyer' | 'seller' | 'admin'
}

interface TimelineEvent {
  date: Date
  label: string
  type: 'open' | 'message' | 'evidence' | 'join' | 'resolve' | 'close'
}

// Helpers for file detection
const isImageUrl = (url?: string | null) => {
  if (!url) return false
  const cleanUrl = url.toLowerCase().split('?')[0]
  return cleanUrl.endsWith('.png') || 
         cleanUrl.endsWith('.jpg') || 
         cleanUrl.endsWith('.jpeg') || 
         cleanUrl.endsWith('.webp') ||
         url.includes('image')
}

const getFileIcon = (url?: string | null) => {
  if (!url) return <FileText className="h-5 w-5 text-indigo-400" />
  const cleanUrl = url.toLowerCase().split('?')[0]
  if (cleanUrl.endsWith('.pdf')) {
    return <FileText className="h-5 w-5 text-rose-400" />
  }
  return <FileText className="h-5 w-5 text-indigo-400" />
}

const getFileName = (url?: string | null) => {
  if (!url) return 'Evidence Attachment'
  try {
    const parts = url.split('/')
    const lastPart = parts[parts.length - 1].split('?')[0]
    return decodeURIComponent(lastPart) || 'Evidence Attachment'
  } catch {
    return 'Evidence Attachment'
  }
}

export const DisputeRoom: React.FC<DisputeRoomProps> = ({ disputeId, role }) => {
  const [activeTab, setActiveTab] = useState<'conversation' | 'evidence' | 'timeline'>('conversation')
  const [chatMessage, setChatMessage] = useState('')
  const [sending, setSending] = useState(false)

  // Evidence upload form states
  const [evidenceDesc, setEvidenceDesc] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [submittingEvidence, setSubmittingEvidence] = useState(false)

  // Admin resolution workflow states
  const [actionTarget, setActionTarget] = useState<'refund' | 'release' | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [resolving, setResolving] = useState(false)

  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: dispute, isLoading: loading, refetch } = useQuery({
    queryKey: ['dispute-details', disputeId],
    queryFn: () => disputeService.getDispute(disputeId),
    enabled: !!disputeId,
  })

  // Auto-scroll to latest message on fetch or send
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dispute?.messages, activeTab])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disputeId || !user || !chatMessage.trim() || sending) return
    try {
      setSending(true)
      await disputeService.sendMessage({
        dispute_id: disputeId,
        sender_id: user.id,
        message_text: chatMessage.trim(),
      })
      setChatMessage('')
      refetch()
      queryClient.invalidateQueries({ queryKey: ['dispute-details', disputeId] })
    } catch (err) {
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disputeId || !user || !evidenceDesc.trim() || submittingEvidence) return
    try {
      setSubmittingEvidence(true)
      await disputeService.submitEvidence({
        dispute_id: disputeId,
        submitted_by: user.id,
        description: evidenceDesc.trim(),
        file_url: evidenceUrl.trim() || null,
      })
      setEvidenceDesc('')
      setEvidenceUrl('')
      refetch()
      queryClient.invalidateQueries({ queryKey: ['dispute-details', disputeId] })
    } catch (err) {
      alert('Failed to submit evidence')
    } finally {
      setSubmittingEvidence(false)
    }
  }

  // Admin action execution
  const handleAssignAdmin = async () => {
    if (!user || !disputeId) return
    if (!window.confirm('Are you sure you want to assign this dispute case to yourself?')) return
    try {
      await disputeService.assignAdmin(disputeId, user.id)
      refetch()
      queryClient.invalidateQueries({ queryKey: ['dispute-details', disputeId] })
    } catch {
      alert('Failed to assign admin')
    }
  }

  const handleResolveAction = async () => {
    if (!disputeId || !actionTarget || !resolutionNotes.trim()) return
    const confirmation = window.confirm(
      `Are you sure you want to ${
        actionTarget === 'refund' ? 'refund the buyer' : 'release the payout to the seller'
      }? This action cannot be undone.`
    )
    if (!confirmation) return

    try {
      setResolving(true)
      if (actionTarget === 'refund') {
        await disputeService.resolveBuyer(disputeId, resolutionNotes)
      } else {
        await disputeService.resolveSeller(disputeId, resolutionNotes)
      }
      setActionTarget(null)
      setResolutionNotes('')
      refetch()
      queryClient.invalidateQueries({ queryKey: ['dispute-details', disputeId] })
      queryClient.invalidateQueries({ queryKey: ['admin-disputes-list'] })
    } catch {
      alert('Failed to resolve dispute case')
    } finally {
      setResolving(false)
    }
  }

  const handleCloseCase = async () => {
    if (!disputeId) return
    if (!window.confirm('Are you sure you want to close this case? This action cannot be undone.')) return
    try {
      await disputeService.closeDispute(disputeId)
      refetch()
      queryClient.invalidateQueries({ queryKey: ['dispute-details', disputeId] })
      queryClient.invalidateQueries({ queryKey: ['admin-disputes-list'] })
    } catch {
      alert('Failed to close dispute')
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center text-muted-foreground space-y-2">
        <Clock className="h-8 w-8 animate-spin text-indigo-400" />
        <span className="text-xs">Loading dispute details...</span>
      </div>
    )
  }

  // Get status badge colors
  const getStatusBadge = (status?: string) => {
    const s = status || 'pending'
    switch (s.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pending',
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }
      case 'under_review':
        return {
          label: 'Under Review',
          bg: 'bg-orange-500/10 border-orange-500/20 text-orange-400'
        }
      case 'resolved_buyer':
      case 'resolved_seller':
      case 'resolved':
        return {
          label: s.replace('_', ' '),
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }
      case 'refunded':
        return {
          label: 'Refunded',
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        }
      case 'rejected':
        return {
          label: 'Rejected',
          bg: 'bg-red-500/10 border-red-500/20 text-red-400'
        }
      case 'closed':
      default:
        return {
          label: 'Closed',
          bg: 'bg-slate-500/10 border-slate-500/20 text-muted-foreground'
        }
    }
  }

  const isResolved = ['resolved_buyer', 'resolved_seller', 'closed'].includes(dispute?.status || '')
  const statusBadge = getStatusBadge(dispute?.status)
  const orderId = dispute?.order_id || 'ORD-PLACEHOLDER'
  const createdDate = dispute?.created_at 
    ? new Date(dispute.created_at).toLocaleDateString() 
    : new Date().toLocaleDateString()

  // Generate chronological timeline events
  const getTimelineEvents = () => {
    const events: TimelineEvent[] = []
    if (!dispute) return events

    // 1. Opened event
    events.push({
      date: new Date(dispute.created_at),
      label: `Buyer opened dispute: "${dispute.reason}"`,
      type: 'open',
    })

    // 2. Messages events
    if (dispute.messages) {
      dispute.messages.forEach((msg) => {
        let roleName = 'Participant'
        if (msg.sender_id === dispute.order?.buyer_id) roleName = 'Buyer'
        else if (msg.sender_id === dispute.order?.seller_id) roleName = 'Seller'
        else if (msg.sender_id === dispute.admin_id) roleName = 'Admin'

        events.push({
          date: new Date(msg.created_at),
          label: `${roleName} replied to conversation`,
          type: 'message',
        })
      })
    }

    // 3. Evidence events
    if (dispute.evidence) {
      dispute.evidence.forEach((ev) => {
        let roleName = 'Participant'
        if (ev.submitted_by === dispute.order?.buyer_id) roleName = 'Buyer'
        else if (ev.submitted_by === dispute.order?.seller_id) roleName = 'Seller'
        else if (ev.submitted_by === dispute.admin_id) roleName = 'Admin'

        const fileName = ev.file_url ? getFileName(ev.file_url) : 'file'
        events.push({
          date: new Date(ev.created_at),
          label: `${roleName} uploaded evidence: ${fileName}`,
          type: 'evidence',
        })
      })
    }

    // 4. Admin assign event
    if (dispute.admin_id && dispute.admin) {
      events.push({
        date: new Date(dispute.created_at),
        label: `Admin ${dispute.admin.full_name} joined conversation`,
        type: 'join',
      })
    }

    // 5. Resolution / Close event
    if (dispute.status === 'resolved_buyer') {
      events.push({
        date: new Date(dispute.updated_at),
        label: `Admin refunded buyer. Case closed.`,
        type: 'resolve',
      })
    } else if (dispute.status === 'resolved_seller') {
      events.push({
        date: new Date(dispute.updated_at),
        label: `Admin released escrow payout to seller. Case closed.`,
        type: 'resolve',
      })
    } else if (dispute.status === 'closed') {
      events.push({
        date: new Date(dispute.updated_at),
        label: `Case closed by Administrator`,
        type: 'close',
      })
    }

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const renderResolutionBanner = () => {
    if (!isResolved || !dispute) return null

    const resolvedDate = dispute.updated_at 
      ? new Date(dispute.updated_at).toLocaleDateString() 
      : new Date().toLocaleDateString()

    const winner = dispute.status === 'resolved_buyer' ? 'Buyer' : dispute.status === 'resolved_seller' ? 'Seller' : 'N/A'
    const refundDetails = dispute.status === 'resolved_buyer' 
      ? `Refund Amount: ₦${Number(dispute.order?.amount || 0).toLocaleString()}`
      : 'Escrow Released'

    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-900 dark:text-emerald-100 space-y-4 shadow-lg animate-in fade-in duration-200">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
          <span className="font-heading text-base font-bold uppercase tracking-wider">✓ CASE CLOSED</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs border-b border-emerald-500/10 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Winner</span>
            <div className="font-semibold text-foreground">{winner}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Escrow Action</span>
            <div className="font-semibold text-foreground">{refundDetails}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Resolved By</span>
            <div className="font-semibold text-foreground">{dispute.admin?.full_name || 'Administrator'}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Resolution Date</span>
            <div className="font-semibold text-foreground">{resolvedDate}</div>
          </div>
        </div>
        {dispute.resolution_notes && (
          <div className="pt-1 text-xs text-foreground">
            <span className="block text-[10px] uppercase font-bold text-emerald-400 mb-1">Resolution notes:</span>
            <p className="whitespace-pre-line leading-relaxed italic">
              "{dispute.resolution_notes}"
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderConversationTab = () => {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-[380px] h-[380px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scrollbar-thin">
          {dispute?.messages && dispute.messages.length > 0 ? (
            dispute.messages.map((msg: DisputeMessage) => {
              const isAdmin = msg.sender_id === dispute.admin_id
              const isBuyer = msg.sender_id === dispute.order?.buyer_id
              const isSeller = msg.sender_id === dispute.order?.seller_id
              const isOwn = msg.sender_id === user?.id

              // Role colors bubble styling
              let bubbleStyles = 'bg-muted border border-border text-foreground rounded-tl-sm'
              if (isOwn) {
                if (isBuyer) bubbleStyles = 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                else if (isSeller) bubbleStyles = 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                else if (isAdmin) bubbleStyles = 'bg-purple-600 text-white rounded-tr-sm shadow-md'
              } else {
                if (isBuyer) bubbleStyles = 'bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-tl-sm'
                else if (isSeller) bubbleStyles = 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-tl-sm'
                else if (isAdmin) bubbleStyles = 'bg-purple-500/10 border border-purple-500/20 text-purple-200 rounded-tl-sm'
              }

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start max-w-[85%] ${
                    isOwn ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted-foreground/20 text-foreground text-xs font-bold shrink-0 border border-border">
                    {msg.sender?.full_name?.[0]?.toUpperCase() || 'P'}
                  </div>

                  {/* Message content */}
                  <div className={`space-y-1 max-w-[calc(100%-2.5rem)] ${isOwn ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground justify-start">
                      <span className="font-semibold text-foreground">
                        {msg.sender?.full_name || 'Participant'}
                      </span>
                      {isBuyer && (
                        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">(Buyer)</span>
                      )}
                      {isSeller && (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">(Seller)</span>
                      )}
                      {isAdmin && (
                        <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">(Admin)</span>
                      )}
                      <span className="opacity-60 font-mono text-[9px]">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl px-3 py-2 text-xs leading-relaxed max-w-full break-words whitespace-pre-line text-left ${bubbleStyles}`}
                    >
                      {msg.message_text}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs py-8">
              <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
              <span>No messages in this dispute room yet.</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer Form */}
        {isResolved ? (
          <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
            This dispute has been resolved. No further messages or evidence can be submitted.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-border pt-4 shrink-0">
            <input
              type="text"
              placeholder="Type message to dispute participants..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !chatMessage.trim()}
              className="flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-4 text-xs font-bold transition-colors gap-1.5 animate-in fade-in"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>Send</span>
            </button>
          </form>
        )}
      </div>
    )
  }

  const renderTimelineTab = () => {
    const events = getTimelineEvents()
    return (
      <div className="flex-1 overflow-y-auto min-h-[380px] h-[380px] pr-2 scrollbar-thin space-y-6 py-4">
        {events.length > 0 ? (
          <div className="relative pl-6 border-l border-border space-y-6 text-left text-xs ml-3">
            {events.map((ev, idx) => {
              let dotColor = 'bg-muted-foreground'
              if (ev.type === 'open') dotColor = 'bg-indigo-500'
              else if (ev.type === 'evidence') dotColor = 'bg-amber-500'
              else if (ev.type === 'join') dotColor = 'bg-purple-500'
              else if (ev.type === 'resolve') dotColor = 'bg-emerald-500'
              else if (ev.type === 'close') dotColor = 'bg-slate-500'

              return (
                <div key={idx} className="relative animate-in fade-in duration-150">
                  {/* Timeline Dot */}
                  <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-slate-950 ${dotColor}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-mono block">
                      {ev.date.toLocaleString()}
                    </span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {ev.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
            No events registered yet.
          </div>
        )}
      </div>
    )
  }

  const renderEvidenceTab = () => {
    // Newest evidence first
    const sortedEvidence = dispute?.evidence 
      ? [...dispute.evidence].reverse() 
      : []

    return (
      <div className="flex-1 flex flex-col justify-between min-h-[380px] h-[380px]">
        {/* Scrollable Gallery */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
          {/* Submit form */}
          {isResolved ? (
            <div className="bg-muted/40 border border-border rounded-xl p-3.5 text-center text-xs text-muted-foreground">
              This dispute has been resolved. No further messages or evidence can be submitted.
            </div>
          ) : (
            <form
              onSubmit={handleUploadEvidence}
              className="bg-muted/40 border border-border rounded-xl p-3.5 space-y-3 shrink-0"
            >
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" /> Submit Conflict Evidence
              </h4>
              <div className="space-y-2">
                <textarea
                  placeholder="Description of the screenshot details or files..."
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  className="w-full h-14 rounded-lg border border-border bg-background p-2 text-xs text-foreground placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                  disabled={submittingEvidence}
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="File link URL (e.g. PNG, JPG, JPEG, WEBP, PDF)"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background p-2 text-xs text-foreground placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    disabled={submittingEvidence}
                  />
                  <button
                    type="submit"
                    disabled={submittingEvidence || !evidenceDesc.trim()}
                    className="rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-3 text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                  >
                    {submittingEvidence ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Upload'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* List of cards */}
          <div className="space-y-3">
            {sortedEvidence.length > 0 ? (
              sortedEvidence.map((ev) => {
                const isImg = isImageUrl(ev.file_url)
                const fileName = getFileName(ev.file_url)
                const isAdmin = ev.submitted_by === dispute?.admin_id

                return (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-border bg-card p-3 space-y-3 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between">
                      {/* Uploader info with avatar */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/20 text-foreground text-[10px] font-bold border border-border shrink-0">
                          {ev.submitted_by_profile?.full_name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-foreground line-clamp-1">
                            {ev.submitted_by_profile?.full_name || 'Participant'}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {ev.submitted_by === dispute?.order?.buyer_id && (
                              <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-1 py-0.2 rounded">Buyer</span>
                            )}
                            {ev.submitted_by === dispute?.order?.seller_id && (
                              <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded">Seller</span>
                            )}
                            {isAdmin && (
                              <span className="text-[8px] font-bold text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded">Admin</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(ev.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-foreground leading-normal text-left whitespace-pre-wrap">
                      {ev.description}
                    </p>

                    {/* File Attachment Card */}
                    {ev.file_url && (
                      <div className="flex items-center justify-between gap-2.5 rounded-lg bg-muted/60 p-2.5 border border-border text-left">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-indigo-400 shrink-0 border border-border">
                            {getFileIcon(ev.file_url)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground">{fileName}</p>
                            <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                              {isImg ? '🖼 Image Preview' : '📄 Document File'} • 1.8 MB
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isImg && (
                            <a
                              href={ev.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-indigo-400 hover:underline px-2 py-1 rounded bg-indigo-500/10 transition-colors"
                            >
                              Preview
                            </a>
                          )}
                          <a
                            href={ev.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            title="Download Evidence"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground text-xs py-10">
                <FileText className="h-8 w-8 mb-2 opacity-30" />
                <span>No conflict evidence submitted yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full text-foreground">
      {/* CASE CLOSED banner */}
      {renderResolutionBanner()}

      {/* SECTION 1: Header */}
      <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-sm space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Dispute Workspace Room
            </span>
            <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              Case File: <span className="font-mono text-sm opacity-80">#{disputeId.slice(0, 8)}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadge.bg}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border pt-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span>Order Reference: <strong className="font-mono text-foreground">#{orderId.slice(0, 8)}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>Opened: <strong className="text-foreground">{createdDate}</strong></span>
          </div>
          {role === 'admin' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 text-indigo-400" />
              <span>Assigned Moderator: <strong className="text-foreground">{dispute?.admin?.full_name || 'Unassigned'}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Tabs Switcher (Visible on Mobile to switch, or highlighting current active context) */}
      <div className="md:hidden flex border-b border-border text-sm font-semibold">
        <button
          onClick={() => setActiveTab('conversation')}
          className={`flex-1 pb-3 text-center border-b-2 transition-all ${
            activeTab === 'conversation'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Conversation
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 pb-3 text-center border-b-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex-1 pb-3 text-center border-b-2 transition-all ${
            activeTab === 'evidence'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Evidence
        </button>
      </div>

      {/* Desktop view tabs switcher for Left panel only */}
      <div className="hidden md:flex border-b border-border text-sm font-semibold max-w-[65%]">
        <button
          onClick={() => setActiveTab(activeTab === 'evidence' ? 'conversation' : activeTab)}
          className={`pb-3 pr-6 border-b-2 transition-all ${
            activeTab !== 'evidence' && activeTab === 'conversation'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Conversation
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 pr-6 border-b-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Desktop view: side-by-side layout (65% Left, 35% Right) */}
          <div className="hidden md:grid md:grid-cols-[65%_35%] gap-6">
            {/* Left Area (Conversation or Timeline) */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[450px]">
              <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                {activeTab === 'timeline' ? (
                  <>
                    <Clock className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-heading text-sm font-bold text-foreground">Dispute History Timeline</h3>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-heading text-sm font-bold text-foreground">Shared Conversation</h3>
                  </>
                )}
              </div>
              {activeTab === 'timeline' ? renderTimelineTab() : renderConversationTab()}
            </div>

            {/* Evidence Area (right 35%) */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[450px]">
              <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="font-heading text-sm font-bold text-foreground">Conflict Evidence</h3>
              </div>
              {renderEvidenceTab()}
            </div>
          </div>

          {/* Mobile view: tabbed rendering */}
          <div className="md:hidden">
            {activeTab === 'conversation' && (
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[350px]">
                {renderConversationTab()}
              </div>
            )}
            {activeTab === 'timeline' && (
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[350px]">
                <div className="flex items-center gap-2 border-b border-border pb-3 mb-3 text-left">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-heading text-xs font-bold text-foreground">Dispute History Timeline</h3>
                </div>
                {renderTimelineTab()}
              </div>
            )}
            {activeTab === 'evidence' && (
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[350px]">
                {renderEvidenceTab()}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: Admin Panel sidebar */}
        {role === 'admin' && (
          <div className="w-full lg:w-80 rounded-2xl border border-border bg-card p-6 backdrop-blur-sm space-y-4 shrink-0 h-fit">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Scale className="h-5 w-5 text-rose-500" />
              <h3 className="font-heading text-sm font-bold text-foreground">Admin Control Panel</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {!dispute?.admin_id ? (
                <button 
                  type="button"
                  onClick={handleAssignAdmin}
                  className="w-full rounded-xl bg-destructive hover:bg-destructive/90 py-3 text-xs font-bold text-destructive-foreground transition-colors"
                >
                  Assign to Me
                </button>
              ) : dispute.status === 'under_review' ? (
                <>
                  <button 
                    type="button"
                    onClick={() => {
                      setActionTarget('refund')
                      setResolutionNotes('')
                    }}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                  >
                    Refund Buyer
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setActionTarget('release')
                      setResolutionNotes('')
                    }}
                    className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Release Seller Payment
                  </button>
                </>
              ) : (
                <div className="text-center text-xs text-muted-foreground py-2">
                  No actions available under status: <span className="capitalize">{dispute.status}</span>
                </div>
              )}

              {dispute && dispute.status !== 'closed' && (
                <button 
                  type="button"
                  onClick={handleCloseCase}
                  className="w-full rounded-xl border border-border hover:bg-muted-foreground/20 py-3 text-xs font-bold text-foreground hover:text-foreground transition-all"
                >
                  Close Case
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resolution decision input modal overlay */}
      {actionTarget && (
        <div className="backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-100">
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md space-y-4 rounded-xl border border-border bg-muted p-6 shadow-2xl duration-150 text-foreground">
            <h3 className="font-heading text-sm font-bold text-foreground">
              {actionTarget === 'refund'
                ? 'Confirm Payout Refund to Buyer'
                : 'Release Escrow Payout to Seller'}
            </h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">
                Resolution Decision Notes
              </label>
              <textarea
                placeholder="Detail the case findings and settlement decision notes..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="h-28 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:border-indigo-500"
                disabled={resolving}
              />
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setActionTarget(null)}
                className="rounded border border-border px-3 py-2 hover:bg-muted-foreground/20 transition-colors"
                disabled={resolving}
              >
                Cancel
              </button>
              <button
                onClick={handleResolveAction}
                disabled={resolving || !resolutionNotes.trim()}
                className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-indigo-500 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                {resolving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
