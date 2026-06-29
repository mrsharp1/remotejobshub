import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, Cpu, Loader2, CheckCircle2 } from 'lucide-react'
import { riskService } from '@/services/marketplace/risk.service'
import { useAuthStore } from '@/stores/authStore'

export const BuyerSecurityPage: React.FC = () => {
  const { user } = useAuthStore()

  // Fetch Login History
  const { data: logins = [], isLoading: loadingLogins } = useQuery({
    queryKey: ['buyer-login-history', user?.id],
    queryFn: () => (user?.id ? riskService.getLoginHistory(user.id) : []),
    enabled: !!user?.id,
  })

  // Simulated device parameters
  const activeDevice = logins[0] || {
    browser: 'Chrome 122',
    os: 'Windows 11',
    ip_address: '102.89.23.45',
    country: 'NG',
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Buyer Credentials Safeguard
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Buyer Security Settings
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Orchestrate security session lists, analyze connected devices logs,
          and update credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Trusted Devices & Sessions */}
        <div className="space-y-6 lg:col-span-8">
          {/* Active device card */}
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <Cpu className="h-4.5 w-4.5 text-primary" /> Active Login Session
            </h3>

            <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-3 text-xs">
              <div className="space-y-1">
                <span className="block font-bold text-foreground">
                  {activeDevice.browser} on {activeDevice.os}
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  IP: {activeDevice.ip_address} • Country:{' '}
                  {activeDevice.country || 'NG'}
                </span>
              </div>
              <span className="rounded bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-500">
                This Device
              </span>
            </div>
          </div>

          {/* Historical sessions table */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-4">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                Recent Sign-in History
              </h3>
            </div>

            <div className="overflow-x-auto">
              {loadingLogins ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : logins.length === 0 ? (
                <div className="py-8 text-center text-xs italic text-muted-foreground">
                  No login history logged.
                </div>
              ) : (
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/30 border-b text-[10px] font-bold uppercase text-muted-foreground">
                      <th className="p-3">Browser/OS</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Country</th>
                      <th className="p-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/50 divide-y text-foreground">
                    {logins.slice(0, 5).map((l) => (
                      <tr key={l.id} className="hover:bg-muted/10">
                        <td className="p-3 font-semibold">
                          {l.browser} ({l.os})
                        </td>
                        <td className="p-3 font-mono">{l.ip_address}</td>
                        <td className="p-3">{l.country}</td>
                        <td className="p-3 text-right font-mono text-[10px] text-muted-foreground">
                          {new Date(l.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right: Security Status Info */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <ShieldCheck className="h-4.5 w-4.5 text-green-500" /> Account
              Shield Status
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">
                  Verification status
                </span>
                <span className="flex items-center gap-1 font-bold text-green-500">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ID Verified
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">2FA Status</span>
                <span className="font-semibold text-foreground">
                  Configured
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk level status</span>
                <span className="font-bold uppercase text-green-500">
                  Minimal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BuyerSecurityPage
