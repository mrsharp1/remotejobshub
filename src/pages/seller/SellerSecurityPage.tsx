import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, ShieldAlert, Cpu, Loader2 } from 'lucide-react'
import { riskService } from '@/services/marketplace/risk.service'
import { useAuthStore } from '@/stores/authStore'

export const SellerSecurityPage: React.FC = () => {
  const { user } = useAuthStore()

  // Fetch Login History
  const { data: logins = [], isLoading: loadingLogins } = useQuery({
    queryKey: ['seller-login-history', user?.id],
    queryFn: () => (user?.id ? riskService.getLoginHistory(user.id) : []),
    enabled: !!user?.id,
  })

  // Fetch Risk Score
  const { data: riskScores = [] } = useQuery({
    queryKey: ['seller-risk-scores'],
    queryFn: () => riskService.getRiskScores(),
  })

  // Find risk score matching this seller
  const riskRec = riskScores.find((r) => r.user_id === user?.id)
  const riskScore = riskRec ? riskRec.score : 10
  const securityScore = 100 - riskScore

  // Simulated active alerts matching user
  const activeAlerts =
    riskScore >= 60
      ? [
          'Suspicious country access logged',
          'Multiple device fingerprints flagged',
        ]
      : []

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Seller Security Monitoring System
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Seller Security Hub
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Audit login histories, assess connected device footprints, and track
          account security scores.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Logins List */}
        <div className="space-y-6 lg:col-span-8">
          {/* Devices summary */}
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <Cpu className="h-4.5 w-4.5 text-primary" /> Active Connected
              Sessions
            </h3>

            {loadingLogins ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : logins.length === 0 ? (
              <div className="py-2 text-xs italic text-muted-foreground">
                No active logins logged.
              </div>
            ) : (
              <div className="space-y-2">
                {logins.slice(0, 3).map((l) => (
                  <div
                    key={l.id}
                    className="bg-muted/20 flex items-center justify-between rounded-lg border p-3 text-xs"
                  >
                    <div>
                      <span className="block font-bold text-foreground">
                        {l.browser} ({l.os})
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        IP: {l.ip_address} • Country: {l.country}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Signins list */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-4">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                Full Session Logs
              </h3>
            </div>
            <div className="overflow-x-auto text-left text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b text-[10px] font-bold uppercase text-muted-foreground">
                    <th className="p-3">Client</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-foreground">
                  {logins.slice(0, 5).map((l) => (
                    <tr key={l.id} className="hover:bg-muted/10">
                      <td className="p-3 font-semibold">
                        {l.browser} on {l.os}
                      </td>
                      <td className="p-3 font-mono">{l.ip_address}</td>
                      <td className="p-3 text-right font-mono text-[10px] text-muted-foreground">
                        {new Date(l.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Security Scores Card */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <ShieldCheck className="h-4.5 w-4.5 text-green-500" /> Security
              Rating
            </h3>

            <div className="flex flex-col items-center justify-center space-y-1 py-4">
              <span
                className={`text-3xl font-extrabold ${securityScore >= 75 ? 'text-green-500' : 'text-amber-500'}`}
              >
                {securityScore}/100
              </span>
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                Account Security Rating
              </span>
            </div>

            <div className="space-y-2.5 border-t pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verification Rank</span>
                <span className="font-semibold text-primary">Gold Partner</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suspicious Alerts</span>
                <span
                  className={`font-semibold ${activeAlerts.length > 0 ? 'text-amber-500' : 'text-green-500'}`}
                >
                  {activeAlerts.length} Active
                </span>
              </div>
            </div>
          </div>

          {activeAlerts.length > 0 && (
            <div className="space-y-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-600">
              <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                <ShieldAlert className="h-4 w-4 text-amber-500" /> Action
                Required
              </h4>
              <ul className="list-disc space-y-1 pl-4">
                {activeAlerts.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default SellerSecurityPage
