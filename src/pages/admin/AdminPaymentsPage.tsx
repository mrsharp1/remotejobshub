import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { paymentService } from '@/services/marketplace/payment.service'
import { Payment } from '@/types'

// Component Imports
import { PaymentsHero } from '@/components/admin/payments/PaymentsHero'
import { RevenueOverview } from '@/components/admin/payments/RevenueOverview'
import { PaymentFilters } from '@/components/admin/payments/PaymentFilters'
import { EscrowQueue } from '@/components/admin/payments/EscrowQueue'
import { TransactionDetailsDrawer } from '@/components/admin/payments/TransactionDetailsDrawer'
import { WithdrawalsCenter } from '@/components/admin/payments/WithdrawalsCenter'
import { RefundRequests } from '@/components/admin/payments/RefundRequests'
import { FraudDetection } from '@/components/admin/payments/FraudDetection'

export const AdminPaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  // Fetch all payments
  const {
    data: payments = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['admin-all-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(
          '*, order:orders(*, listing:listings(*)), buyer:profiles!payments_buyer_id_fkey(*), seller:profiles!payments_seller_id_fkey(*)'
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Payment[]
    },
  })

  // Action Handlers
  const handleReleaseEscrow = async (id: string) => {
    try {
      await paymentService.markReleased(id)
      refetch()
      setSelectedPayment(null)
    } catch {
      alert('Failed to release escrow funds')
    }
  }

  const handleRefundEscrow = async (id: string) => {
    try {
      await paymentService.markRefunded(id)
      refetch()
      setSelectedPayment(null)
    } catch {
      alert('Failed to refund escrow funds')
    }
  }

  // Filter & Search Logic
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.paystack_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.buyer?.full_name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (p.seller?.full_name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'pending' && p.payment_status === 'success') || // success status in DB corresponds to escrow held (pending payout)
      (selectedStatus === 'released' && p.payment_status === 'released') ||
      (selectedStatus === 'refunded' && p.payment_status === 'refunded') ||
      (selectedStatus === 'failed' && p.payment_status === 'failed')

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="border-b border-white/5 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
          Security Administrator Control Console
        </span>
        <h1 className="font-heading text-2xl font-bold text-white mt-1">
          Platform Payments & Escrow Logs
        </h1>
        <p className="text-xs text-slate-400">Manage transaction volumes, releases, and audits</p>
      </div>

      {/* Executive Hero metrics */}
      <PaymentsHero payments={payments} />

      {/* Interactive Revenue curve & simulated centers */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueOverview payments={payments} />
        </div>
        <div>
          <FraudDetection />
        </div>
      </div>

      {/* Query Filters Bar */}
      <PaymentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        count={filteredPayments.length}
      />

      {/* Escrow queue table / list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <EscrowQueue payments={filteredPayments} onInspect={setSelectedPayment} />
          </div>
          <div className="space-y-6">
            <WithdrawalsCenter />
            <RefundRequests />
          </div>
        </div>
      )}

      {/* Transaction Details Drawer */}
      <TransactionDetailsDrawer
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
        onRelease={handleReleaseEscrow}
        onRefund={handleRefundEscrow}
      />
    </div>
  )
}

export default AdminPaymentsPage
