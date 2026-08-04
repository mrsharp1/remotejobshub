import React from 'react'
import { AlertTriangle, Activity, Users, ShieldAlert, MonitorSmartphone } from 'lucide-react'

// Mock Data
const mockIncidents = [
  { id: '1', type: 'Multiple Failed Logins', user: 'attacker@example.com', ip: '45.33.22.1', time: '10 mins ago', severity: 'high' },
  { id: '2', type: 'Unrecognized Device', user: 'seller@example.com', ip: '103.44.55.1', time: '1 hour ago', severity: 'medium' },
  { id: '3', type: 'Suspicious IP Block', user: 'admin@platform.com', ip: '8.8.8.8', time: '2 hours ago', severity: 'low' },
]

export const AdminSecurityConsole: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Security Console
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Platform-wide security monitoring and threat detection.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
            <MonitorSmartphone className="h-4 w-4" /> Device Audit
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90">
            <ShieldAlert className="h-4 w-4" /> Lock Platform
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="mb-2 flex items-center justify-between text-destructive">
            <span className="text-sm font-bold">Active Threats</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-destructive">12</div>
          <p className="mt-1 text-xs text-muted-foreground">Requires immediate review</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
          <div className="mb-2 flex items-center justify-between text-amber-500">
            <span className="text-sm font-bold">Failed Logins (24h)</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-amber-500">842</div>
          <p className="mt-1 text-xs text-muted-foreground">Normal baseline: ~300</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-bold">Accounts Locked</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-foreground">5</div>
          <p className="mt-1 text-xs text-muted-foreground">Pending manual verification</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
          <div className="mb-2 flex items-center justify-between text-emerald-500">
            <span className="text-sm font-bold">Platform Health</span>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">99.8%</div>
          <p className="mt-1 text-xs text-muted-foreground">No critical vulnerabilities</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h3 className="font-heading text-lg font-bold">Recent Security Incidents</h3>
        </div>
        <div className="divide-y divide-border">
          {mockIncidents.map((incident) => (
            <div key={incident.id} className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  incident.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                  incident.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">{incident.type}</p>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    <span>{incident.user}</span>
                    <span>IP: {incident.ip}</span>
                    <span>{incident.time}</span>
                  </div>
                </div>
              </div>
              <button className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors">
                Investigate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
