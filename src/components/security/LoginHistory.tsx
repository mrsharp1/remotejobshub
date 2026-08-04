import React from 'react'
import { CheckCircle2, XCircle, AlertCircle, Laptop } from 'lucide-react'

export interface LoginEvent {
  id: string
  date: string
  time: string
  ip: string
  browser: string
  os: string
  location: string
  status: 'success' | 'failed' | 'blocked'
  isCurrent?: boolean
}

interface LoginHistoryProps {
  events: LoginEvent[]
}

export const LoginHistory: React.FC<LoginHistoryProps> = ({ events }) => {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h3 className="font-heading text-lg font-bold">Login History</h3>
        <p className="mt-1 text-sm text-muted-foreground">Recent authentication attempts for your account.</p>
      </div>
      
      <div className="divide-y divide-border">
        {events.map((event) => (
          <div key={event.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {event.status === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                {event.status === 'failed' && <XCircle className="h-5 w-5 text-amber-500" />}
                {event.status === 'blocked' && <AlertCircle className="h-5 w-5 text-destructive" />}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {event.status === 'success' ? 'Successful login' : event.status === 'failed' ? 'Failed login attempt' : 'Blocked login attempt'}
                  </span>
                  {event.isCurrent && (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-500">
                      Current
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {event.date} at {event.time} • {event.location} • {event.ip}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Laptop className="h-3 w-3" />
                  {event.browser} on {event.os}
                </div>
              </div>
            </div>
            
            {event.status !== 'success' && (
              <button className="text-sm font-semibold text-primary hover:underline">
                Report Suspicious
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
