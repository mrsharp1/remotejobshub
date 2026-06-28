import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, Clock, FileText, Upload } from 'lucide-react'
import { Profile } from '@/types'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/stores/authStore'

interface VerificationCardProps {
  profile: Profile | null
  onStatusUpdated: (profile: Profile) => void
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  profile,
  onStatusUpdated,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<
    'not_verified' | 'pending' | 'verified' | 'rejected'
  >(
    profile?.seller_verified
      ? 'verified'
      : (profile?.status as any) === 'pending'
        ? 'pending'
        : 'not_verified'
  )
  const { user } = useAuthStore()

  const handleApplyVerification = async () => {
    if (!user) return
    setSubmitting(true)
    try {
      // Simulate ID and Selfie file submission delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const updated = await authService.updateProfile(user.id, {
        status: 'pending',
      })
      if (updated) {
        setVerificationStatus('pending')
        onStatusUpdated(updated)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusDisplay = () => {
    switch (verificationStatus) {
      case 'verified':
        return {
          icon: ShieldCheck,
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
          title: 'Verified Seller',
          description:
            'Your identity has been fully checked and verified. You have full listing rights and trust privileges on the marketplace.',
        }
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
          title: 'Pending Review',
          description:
            'Your government ID and selfie credentials have been received and are currently undergoing compliance review. This takes up to 24 hours.',
        }
      case 'rejected':
        return {
          icon: ShieldAlert,
          color: 'text-destructive bg-destructive/10 border-destructive/20',
          title: 'Verification Rejected',
          description:
            'Your identity checks did not pass verification. Please inspect your submitted images and re-apply with clear documents.',
        }
      default:
        return {
          icon: ShieldCheck,
          color: 'text-muted-foreground bg-muted border-border',
          title: 'Not Verified',
          description:
            'Verify your identity by providing your official Government ID document and a verification selfie to build transaction trust.',
        }
    }
  }

  const statusInfo = getStatusDisplay()
  const Icon = statusInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Trust Verification Center
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {statusInfo.title}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {statusInfo.description}
      </p>

      {verificationStatus === 'not_verified' && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="hover:bg-muted/10 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition-colors">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-sm font-semibold text-foreground">
                Government ID Card
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                National ID, Passport, Driver License
              </span>
              <div className="mt-3 flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                <Upload className="h-3 w-3" /> Upload
              </div>
            </div>

            <div className="hover:bg-muted/10 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition-colors">
              <ShieldCheck className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-sm font-semibold text-foreground">
                Verification Selfie
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                Face forward holding your ID card clearly
              </span>
              <div className="mt-3 flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                <Upload className="h-3 w-3" /> Upload
              </div>
            </div>
          </div>

          <button
            onClick={handleApplyVerification}
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {submitting
              ? 'Submitting verification...'
              : 'Submit Verification Docs'}
          </button>
        </div>
      )}
    </motion.div>
  )
}
