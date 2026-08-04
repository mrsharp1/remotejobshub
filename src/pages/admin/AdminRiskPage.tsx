import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShieldAlert, Loader2, Lock } from 'lucide-react'
import { riskService } from '@/services/marketplace/risk.service'
import { useAuthStore } from '@/stores/authStore'
import { FraudFlag, RiskScore, BlockedDevice } from '@/types'

export const AdminRiskPage: React.FC = () => {
  const { user: adminUser } = useAuthStore()
  const [deviceFingerprint, setDeviceFingerprint] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false)

  // Fetch Fraud Flags
  const {
    data: fraudFlags = [],
    isLoading: loadingFlags,
    refetch: refetchFlags,
  } = useQuery({
    queryKey: ['admin-fraud-flags'],
    queryFn: () => riskService.getFraudFlags(),
  })

  // Fetch Risk Scores
  const { data: riskScores = [], isLoading: loadingScores } = useQuery({
    queryKey: ['admin-risk-scores'],
    queryFn: () => riskService.getRiskScores(),
  })

  // Fetch Blocked Devices
  const {
    data: blockedDevices = [],
    isLoading: loadingBlocked,
    refetch: refetchBlocked,
  } = useQuery({
    queryKey: ['admin-blocked-devices'],
    queryFn: () => riskService.getBlockedDevices(),
  })

  // Resolve Fraud Flag
  const handleResolveFlag = async (id: string, status: FraudFlag['status']) => {
    try {
      await riskService.updateFlagStatus(id, status)
      alert(`Flag status updated to ${status}.`)
      refetchFlags()
    } catch {
      alert('Failed to resolve flag status.')
    }
  }

  // Blacklist Device Submit
  const handleBlockDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deviceFingerprint.trim() || !adminUser?.id) return
    setIsSubmittingBlock(true)

    try {
      await riskService.blockDevice(
        deviceFingerprint,
        blockReason,
        adminUser.id
      )
      alert('Device fingerprint has been successfully blacklisted.')
      setDeviceFingerprint('')
      setBlockReason('')
      refetchBlocked()
    } catch {
      alert('Failed to block device fingerprint.')
    } finally {
      setIsSubmittingBlock(false)
    }
  }

  // Unblock Device Fingerprint
  const handleUnblockDevice = async (fingerprint: string) => {
    if (!confirm('Remove this device fingerprint from the blacklist?')) return
    try {
      await riskService.unblockDevice(fingerprint)
      alert('Device fingerprint white-listed.')
      refetchBlocked()
    } catch {
      alert('Failed to unblock device.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Marketplace Risk Control Desk
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Risk Management Console
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Audit user risk scores, investigate fraud alerts, and blacklist
          suspicious device fingerprints.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Alerts & Logs lists */}
        <div className="space-y-6 lg:col-span-8">
          {/* Active alerts panel */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-4">
              <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                <ShieldAlert className="h-4.5 w-4.5 text-primary" /> Active
                Fraud Warnings
              </h3>
            </div>

            <div className="overflow-x-auto text-left text-xs">
              {loadingFlags ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : fraudFlags.length === 0 ? (
                <div className="py-10 text-center italic text-muted-foreground">
                  No active fraud flags recorded. Platform is secure.
                </div>
              ) : (
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Risk Level</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/50 divide-y bg-white dark:bg-card">
                    {fraudFlags.map((f: FraudFlag) => (
                      <tr
                        key={f.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="p-3">
                          <span className="block font-bold text-foreground">
                            {f.profile?.full_name || 'System User'}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            {f.profile?.email}
                          </span>
                        </td>
                        <td className="p-3 leading-relaxed text-muted-foreground">
                          {f.reason}
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase ${
                              f.risk_level === 'critical' ||
                              f.risk_level === 'high'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}
                          >
                            {f.risk_level}
                          </span>
                        </td>
                        <td className="p-3 font-bold capitalize text-foreground">
                          {f.status.replace('_', ' ')}
                        </td>
                        <td className="space-x-1 p-3 text-right">
                          {f.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  handleResolveFlag(f.id, 'resolved')
                                }
                                className="rounded bg-green-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-green-600"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() =>
                                  handleResolveFlag(f.id, 'dismissed')
                                }
                                className="hover:bg-muted/80 rounded border bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Risk ratings scores */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-4">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                Risk Scores Audit
              </h3>
            </div>
            <div className="overflow-x-auto text-left text-xs">
              {loadingScores ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : riskScores.length === 0 ? (
                <div className="py-10 text-center italic text-muted-foreground">
                  No risk scores computed.
                </div>
              ) : (
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
                    <tr>
                      <th className="p-3">Account User</th>
                      <th className="p-3">Trust Score Rating</th>
                      <th className="p-3 text-right">Risk Factor Tags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/50 divide-y bg-white dark:bg-card">
                    {riskScores.map((s: RiskScore) => (
                      <tr
                        key={s.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="p-3 font-semibold">
                          {s.profile?.full_name || 'System User'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`font-bold ${
                              s.score >= 70
                                ? 'text-destructive'
                                : s.score >= 40
                                  ? 'text-amber-500'
                                  : 'text-green-500'
                            }`}
                          >
                            {s.score}/100 Risk Score
                          </span>
                        </td>
                        <td className="p-3 text-right leading-relaxed text-muted-foreground">
                          {s.factors.join(', ') || 'Clean logs'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Devices Blacklist composer */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <Lock className="h-4.5 w-4.5 text-primary" /> Blacklist Device ID
            </h3>

            <form onSubmit={handleBlockDevice} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Device Fingerprint ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. dev_f89a2bc4"
                  value={deviceFingerprint}
                  onChange={(e) => setDeviceFingerprint(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Reason for Blacklisting
                </label>
                <textarea
                  placeholder="e.g. Identity theft logs detected on this device fingerprint"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border bg-background p-2.5 text-foreground"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBlock}
                className="hover:bg-primary/95 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 font-bold text-white"
              >
                {isSubmittingBlock ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Blacklist Fingerprint'
                )}
              </button>
            </form>
          </div>

          {/* Blacklisted list */}
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Blacklisted Fingerprints List
            </h3>

            {loadingBlocked ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : blockedDevices.length === 0 ? (
              <div className="py-2 text-xs italic text-muted-foreground">
                No blocked device fingerprints on registry.
              </div>
            ) : (
              <div className="space-y-2">
                {blockedDevices.map((d: BlockedDevice) => (
                  <div
                    key={d.id}
                    className="bg-muted/20 flex items-center justify-between rounded-lg border p-3 text-xs"
                  >
                    <div>
                      <span className="block font-mono font-bold text-foreground">
                        {d.device_fingerprint}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        {d.reason}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnblockDevice(d.device_fingerprint)}
                      className="hover:text-primary/90 font-bold text-primary"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminRiskPage
