import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { referralService } from '@/services/marketplace/referral.service'
import { Referral } from '@/types'
import {
  Users,
  Search,
  CheckCircle,
  DollarSign,
  Settings,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

const formatNGN = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const AdminReferralsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Referral['status'] | 'all'>('all')
  const [isEditingReward, setIsEditingReward] = useState(false)
  const [newRewardValue, setNewRewardValue] = useState('')

  // Settings query
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ['admin-referral-settings'],
    queryFn: () => referralService.getAdminSettings(),
  })
  const currentReward = settings?.reward_amount || 0

  // History query
  const { data: referrals = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['admin-all-referrals'],
    queryFn: () => referralService.getAllReferrals(),
  })

  // Settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (amount: number) => referralService.updateAdminSettings(amount),
    onSuccess: () => {
      toast.success('Referral reward updated successfully.')
      queryClient.invalidateQueries({ queryKey: ['admin-referral-settings'] })
      setIsEditingReward(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update reward setting')
    },
  })

  const handleUpdateReward = () => {
    if (!newRewardValue || newRewardValue.trim() === '') {
      toast.error('Please enter a valid reward amount.')
      return
    }

    const val = Number(newRewardValue)
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid positive number greater than 0.')
      return
    }

    if (window.confirm('Are you sure? This will apply to future qualifying referrals only. Existing earned rewards are not affected.')) {
      updateSettingsMutation.mutate(val)
    }
  }

  // Analytics
  const totalCount = referrals.length
  const paidReferrals = referrals.filter((r) => r.status === 'paid')
  const paidCount = paidReferrals.length
  const totalPayoutAmt = paidReferrals.reduce((sum, r) => sum + Number(r.reward_amount), 0)

  // Filtering
  const filteredReferrals = referrals.filter((r) => {
    const term = searchQuery.toLowerCase()
    const referrerEmail = r.referrer?.email?.toLowerCase() || ''
    const referredEmail = r.referred?.email?.toLowerCase() || ''

    const matchesSearch = referrerEmail.includes(term) || referredEmail.includes(term)
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">
            Referrals Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure automated referral rewards and monitor historical performance.
          </p>
        </div>
      </div>

      {/* Settings Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-base font-bold uppercase tracking-wider text-foreground">
            Referral Settings
          </h3>
        </div>
        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Reward per Successful First Purchase
            </span>
            {loadingSettings ? (
              <Loader2 className="mt-1 h-5 w-5 animate-spin text-primary" />
            ) : (
              <span className="mt-1 block text-2xl font-bold text-foreground">
                {formatNGN(currentReward)}
              </span>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Changes apply to future qualifying referrals. Existing earned rewards are not affected.
            </p>
          </div>
          <div className="flex gap-2">
            {isEditingReward ? (
              <div className="flex items-center gap-2">
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-sm font-bold text-muted-foreground">₦</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      className="premium-input w-32 min-h-[44px] rounded-lg pl-7 pr-3 py-2 text-sm"
                      value={newRewardValue}
                      onChange={(e) => setNewRewardValue(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                <button
                  onClick={handleUpdateReward}
                  disabled={updateSettingsMutation.isPending}
                  className="flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateSettingsMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditingReward(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNewRewardValue(currentReward.toString())
                  setIsEditingReward(true)
                }}
                className="flex min-h-[44px] items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Edit Amount
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Referrals
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {totalCount}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Successful Conversions
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {paidCount}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Payouts
            </span>
            <h3 className="mt-1 text-xl font-bold text-emerald-500">
              {formatNGN(totalPayoutAmt)}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-5 w-5" />
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
              className="premium-input w-full rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Referral['status'] | 'all')}
            className="premium-input rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Purchase Pending</option>
            <option value="paid">Reward Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loadingHistory ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : filteredReferrals.length === 0 ? (
            <div className="py-16 text-center text-sm font-medium text-muted-foreground">
              No referrals match filters.
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr className="border-border/40 border-b">
                  <th className="p-4">Referrer</th>
                  <th className="p-4">Referred User</th>
                  <th className="p-4">Date Joined</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Reward Paid</th>
                </tr>
              </thead>
              <tbody className="divide-border/50 divide-y bg-card">
                {filteredReferrals.map((r: Referral) => {
                  const referrerEmail = r.referrer?.email || 'N/A'
                  const referredEmail = r.referred?.email || 'N/A'

                  return (
                    <tr key={r.id} className="transition-colors hover:bg-muted/10">
                      <td className="p-4 font-medium text-foreground">
                        {referrerEmail}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {referredEmail}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                            r.status === 'paid'
                              ? 'bg-green-500/10 text-green-500'
                              : r.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {r.status === 'pending' ? 'Purchase Pending' : r.status === 'paid' ? 'Paid' : r.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-foreground">
                        {r.status === 'paid' ? formatNGN(Number(r.reward_amount || 0)) : '₦0'}
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
