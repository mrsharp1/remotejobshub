import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Check } from 'lucide-react'
import { Profile } from '@/types'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/stores/authStore'

interface SellerBioCardProps {
  profile: Profile | null
  onBioUpdated: (profile: Profile) => void
}

export const SellerBioCard: React.FC<SellerBioCardProps> = ({
  profile,
  onBioUpdated,
}) => {
  const [bio, setBio] = useState(profile?.bio || '')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { user } = useAuthStore()

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setErrorMsg(null)
    try {
      const updated = await authService.updateProfile(user.id, { bio })
      if (updated) {
        onBioUpdated(updated)
        setIsEditing(false)
      }
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Failed to update bio.')
    } finally {
      setSaving(false)
    }
  }

  const maxLength = 1000

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Professional Bio
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setBio(profile?.bio || '')
                setIsEditing(false)
              }}
              className="text-xs font-semibold text-muted-foreground hover:underline"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              Save
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-center text-xs text-destructive">{errorMsg}</p>
      )}

      {isEditing ? (
        <div className="space-y-1.5">
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Tell prospective buyers about your remote workspace background, skills and expertise..."
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, maxLength))}
            maxLength={maxLength}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            {bio.length} / {maxLength} characters
          </div>
        </div>
      ) : (
        <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {bio ? (
            bio
          ) : (
            <span className="italic text-muted-foreground">
              No biography set. Click 'Edit' to describe your services and
              experience.
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
