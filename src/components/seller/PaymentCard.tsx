import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, Loader2, Check } from 'lucide-react'
import { Profile } from '@/types'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/stores/authStore'

interface PaymentCardProps {
  profile: Profile | null
  onPaymentUpdated: (profile: Profile) => void
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  profile,
  onPaymentUpdated,
}) => {
  const [bankName, setBankName] = useState(profile?.company_name || '')
  const [accountNumber, setAccountNumber] = useState(
    profile?.company_website || ''
  )
  const [accountName, setAccountName] = useState(profile?.full_name || '')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { user } = useAuthStore()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setErrorMsg(null)
    try {
      // Reuse company_name for Bank Name, company_website for Account Number, and full_name for Account Name
      const updated = await authService.updateProfile(user.id, {
        company_name: bankName,
        company_website: accountNumber,
        full_name: accountName,
      })
      if (updated) {
        onPaymentUpdated(updated)
        setIsEditing(false)
      }
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Failed to update payment information.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">
            Payment Setup
          </h3>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Manage
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setBankName(profile?.company_name || '')
                setAccountNumber(profile?.company_website || '')
                setAccountName(profile?.full_name || '')
                setIsEditing(false)
              }}
              className="text-xs font-semibold text-muted-foreground hover:underline"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-center text-xs text-destructive">{errorMsg}</p>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground">
              Bank Name
            </label>
            <input
              type="text"
              required
              className="premium-input mt-1 w-full p-2.5 text-sm text-foreground focus:outline-none"
              placeholder="e.g. Access Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground">
              Account Name
            </label>
            <input
              type="text"
              required
              className="premium-input mt-1 w-full p-2.5 text-sm text-foreground focus:outline-none"
              placeholder="e.g. John Doe"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground">
              Account Number
            </label>
            <input
              type="text"
              required
              pattern="[0-9]*"
              className="premium-input mt-1 w-full p-2.5 text-sm text-foreground focus:outline-none"
              placeholder="e.g. 0123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save Payment Details
          </button>
        </form>
      ) : (
        <div className="bg-muted/30 space-y-2 rounded-lg p-4 text-sm">
          <div className="border-border/50 flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Bank Name</span>
            <span className="font-semibold text-foreground">
              {profile?.company_name || 'Not Configured'}
            </span>
          </div>
          <div className="border-border/50 flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Account Name</span>
            <span className="font-semibold text-foreground">
              {profile?.full_name || 'Not Configured'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Number</span>
            <span className="font-mono font-semibold text-foreground">
              {profile?.company_website || 'Not Configured'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
