import React from 'react'
import { AlertTriangle } from 'lucide-react'

export const DangerZone: React.FC = () => {
  return (
    <div className="rounded-2xl border border-destructive bg-destructive/5 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="font-heading text-lg font-bold text-destructive">Danger Zone</h3>
      </div>
      
      <div className="space-y-4">
        {/* Lock Account */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-destructive/20 bg-background p-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">Lock Account</p>
            <p className="mt-1 text-sm text-muted-foreground">Immediately sign out of all devices and disable logins. You will need to contact support to unlock.</p>
          </div>
          <button className="flex-shrink-0 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors">
            Lock Account
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-destructive/20 bg-background p-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold text-destructive">Delete Account</p>
            <p className="mt-1 text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
          </div>
          <button className="flex-shrink-0 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
