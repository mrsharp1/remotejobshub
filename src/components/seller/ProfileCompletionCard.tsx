import React from 'react'
import { motion } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'
import { Profile } from '@/types'
import { useWithdrawals } from '@/features/withdrawals/hooks/useWithdrawals'

interface ProfileCompletionCardProps {
  profile: Profile | null
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  profile,
}) => {
  const { data: withdrawals = [] } = useWithdrawals(profile?.id)

  const hasPayoutDetails = withdrawals.length > 0

  const checklistItems = [
    { label: 'Full Name', completed: !!profile?.full_name },
    { label: 'Email', completed: !!profile?.email },
    { label: 'Phone', completed: !!profile?.phone },
    { label: 'Country', completed: !!profile?.country },
    { label: 'Bio', completed: !!profile?.bio },
    { label: 'Government ID', completed: profile?.seller_verified || false },
    {
      label: 'Payment Method',
      completed: hasPayoutDetails,
    },
  ]

  const completedCount = checklistItems.filter((i) => i.completed).length
  const percentage = Math.round((completedCount / checklistItems.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex flex-col space-y-4">
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
