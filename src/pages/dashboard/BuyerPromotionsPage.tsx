import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  History,
} from 'lucide-react'
import { promotionService } from '@/services/marketplace/promotion.service'
import { useAuthStore } from '@/stores/authStore'
import { Coupon, Promotion, CouponRedemption } from '@/types'

export const BuyerPromotionsPage: React.FC = () => {
  const { user } = useAuthStore()
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Fetch seasonal promotions
  const { data: promotions = [], isLoading: loadingPromos } = useQuery({
    queryKey: ['buyer-promotions'],
    queryFn: () => promotionService.getPromotions(),
  })

  // Fetch all coupons
  const { data: coupons = [], isLoading: loadingCoupons } = useQuery({
    queryKey: ['buyer-coupons'],
    queryFn: () => promotionService.getCoupons(),
  })

  // Fetch redemption history
  const {
    data: redemptions = [],
    isLoading: loadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['buyer-redemptions', user?.id],
    queryFn: () => (user?.id ? promotionService.getRedemptions(user.id) : []),
    enabled: !!user?.id,
  })

  // Coupon Code Validation
  const handleValidateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !couponCode.trim()) return
    setIsValidating(true)
    setValidationResult(null)

    try {
      const coupon = await promotionService.validateCoupon(couponCode, user.id)
      setValidationResult({
        type: 'success',
        message: `Coupon "${coupon.code}" is valid! Discount: ₦${coupon.discount_value.toLocaleString()}`,
      })

      if (
        confirm(
          `Redeem ${coupon.code} for ₦${coupon.discount_value.toLocaleString()} wallet credit?`
        )
      ) {
        await promotionService.redeemCouponToWallet(coupon.code)
        alert(`₦${coupon.discount_value.toLocaleString()} has been added to your wallet.`)
        setCouponCode('')
        setValidationResult(null)
        refetchHistory()
      }
    } catch (err: unknown) {
      setValidationResult({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Failed to validate coupon code.',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const activeCoupons = coupons.filter((c) => c.active)
  const activePromotions = promotions.filter((p) => p.active)

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Promotions, Coupons & Seasonal Incentives
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Offers & Promotions Hub
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Redeem coupons, explore hot deals campaigns, and track your cash-saved
          records.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Offers Lists */}
        <div className="space-y-6 lg:col-span-8">
          {/* Coupon Validation card */}
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <Sparkles className="h-4 w-4 animate-pulse text-primary" /> Apply
              Promotional Coupon Code
            </h3>

            <form onSubmit={handleValidateCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER COUPON CODE (e.g. SUMMER20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground placeholder:font-normal placeholder:normal-case focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isValidating}
                className="hover:bg-primary/95 flex items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-60"
              >
                {isValidating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  'Validate & Apply'
                )}
              </button>
            </form>

            {validationResult && (
              <div
                className={`flex items-start gap-2 rounded-lg border p-3 text-xs ${
                  validationResult.type === 'success'
                    ? 'border-green-500/20 bg-green-500/5 text-green-600'
                    : 'border-destructive/20 bg-destructive/5 text-destructive'
                }`}
              >
                {validationResult.type === 'success' ? (
                  <CheckCircle2 className="h-4.5 w-4.5 mt-0.5 text-green-500" />
                ) : (
                  <AlertCircle className="h-4.5 w-4.5 mt-0.5 text-destructive" />
                )}
                <span className="font-medium">{validationResult.message}</span>
              </div>
            )}
          </div>

          {/* Active Campaigns list */}
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Hot Seasonal Promotions
            </h3>
            {loadingPromos ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : activePromotions.length === 0 ? (
              <div className="py-4 text-xs italic text-muted-foreground">
                No seasonal promotion campaigns active right now. Check back
                soon!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {activePromotions.map((p: Promotion) => (
                  <div
                    key={p.id}
                    className="bg-muted/20 space-y-1 rounded-xl border p-4 text-xs"
                  >
                    <div className="flex justify-between font-bold">
                      <span className="text-foreground">{p.title}</span>
                      <span className="uppercase tracking-wider text-primary">
                        {p.discount_type === 'percentage'
                          ? `${p.discount_value}% OFF`
                          : `₦${p.discount_value} OFF`}
                      </span>
                    </div>
                    {p.description && (
                      <p className="text-muted-foreground">{p.description}</p>
                    )}
                    <div className="pt-2 text-[10px] text-muted-foreground">
                      Ends: {new Date(p.end_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Coupons */}
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Recommended Promo Coupons
            </h3>
            {loadingCoupons ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : activeCoupons.length === 0 ? (
              <div className="py-4 text-xs italic text-muted-foreground">
                No active coupon codes available at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {activeCoupons.map((c: Coupon) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between space-y-1.5 rounded-xl border border-dashed bg-card p-4 text-xs"
                  >
                    <div>
                      <span className="block w-fit rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
                        {c.code}
                      </span>
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        Expiry: {new Date(c.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-500">
                      {c.discount_type === 'percentage'
                        ? `${c.discount_value}% OFF`
                        : `₦${c.discount_value} OFF`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: History Timeline */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <History className="h-4 w-4 text-primary" /> Redemptions History
            </h3>

            {loadingHistory ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : redemptions.length === 0 ? (
              <div className="py-4 text-center text-xs italic text-muted-foreground">
                No coupon redemptions logged yet.
              </div>
            ) : (
              <div className="max-h-[350px] space-y-2 overflow-y-auto pr-1">
                {redemptions.map((r: CouponRedemption) => (
                  <div
                    key={r.id}
                    className="bg-muted/20 flex items-center justify-between rounded-lg p-3 text-xs"
                  >
                    <div>
                      <span className="block font-semibold uppercase text-foreground">
                        {r.coupon?.code || 'COUPON'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-bold text-green-500">
                      +₦{Number(r.discount_amount).toLocaleString()} Wallet Credit
                    </span>
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
export default BuyerPromotionsPage
