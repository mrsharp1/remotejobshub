import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, AlertCircle, Camera, Loader2 } from 'lucide-react'
import { Profile } from '@/types'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/stores/authStore'

interface ProfileCompletionCardProps {
  profile: Profile | null
  onAvatarUpdated: (url: string) => void
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  profile,
  onAvatarUpdated,
}) => {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile?.avatar_url || null
  )
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { user } = useAuthStore()

  const checklistItems = [
    { label: 'Full Name', completed: !!profile?.full_name },
    { label: 'Email', completed: !!profile?.email },
    { label: 'Phone', completed: !!profile?.phone },
    { label: 'Country', completed: !!profile?.country },
    { label: 'Profile Photo', completed: !!profile?.avatar_url },
    { label: 'Bio', completed: !!profile?.bio },
    { label: 'Government ID', completed: profile?.seller_verified || false },
    {
      label: 'Payment Method',
      completed:
        !!profile?.company_name && !!profile?.company_website && !!profile?.bio,
    },
  ]

  const completedCount = checklistItems.filter((i) => i.completed).length
  const percentage = Math.round((completedCount / checklistItems.length) * 100)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Only JPG, PNG and WEBP files are allowed.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 2MB.')
      return
    }

    setErrorMsg(null)
    setUploading(true)

    try {
      // Setup file reader for instant preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Simulate Storage upload and update user profile
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (user) {
        // Generate a mock URL for preview integration
        const mockUrl = URL.createObjectURL(file)
        const updated = await authService.updateProfile(user.id, {
          avatar_url: mockUrl,
        })
        if (updated) {
          onAvatarUpdated(mockUrl)
        }
      }
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0">
        <div className="group relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="premium-input hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Complete your profile
          </h3>
          <p className="text-sm text-muted-foreground">
            Set up your credentials to enable secure listings and payments.
          </p>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary">{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <p className="mt-3 text-center text-xs text-destructive">{errorMsg}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {checklistItems.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2.5 text-sm">
            {item.completed ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-3.5 w-3.5" />
              </div>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            )}
            <span
              className={
                item.completed
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
