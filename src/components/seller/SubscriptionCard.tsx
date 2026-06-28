import React from 'react'
import { motion } from 'framer-motion'
import { Award, Zap, CheckCircle2 } from 'lucide-react'
import { Profile } from '@/types'

interface SubscriptionCardProps {
  profile: Profile | null
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  profile,
}) => {
  const plan = profile?.subscription_plan || 'Free'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Subscription Plan
        </h3>
        <span className="bg-primary/10 inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold text-primary">
          <Award className="h-3.5 w-3.5" />
          {plan} Plan
        </span>
      </div>

      <div className="bg-muted/40 rounded-lg p-4">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Remaining Free Listings</span>
          <span className="font-bold text-foreground">3 of 5 listings</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: '60%' }} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          <span>Basic listing priority.</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          <span>Standard response times support.</span>
        </div>
      </div>

      <button className="hover:bg-secondary/80 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <Zap className="h-4 w-4 fill-amber-500 text-amber-500" /> Upgrade Plan
      </button>
    </motion.div>
  )
}
