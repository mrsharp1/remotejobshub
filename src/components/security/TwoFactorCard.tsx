import React, { useState } from 'react'
import { Shield, Smartphone, Key, KeySquare } from 'lucide-react'

export const TwoFactorCard: React.FC = () => {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            enabled 
              ? 'border border-border bg-background text-foreground hover:bg-muted' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {enabled ? 'Manage 2FA' : 'Enable 2FA'}
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {/* Auth App */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold">Authenticator App</p>
              <p className="text-xs text-muted-foreground">Use Google Auth or Authy (Recommended)</p>
            </div>
          </div>
          {enabled ? (
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-500">Enabled</span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">Off</span>
          )}
        </div>

        {/* SMS */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold">SMS Backup</p>
              <p className="text-xs text-muted-foreground">Receive codes via text message</p>
            </div>
          </div>
          <button className="text-sm font-semibold text-primary hover:underline">Add</button>
        </div>

        {/* Recovery Codes */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
              <KeySquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold">Recovery Codes</p>
              <p className="text-xs text-muted-foreground">Emergency access codes</p>
            </div>
          </div>
          {enabled ? (
            <button className="text-sm font-semibold text-foreground hover:underline">View</button>
          ) : (
            <span className="text-xs text-muted-foreground">Requires 2FA</span>
          )}
        </div>
      </div>
    </div>
  )
}
