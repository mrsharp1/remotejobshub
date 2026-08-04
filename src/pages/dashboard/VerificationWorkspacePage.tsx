import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { disputeService } from '@/services/marketplace/dispute.service'
import { orderService } from '@/services/marketplace/order.service'
import { EventEngine } from '@/lib/events/EventEngine'

import { VerificationHero } from '@/components/verification/VerificationHero'
import { OrderSummary } from '@/components/verification/OrderSummary'
import { Checklist } from '@/components/verification/Checklist'
import { ProgressTracker } from '@/components/verification/ProgressTracker'
import { BuyerNotes } from '@/components/verification/BuyerNotes'
import { EvidenceUploader } from '@/components/verification/EvidenceUploader'
import { HelpPanel } from '@/components/verification/HelpPanel'
import { DecisionPanel } from '@/components/verification/DecisionPanel'
import { ConfirmationModal } from '@/components/verification/ConfirmationModal'
import { VerificationSuccess } from '@/components/verification/VerificationSuccess'
import { VerificationFailure } from '@/components/verification/VerificationFailure'
import { LoadingSkeleton } from '@/components/verification/LoadingSkeleton'
import type { ChecklistItemType, ChecklistStatus } from '@/components/verification/ChecklistItem'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const INITIAL_CHECKLIST: ChecklistItemType[] = [
  { id: 'login', label: 'Gmail Login Successful', status: 'pending' },
  { id: 'password', label: 'Password Changed', status: 'pending' },
  { id: 'recovery_email', label: 'Recovery Email Updated', status: 'pending' },
  { id: 'recovery_phone', label: 'Recovery Phone Updated', status: 'pending' },
  { id: 'backup_codes', label: 'Backup Codes Working', status: 'pending' },
  { id: 'cookies', label: 'Cookies Imported', status: 'pending' },
  { id: '2fa', label: '2FA Working', status: 'pending' },
  { id: 'platform', label: 'Platform Accessible', status: 'pending' },
  { id: 'earnings', label: 'Earnings Dashboard Opens', status: 'pending' },
  { id: 'description', label: 'Account Matches Description', status: 'pending' },
]

export const VerificationWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [checklist, setChecklist] = useState<ChecklistItemType[]>(INITIAL_CHECKLIST)
  const [notes, setNotes] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Use the order query to fetch the current order
  const { data: order, isLoading, isError, refetch } = useQuery({
    queryKey: ['verification-order', id],
    queryFn: () => {
      if (!id) throw new Error('No order ID')
      return orderService.getOrder(id)
    },
    enabled: !!id,
  })

  const progressPercentage = useMemo(() => {
    const total = checklist.length
    const nonPending = checklist.filter(item => item.status !== 'pending').length
    if (total === 0) return 0
    return Math.round((nonPending / total) * 100)
  }, [checklist])

  const canRelease = useMemo(() => {
    // True if all items are completed or failed, meaning no pending items remain.
    return checklist.every(item => item.status !== 'pending')
  }, [checklist])

  if (isLoading) return <LoadingSkeleton />
  if (isError || !order || (order.buyer_id !== user?.id)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <p className="text-slate-400">Order not found or access denied.</p>
      </div>
    )
  }

  if (order.status === 'completed') {
    return <div className="bg-slate-950 min-h-screen"><VerificationSuccess /></div>
  }
  
  if (order.status === 'disputed') {
    return <div className="bg-slate-950 min-h-screen"><VerificationFailure /></div>
  }

  const handleChecklistChange = (itemId: string, status: ChecklistStatus) => {
    setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, status } : item))
  }

  const handleDispute = async () => {
    try {
      setIsProcessing(true)
      // Transition the order state to disputed
      if (!user?.id) throw new Error('User not found')
      await disputeService.createDispute({ order_id: order.id, opened_by: user.id, reason: 'Buyer rejected verification' })
      EventEngine.publish('DISPUTE_OPENED', {
        orderId: order.id,
        reason: 'Buyer rejected verification',
        initiatedBy: user?.id || ''
      })
      toast.success('Dispute opened successfully.')
      refetch()
    } catch (err) {
      toast.error('Failed to open dispute.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmRelease = async () => {
    setShowConfirmModal(false)
    EventEngine.publish('VERIFICATION_COMPLETED', {
      orderId: order?.id || '',
      buyerId: user?.id || ''
    })
    navigate(`/settlement/${order.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button 
            onClick={() => navigate(`/vault/${order.id}`)}
            className="group flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Secure Vault
          </button>
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Reference ID
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:space-y-8">
        
        <VerificationHero order={order} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-8">
            <OrderSummary order={order} />
            <ProgressTracker percentage={progressPercentage} />
            <Checklist items={checklist} onItemChange={handleChecklistChange} />
            <DecisionPanel 
              canRelease={canRelease} 
              onRelease={() => setShowConfirmModal(true)} 
              onDispute={handleDispute} 
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            <BuyerNotes notes={notes} onChange={setNotes} />
            <EvidenceUploader />
            <HelpPanel order={order} />
          </div>
          
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showConfirmModal}
        isLoading={isProcessing}
        onConfirm={handleConfirmRelease}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}
