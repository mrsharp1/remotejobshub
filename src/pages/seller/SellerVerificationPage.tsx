import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Fingerprint } from 'lucide-react'
import { kycService } from '@/services/marketplace/kyc.service'
import { useAuthStore } from '@/stores/authStore'
import { KycStatusAlert } from '@/components/seller/kyc/KycStatusAlert'
import { KycWizard } from '@/components/seller/kyc/KycWizard'

export const SellerVerificationPage: React.FC = () => {
  const { user, sandboxSession, setSandboxSession } = useAuthStore()
  const [showWizard, setShowWizard] = useState(false)

  // Fetch current verification logs from Database
  const {
    data: dbVerification,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['seller-kyc-status', user?.id],
    queryFn: () => (user?.id ? kycService.getVerification(user.id) : null),
    enabled: !!user?.id,
  })

  // Resolve status based on Dev Sandbox vs DB
  const resolvedStatus =
    import.meta.env.DEV && sandboxSession.enabled
      ? (sandboxSession.kycStatus || 'not_started')
      : (dbVerification?.status || 'not_started')

  const resolvedNotes =
    import.meta.env.DEV && sandboxSession.enabled
      ? 'Sandbox simulator review notes feedback.'
      : (dbVerification?.notes || '')

  // Calculate completion percentage
  const getCompletionPercent = () => {
    switch (resolvedStatus) {
      case 'approved':
        return 100
      case 'under_review':
        return 80
      case 'pending':
        return 50
      case 'requires_more_info':
        return 30
      case 'rejected':
        return 10
      case 'not_started':
      default:
        return 0
    }
  }

  const percent = getCompletionPercent()

  const handleSubmitKYC = async (data: {
    docType: 'government_id' | 'passport' | 'drivers_license' | 'national_id'
    govIdUrl: string
    fullName: string
    phoneNumber: string
    dateOfBirth: string
    nationality: string
    residentialAddress: string
  }) => {
    if (!user?.id) return

    // If sandbox is active, prompt the user for their preference
    if (import.meta.env.DEV && sandboxSession.enabled) {
      const submitToRealDB = window.confirm(
        `Developer Sandbox is enabled.\n\nReal KYC submissions are currently disabled.\n\nWould you like to:\n\n[Cancel] - Continue using Sandbox\n[OK] - Submit to the real database`
      )

      if (!submitToRealDB) {
        setSandboxSession({
          ...sandboxSession,
          kycStatus: 'pending',
        })
        setShowWizard(false)
        return
      }
    }

    try {
      const documentsList = [
        { file_url: data.govIdUrl, file_type: data.docType },
      ]
      await kycService.submitVerification(
        user.id,
        data.docType,
        documentsList,
        {
          full_name: data.fullName,
          phone: data.phoneNumber,
          country: data.nationality,
          address: data.residentialAddress,
        }
      )
      await refetch()
      setShowWizard(false)
    } catch (err) {
      console.error("FULL KYC ERROR", err)
      // Since it alerts in kyc.service, we just re-throw
      throw err
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Title Header */}
      <div className="border-b border-white/5 pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
          Security & Identity Trust Registry
        </span>
        <h1 className="font-heading text-2xl font-bold text-white mt-1">
          KYC & Seller Verification
        </h1>
        <p className="text-xs text-slate-400">
          Verify your identity to unlock Listing Studio, Wallet, and Withdrawals.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Status Banner */}
          <KycStatusAlert
            status={resolvedStatus as any}
            notes={resolvedNotes}
            onStartVerification={() => setShowWizard(true)}
          />

          {/* Progress Card */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                  Verification Progress
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {percent}% Complete
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950">
              <div
                className="h-full bg-gradient-to-r from-indigo-550 to-indigo-650 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Stepper Multi-step Wizard */}
          {showWizard && (
            <KycWizard userId={user?.id || ''} onSubmit={handleSubmitKYC} />
          )}
        </div>
      )}
    </div>
  )
}

export default SellerVerificationPage
