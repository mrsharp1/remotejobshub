import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Users,
  Download,
  AlertTriangle,
  Gift,
} from 'lucide-react'
import { referralService } from '@/services/marketplace/referral.service'
import { walletService } from '@/services/marketplace/wallet.service'
import { ReferralReward } from '@/types'

export const AdminReferralsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  // Fetch all rewards
  const {
    data: rewards = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-referral-rewards'],
    queryFn: () => referralService.getAllReferralRewards(),
  })

  // Action: Approve
  const handleApprove = async (id: string) => {
    if (
      !confirm('Are you sure you want to approve this referral reward bounty?')
    )
      return
    setIsProcessing(id)
    try {
      await referralService.approveReward(id)
      await refetch()
      alert('Referral reward approved and credited to referrer wallet!')
    } catch {
      alert('Failed to approve reward')
    } finally {
      setIsProcessing(null)
    }
  }

  // Action: Reject
  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this referral reward?'))
      return
    setIsProcessing(id)
    try {
      await referralService.rejectReward(id)
      await refetch()
      alert('Referral reward rejected and status cancelled.')
    } catch {
      alert('Failed to reject reward')
    } finally {
      setIsProcessing(null)
    }
  }

  // Action: Manual credit
  const handleManualCredit = async () => {
    const userId = prompt('Enter User ID to credit:')
    if (!userId) return
    const amountStr = prompt('Enter credit amount (₦):')
    if (!amountStr) return
    const desc =
      prompt('Enter adjustment description:') || 'Admin Manual Referral Credit'

    try {
      const wallets = await walletService.getUserWallets(userId)
      if (!wallets || wallets.length === 0) {
        alert('No wallet found for this user.')
        return
      }
      await walletService.adjustBalance(wallets[0].id, Number(amountStr), desc)
      alert('Manual credit completed successfully!')
    } catch {
      alert('Failed to process manual credit')
    }
  }

  // Action: Export CSV
  const handleExportCSV = () => {
    let csv =
      'Referral ID,Referrer Email,Referred Email,Amount,Status,Created At\n'
    rewards.forEach((r) => {
      const referrerEmail = (r.referral as any)?.referrer?.email || ''
      const referredEmail = (r.referral as any)?.referred?.email || ''
      csv += `${r.id},${referrerEmail},${referredEmail},${r.amount},${r.status},${r.created_at}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute(
      'download',
      `referral_rewards_${new Date().toISOString().slice(0, 10)}.csv`
    )
    a.click()
  }

  // Filters
  const filteredRewards = rewards.filter((r) => {
    const referrerEmail = (r.referral as any)?.referrer?.email || ''
    const referredEmail = (r.referral as any)?.referred?.email || ''
    const matchesSearch =
      referrerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referredEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Summary Metrics
  const totalCount = rewards.length
  const approvedCount = rewards.filter((r) => r.status === 'approved').length
  const pendingCount = rewards.filter((r) => r.status === 'pending').length
  const totalPayoutAmt = approvedCount * 1000
  const pendingPayoutAmt = pendingCount * 1000

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Platform Growth Monitoring
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Affiliates Rewards Ledger
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Audit system conversions, approve referral reward credits, and
            detect fraudulent profiles loops.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleManualCredit}
            className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted"
          >
            <Gift className="h-4 w-4 text-primary" /> Inject Manual Bonus
          </button>
          <button
            onClick={handleExportCSV}
            className="hover:bg-primary/95 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-colors"
          >
            <Download className="h-4 w-4" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Total Invites
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {totalCount}
            </h3>
          </div>
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg text-primary">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Approved Paid
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              ₦{totalPayoutAmt.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Pending Hold
            </span>
            <h3 className="mt-1 text-xl font-bold text-amber-500">
              ₦{pendingPayoutAmt.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Conversion Rate
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {totalCount > 0
                ? `${Math.round((approvedCount / totalCount) * 100)}%`
                : '0%'}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search user emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-xs text-foreground focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Reward Statuses</option>
            <option value="pending">Pending Hold</option>
            <option value="approved">Approved paid</option>
            <option value="rejected">Rejected / cancelled</option>
          </select>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : filteredRewards.length === 0 ? (
            <div className="py-16 text-center text-xs italic text-muted-foreground">
              No affiliate rewards logs match filters.
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-muted/30 border-border/40 border-b text-[10px] font-bold uppercase text-muted-foreground">
                  <th className="p-3">Referrer</th>
                  <th className="p-3">Referred User</th>
                  <th className="p-3">Reward Bounty</th>
                  <th className="p-3">Log Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border/50 divide-y">
                {filteredRewards.map((r: ReferralReward) => {
                  const referrerEmail =
                    (r.referral as any)?.referrer?.email || 'N/A'
                  const referredEmail =
                    (r.referral as any)?.referred?.email || 'N/A'
                  const isPending = r.status === 'pending'

                  return (
                    <tr key={r.id} className="hover:bg-muted/10">
                      <td className="p-3 font-semibold text-foreground">
                        {referrerEmail}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {referredEmail}
                      </td>
                      <td className="p-3 font-mono font-bold text-foreground">
                        ₦{Number(r.amount).toLocaleString()}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            r.status === 'approved'
                              ? 'bg-green-500/10 text-green-500'
                              : r.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {isPending ? (
                          <div className="inline-flex justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(r.id)}
                              disabled={isProcessing === r.id}
                              className="text-green-500 hover:text-green-600 disabled:opacity-50"
                              title="Approve Reward"
                            >
                              <CheckCircle className="h-5.5 w-5.5" />
                            </button>
                            <button
                              onClick={() => handleReject(r.id)}
                              disabled={isProcessing === r.id}
                              className="text-red-500 hover:text-red-600 disabled:opacity-50"
                              title="Reject Fraudulent Invite"
                            >
                              <XCircle className="h-5.5 w-5.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-muted-foreground">
                            Audited
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
export default AdminReferralsPage
