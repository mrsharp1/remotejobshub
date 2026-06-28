import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Receipt } from 'lucide-react'
import { paymentService } from '@/services/marketplace/payment.service'
import { useAuthStore } from '@/stores/authStore'

export const BuyerPaymentsPage: React.FC = () => {
  const { user } = useAuthStore()

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['buyer-payments-history', user?.id],
    queryFn: () => (user?.id ? paymentService.getBuyerPayments(user.id) : []),
    enabled: !!user?.id,
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-border/40 border-b pb-4">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          My Payments History
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          View all your escrow payments and transaction logs.
        </p>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Receipt className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card py-12 text-center">
          <Receipt className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">
            No payments made yet
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Securely buy assets on the marketplace.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-muted/40 border-border/60 border-b text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Listing Title</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Paid At</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-border/40 divide-y text-muted-foreground">
                {payments.map((pay) => (
                  <tr
                    key={pay.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-foreground">
                      {pay.paystack_reference}
                    </td>
                    <td className="max-w-[200px] truncate p-4 font-semibold text-foreground">
                      {pay.order?.listing?.title || 'Account Asset'}
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
                        {pay.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      {pay.paid_at
                        ? new Date(pay.paid_at).toLocaleDateString()
                        : 'Pending'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          alert(
                            `Receipt print logic is coming soon. Reference: ${pay.paystack_reference}`
                          )
                        }
                        className="inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-bold hover:bg-muted"
                      >
                        <Download className="h-3 w-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
export default BuyerPaymentsPage
