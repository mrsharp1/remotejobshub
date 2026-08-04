import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Plus,
  Loader2,
  Trash2,
  TrendingUp,
  Percent,
  Sparkles,
} from 'lucide-react'
import { promotionService } from '@/services/marketplace/promotion.service'
import { Coupon, Promotion } from '@/types'

export const AdminPromotionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'promotions'>(
    'coupons'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Coupon state
  const [code, setCode] = useState('')
  const [couponDiscType, setCouponDiscType] =
    useState<Coupon['discount_type']>('percentage')
  const [couponValue, setCouponValue] = useState(10)
  const [couponLimit, setCouponLimit] = useState(100)

  // Form Promotion state
  const [title, setTitle] = useState('')
  const [promoDiscType, setPromoDiscType] =
    useState<Promotion['discount_type']>('percentage')
  const [promoValue, setPromoValue] = useState(15)
  const [promoType, setPromoType] =
    useState<Promotion['campaign_type']>('seasonal')

  // Fetch Coupons
  const {
    data: coupons = [],
    isLoading: loadingCoupons,
    refetch: refetchCoupons,
  } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => promotionService.getCoupons(),
  })

  // Fetch Promotions
  const {
    data: promotions = [],
    isLoading: loadingPromos,
    refetch: refetchPromos,
  } = useQuery({
    queryKey: ['admin-promotions'],
    queryFn: () => promotionService.getPromotions(),
  })

  // Fetch Redemptions
  const { data: redemptions = [] } = useQuery({
    queryKey: ['admin-redemptions-logs'],
    queryFn: () => promotionService.getAllRedemptions(),
  })

  // Submit Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setIsSubmitting(true)
    try {
      await promotionService.createCoupon({
        code: code.toUpperCase(),
        discount_type: couponDiscType,
        discount_value: couponValue,
        usage_limit: couponLimit,
        remaining_uses: couponLimit,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
      })
      alert('Coupon code created successfully!')
      setCode('')
      refetchCoupons()
    } catch {
      alert('Failed to create coupon code.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Promotion
  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setIsSubmitting(true)
    try {
      await promotionService.createPromotion({
        title,
        description: `${promoType} discount marketing campaign.`,
        discount_type: promoDiscType,
        discount_value: promoValue,
        campaign_type: promoType,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
      })
      alert('Promotional campaign created successfully!')
      setTitle('')
      refetchPromos()
    } catch {
      alert('Failed to create campaign.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Handlers
  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    try {
      await promotionService.deleteCoupon(id)
      refetchCoupons()
    } catch {
      alert('Failed to delete coupon.')
    }
  }

  const handleDeletePromotion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return
    try {
      await promotionService.deletePromotion(id)
      refetchPromos()
    } catch {
      alert('Failed to delete promotion.')
    }
  }

  // Analytics Math
  const totalSaved = redemptions.reduce(
    (sum, r) => sum + Number(r.discount_applied),
    0
  )

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Marketing Operations Room
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Coupons & Campaigns Center
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Deploy seasonal campaigns, create discount codes, and audit coupon
          redemption analytics.
        </p>
      </div>

      {/* Analytics KPI Dashboard */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Total Redemptions
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {redemptions.length}
            </h3>
          </div>
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Discounts Issued
            </span>
            <h3 className="mt-1 text-xl font-bold text-emerald-500">
              ₦{totalSaved.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              Active Campaigns
            </span>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              {coupons.filter((c) => c.active).length +
                promotions.filter((p) => p.active).length}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs selectors */}
      <div className="flex gap-4 border-b text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`border-b-2 pb-2 transition-colors ${
            activeTab === 'coupons'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          Coupon Codes
        </button>
        <button
          onClick={() => setActiveTab('promotions')}
          className={`border-b-2 pb-2 transition-colors ${
            activeTab === 'promotions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          Marketing Campaigns
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Form Composer */}
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:col-span-5">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            {activeTab === 'coupons' ? 'Create Coupon Code' : 'Launch Campaign'}
          </h3>

          {activeTab === 'coupons' ? (
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2.5 uppercase text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Discount Type
                  </label>
                  <select
                    value={couponDiscType}
                    onChange={(e) =>
                      setCouponDiscType(
                        e.target.value as Coupon['discount_type']
                      )
                    }
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Value
                  </label>
                  <input
                    type="number"
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={couponLimit}
                  onChange={(e) => setCouponLimit(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="hover:bg-primary/95 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 font-bold text-white"
              >
                <Plus className="h-4 w-4" /> Deploy Coupon Code
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleCreatePromotion}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Campaign Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Promo Boost"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Campaign Type
                  </label>
                  <select
                    value={promoType}
                    onChange={(e) =>
                      setPromoType(e.target.value as Promotion['campaign_type'])
                    }
                    className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                  >
                    <option value="seasonal">Seasonal Discount</option>
                    <option value="flash_sale">Flash Sale</option>
                    <option value="seller_boost">Seller Boost</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                    Discount Type
                  </label>
                  <select
                    value={promoDiscType}
                    onChange={(e) =>
                      setPromoDiscType(
                        e.target.value as Promotion['discount_type']
                      )
                    }
                    className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₦)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase text-muted-foreground">
                  Value
                </label>
                <input
                  type="number"
                  value={promoValue}
                  onChange={(e) => setPromoValue(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background p-2.5 text-foreground"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="hover:bg-primary/95 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 font-bold text-white"
              >
                <Plus className="h-4 w-4" /> Launch Campaign
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Deployed lists */}
        <div className="rounded-xl border bg-card shadow-sm lg:col-span-7">
          <div className="border-b p-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              {activeTab === 'coupons'
                ? 'Active Coupons List'
                : 'Active Promotions List'}
            </h3>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'coupons' ? (
              loadingCoupons ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : coupons.length === 0 ? (
                <div className="py-10 text-center text-xs italic text-muted-foreground">
                  No coupons deployed.
                </div>
              ) : (
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Usage</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/50 divide-y bg-white dark:bg-card">
                    {coupons.map((c: Coupon) => (
                      <tr
                        key={c.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="p-3 font-mono font-bold uppercase text-foreground">
                          {c.code}
                        </td>
                        <td className="p-3 text-foreground">
                          {c.discount_type === 'percentage'
                            ? `${c.discount_value}%`
                            : `₦${c.discount_value}`}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {c.remaining_uses} / {c.usage_limit} left
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="hover:text-destructive/90 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : loadingPromos ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : promotions.length === 0 ? (
              <div className="py-10 text-center text-xs italic text-muted-foreground">
                No campaigns launched.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y bg-white dark:bg-card">
                  {promotions.map((p: Promotion) => (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="p-3 font-semibold text-foreground">
                        {p.title}
                      </td>
                      <td className="p-3 font-semibold uppercase text-muted-foreground">
                        {p.campaign_type.replace('_', ' ')}
                      </td>
                      <td className="p-3 text-foreground">
                        {p.discount_type === 'percentage'
                          ? `${p.discount_value}%`
                          : `₦${p.discount_value}`}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeletePromotion(p.id)}
                          className="hover:text-destructive/90 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminPromotionsPage
