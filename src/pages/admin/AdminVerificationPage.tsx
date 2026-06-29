import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { kycService } from '@/services/marketplace/kyc.service'
import { SellerVerification } from '@/types'

export const AdminVerificationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'under_review' | 'approved' | 'rejected'
  >('all')
  const [selectedKyc, setSelectedKyc] = useState<SellerVerification | null>(
    null
  )
  const [reviewNotes, setReviewNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch all verifications
  const {
    data: verifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-kyc-list'],
    queryFn: () => kycService.getAllVerifications(),
  })

  // Action status updater
  const handleUpdateStatus = async (status: SellerVerification['status']) => {
    if (!selectedKyc) return
    setIsUpdating(true)
    try {
      await kycService.updateVerificationStatus(
        selectedKyc.id,
        status,
        reviewNotes || 'Verification audit complete.',
        '' // Mock admin Id (Rely on trigger or backend metadata)
      )
      alert(`Verification status updated to ${status}!`)
      setSelectedKyc(null)
      setReviewNotes('')
      await refetch()
    } catch {
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  // Filters
  const filtered = verifications.filter((v) => {
    const fullName = v.profile?.full_name || ''
    const email = v.profile?.email || ''
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Compliance & Safety Registry
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Admin KYC Center
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Audit government identifiers, review uploaded photos, and verify trust
          statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Requests List */}
        <div
          className={`rounded-xl border bg-card shadow-sm ${selectedKyc ? 'lg:col-span-7' : 'lg:col-span-12'}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-xs text-foreground focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as SellerVerification['status'] | 'all'
                )
              }
              className="rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All KYC Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-xs italic text-muted-foreground">
                No KYC verifications log found.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/30 border-border/40 border-b text-[10px] font-bold uppercase text-muted-foreground">
                    <th className="p-3">Seller</th>
                    <th className="p-3">ID Type</th>
                    <th className="p-3">Registry Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y">
                  {filtered.map((v: SellerVerification) => (
                    <tr
                      key={v.id}
                      className={`hover:bg-muted/10 cursor-pointer ${
                        selectedKyc?.id === v.id ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedKyc(v)
                        setReviewNotes(v.notes || '')
                      }}
                    >
                      <td className="p-3">
                        <span className="block font-bold text-foreground">
                          {v.profile?.full_name || 'Seller'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {v.profile?.email}
                        </span>
                      </td>
                      <td className="p-3 font-semibold uppercase text-foreground">
                        {v.document_type.replace('_', ' ')}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(v.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            v.status === 'approved'
                              ? 'bg-green-500/10 text-green-500'
                              : v.status === 'under_review'
                                ? 'bg-amber-500/10 text-amber-500'
                                : v.status === 'rejected'
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          className="rounded-lg border bg-card p-1.5 text-primary hover:bg-muted"
                          title="Review Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Review Details Inspector */}
        {selectedKyc && (
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:col-span-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Request
                Inspector
              </h3>
              <button
                onClick={() => setSelectedKyc(null)}
                className="text-xs text-muted-foreground hover:underline"
              >
                Close
              </button>
            </div>

            {/* Profile Detail */}
            <div className="bg-muted/20 space-y-1 rounded-lg border p-3 text-xs">
              <span className="block font-bold text-foreground">
                {selectedKyc.profile?.full_name || 'Seller'}
              </span>
              <span className="block text-muted-foreground">
                {selectedKyc.profile?.email}
              </span>
            </div>

            {/* Image Previews */}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Selfie Photo Link
                </label>
                <div className="bg-muted/20 overflow-hidden rounded-lg border">
                  <img
                    src={selectedKyc.selfie_url}
                    alt="Selfie"
                    className="max-h-40 w-full cursor-pointer object-cover hover:opacity-90"
                    onClick={() =>
                      window.open(selectedKyc.selfie_url, '_blank')
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Proof of Address utility bill
                </label>
                <div className="bg-muted/20 overflow-hidden rounded-lg border">
                  <img
                    src={selectedKyc.proof_of_address_url}
                    alt="Address Proof"
                    className="max-h-40 w-full cursor-pointer object-cover hover:opacity-90"
                    onClick={() =>
                      window.open(selectedKyc.proof_of_address_url, '_blank')
                    }
                  />
                </div>
              </div>
            </div>

            {/* Review composition notes */}
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                Review Notes Feedback
              </label>
              <textarea
                placeholder="Enter audit remarks or rejection reasons..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border bg-background p-2 text-xs text-foreground"
              />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleUpdateStatus('approved')}
                disabled={isUpdating}
                className="flex items-center justify-center gap-1 rounded-lg bg-green-600 py-1.5 text-center text-[10px] font-bold text-white hover:bg-green-600/95 disabled:opacity-60"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                onClick={() => handleUpdateStatus('rejected')}
                disabled={isUpdating}
                className="flex items-center justify-center gap-1 rounded-lg bg-red-600 py-1.5 text-center text-[10px] font-bold text-white hover:bg-red-600/95 disabled:opacity-60"
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
              <button
                onClick={() => handleUpdateStatus('under_review')}
                disabled={isUpdating}
                className="flex items-center justify-center gap-1 rounded-lg bg-amber-500 py-1.5 text-center text-[10px] font-bold text-white hover:bg-amber-500/95 disabled:opacity-60"
              >
                <Clock className="h-3.5 w-3.5" /> Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default AdminVerificationPage
