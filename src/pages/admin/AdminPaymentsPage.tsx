import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  DollarSign,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { paymentService } from '@/services/marketplace/payment.service'
import { Payment } from '@/types'

export const AdminPaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Selected payment state for inspector drawer
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
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
          Security Administrator Control Console
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Platform Payments & Escrow Logs
        </h1>
      </div>

      {/* Query Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-12">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by reference, buyer, seller, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 py-2 text-xs"
          >
            <option value="all">All Payments</option>
            <option value="pending">Escrow Held</option>
            <option value="released">Released</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Counter */}
        <div className="bg-muted/20 flex items-center justify-center rounded-lg border px-3 text-[10px] font-bold text-muted-foreground md:col-span-3">
          {filteredPayments.length} Payments Found
        </div>
      </div>

      {/* Table grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-destructive" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card py-12 text-center">
          <DollarSign className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">
            No payments matching criteria
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Try altering filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-muted/40 border-border/60 border-b text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Paid At</th>
                  <th className="p-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-border/40 divide-y text-muted-foreground">
                {filteredPayments.map((pay) => (
                  <tr
                    key={pay.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-foreground">
                      {pay.paystack_reference}
                    </td>
                    <td className="max-w-[120px] truncate p-4 font-semibold text-foreground">
                      {pay.buyer?.full_name || 'Buyer'}
                    </td>
                    <td className="max-w-[120px] truncate p-4 font-semibold text-foreground">
                      {pay.seller?.full_name || 'Seller'}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      ${Number(pay.amount).toLocaleString()} {pay.currency}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                          pay.payment_status === 'released'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : pay.payment_status === 'refunded'
                              ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {pay.payment_status === 'success'
                          ? 'Hold in Escrow'
                          : pay.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      {pay.paid_at
                        ? new Date(pay.paid_at).toLocaleDateString()
                        : 'Pending'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="inline-flex items-center gap-1 rounded border bg-background px-2 py-1 text-[10px] font-bold transition-colors hover:bg-muted"
                      >
                        <Eye className="h-3 w-3" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer inspector details */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="backdrop-blur-xs fixed inset-0 bg-black/60"
            onClick={() => setSelectedPayment(null)}
          />
          <aside className="animate-in slide-in-from-right relative z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-background p-6 shadow-2xl duration-200">
            <div className="mb-6 flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                  Escrow Payment Workspace
                </span>
                <h3 className="mt-0.5 max-w-[250px] truncate font-heading text-lg font-bold text-foreground">
                  Ref #{selectedPayment.paystack_reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded border px-2.5 py-1 text-xs font-bold hover:bg-muted"
              >
                Close
              </button>
            </div>

            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Order reference
                  </span>
                  <div className="truncate font-bold text-foreground">
                    {selectedPayment.order_id}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Gateway
                  </span>
                  <div className="font-semibold text-foreground">
                    Paystack Checkout Inline
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Amount Paid
                  </span>
                  <div className="text-sm font-bold text-foreground">
                    ${Number(selectedPayment.amount).toLocaleString()}{' '}
                    {selectedPayment.currency}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">
                    Escrow State
                  </span>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-destructive">
                    {selectedPayment.payment_status === 'success'
                      ? 'HOLD IN ESCROW'
                      : selectedPayment.payment_status}
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h4 className="text-[10px] font-bold uppercase text-muted-foreground">
                  Workflow Participants
                </h4>
                <div className="bg-muted/20 space-y-2 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Buyer Profile:
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedPayment.buyer?.full_name || 'Buyer'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Seller Profile:
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedPayment.seller?.full_name || 'Seller'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resolution releases controls */}
              {selectedPayment.payment_status === 'success' && (
                <div className="space-y-2.5 border-t pt-6">
                  <h4 className="text-[10px] font-bold uppercase text-muted-foreground">
                    Admin Escrow Releases Controls
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReleaseEscrow(selectedPayment.id)}
                      className="flex-1 rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                      Release Payout
                    </button>
                    <button
                      onClick={() => handleRefundEscrow(selectedPayment.id)}
                      className="flex-1 rounded bg-orange-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-700"
                    >
                      Refund Buyer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
export default AdminPaymentsPage
