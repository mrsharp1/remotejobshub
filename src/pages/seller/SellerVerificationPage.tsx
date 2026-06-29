import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ShieldCheck,
  Loader2,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { kycService } from '@/services/marketplace/kyc.service'
import { useAuthStore } from '@/stores/authStore'
import { SellerVerification } from '@/types'

export const SellerVerificationPage: React.FC = () => {
  const { user } = useAuthStore()
  const [docType, setDocType] =
    useState<SellerVerification['document_type']>('government_id')
  const [selfieUrl, setSelfieUrl] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch current verification logs
  const {
    data: verification,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['seller-kyc-status', user?.id],
    queryFn: () => (user?.id ? kycService.getVerification(user.id) : null),
    enabled: !!user?.id,
  })

  const handleSubmitKYC = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !selfieUrl || !proofUrl) {
      alert('Please fill out all document links.')
      return
    }
    setIsSubmitting(true)
    try {
      const documentsList = [
        { file_url: selfieUrl, file_type: 'selfie' },
        { file_url: proofUrl, file_type: 'proof_of_address' },
      ]
      await kycService.submitVerification(
        user.id,
        docType,
        selfieUrl,
        proofUrl,
        documentsList
      )
      await refetch()
      alert('KYC documentation submitted successfully for admin review!')
    } catch {
      alert('Failed to submit documentation')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Completion calculation percentage card
  const getCompletionPercent = () => {
    if (verification?.status === 'approved') return 100
    if (verification?.status === 'under_review') return 80
    if (verification?.status === 'pending') return 50
    return 0
  }
  const percent = getCompletionPercent()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Security & Identity Trust Registry
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          KYC & Seller Verification
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Verify your identity to unlock trust badges, priority features, and
          search ranking boosts.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
          {/* Status Box */}
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm md:col-span-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Verification Status
            </h3>

            {/* Percent progress */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold">
                <span>KYC Completion</span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Current Badge Status */}
            <div className="bg-muted/20 space-y-1 rounded-lg border p-3.5 text-xs">
              <span className="block text-[10px] font-bold uppercase text-muted-foreground">
                Registry Status
              </span>
              <div className="mt-1 flex items-center gap-1.5 font-bold text-foreground">
                {verification?.status === 'approved' ? (
                  <>
                    <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                    <span className="uppercase text-green-500">
                      Verified Seller
                    </span>
                  </>
                ) : verification?.status === 'under_review' ? (
                  <>
                    <Clock className="h-4.5 w-4.5 animate-pulse text-amber-500" />
                    <span className="uppercase text-amber-500">
                      Under Review
                    </span>
                  </>
                ) : verification?.status === 'rejected' ? (
                  <>
                    <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                    <span className="uppercase text-destructive">Rejected</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4.5 w-4.5 text-muted-foreground" />
                    <span className="uppercase text-muted-foreground">
                      Unverified
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Admin Reviewer Notes */}
            {verification?.notes && (
              <div className="space-y-1 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs">
                <span className="block font-bold text-foreground">
                  Reviewer Feedback
                </span>
                <p className="italic leading-relaxed text-muted-foreground">
                  "{verification.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Form Composer */}
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm md:col-span-8">
            <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Identity
              Submission Form
            </h3>

            <form onSubmit={handleSubmitKYC} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Select Government ID Type
                  </label>
                  <select
                    value={docType}
                    onChange={(e) =>
                      setDocType(
                        e.target.value as SellerVerification['document_type']
                      )
                    }
                    className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                    disabled={
                      verification?.status === 'approved' ||
                      verification?.status === 'under_review'
                    }
                  >
                    <option value="government_id">Government ID Card</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">
                      National Identification Number (NIN)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Selfie Photo URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/selfie.png"
                    value={selfieUrl}
                    onChange={(e) => setSelfieUrl(e.target.value)}
                    className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                    required
                    disabled={
                      verification?.status === 'approved' ||
                      verification?.status === 'under_review'
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Proof of Address URL (Utility bill, bank statement)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/utility_bill.png"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                  required
                  disabled={
                    verification?.status === 'approved' ||
                    verification?.status === 'under_review'
                  }
                />
              </div>

              {verification?.status !== 'approved' &&
                verification?.status !== 'under_review' && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-bold text-white transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" /> Submit Documentation
                        for Audit
                      </>
                    )}
                  </button>
                )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default SellerVerificationPage
