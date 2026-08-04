import React from 'react'
import { Laptop, Smartphone, MapPin, Clock, LogOut } from 'lucide-react'

export interface Session {
  id: string
  device: string
  os: string
  browser: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
  icon: 'laptop' | 'mobile'
}

interface ActiveSessionsProps {
  sessions: Session[]
  onRevoke: (id: string) => void
  onRevokeAll: () => void
}

export const ActiveSessions: React.FC<ActiveSessionsProps> = ({ sessions, onRevoke, onRevokeAll }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-lg font-bold">Active Sessions</h3>
          <p className="text-sm text-muted-foreground">Manage devices currently logged into your account.</p>
        </div>
        <button 
          onClick={onRevokeAll}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out all other devices
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {session.icon === 'laptop' ? <Laptop className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{session.device}</span>
                  {session.isCurrent && (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-500">
                      Current Session
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Laptop className="h-3 w-3" /> {session.browser} on {session.os}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {session.location} ({session.ip})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {session.lastActive}
                  </span>
                </div>
              </div>
            </div>
            
            {!session.isCurrent && (
              <button 
                onClick={() => onRevoke(session.id)}
                className="w-full rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors sm:w-auto"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
