import React from 'react'
import { Lock, Clock, AlertTriangle } from 'lucide-react'

export const PasswordSecurity: React.FC = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold">Password Security</h3>
            <p className="text-sm text-muted-foreground">Ensure your account uses a strong, unique password.</p>
          </div>
        </div>
        
        <button className="flex-shrink-0 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
          Change Password
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Password Strength</span>
            <span className="text-sm font-bold text-emerald-500">Strong</span>
          </div>
          <div className="flex h-2 w-full gap-1">
            <div className="h-full flex-1 rounded-l-full bg-emerald-500"></div>
            <div className="h-full flex-1 bg-emerald-500"></div>
            <div className="h-full flex-1 rounded-r-full bg-emerald-500"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Last Changed</p>
              <p className="text-sm font-bold">3 months ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Compromised Warnings</p>
              <p className="text-sm font-bold text-foreground">0 detected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
