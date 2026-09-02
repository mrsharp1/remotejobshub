import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Loader2, Check } from 'lucide-react'
import { broadcastService } from '@/services/marketplace/broadcast.service'
import { useAuthStore } from '@/stores/authStore'

interface Props {
  onAccept: () => void
}

export const SellerAgreementModal: React.FC<Props> = ({ onAccept }) => {
  const { user } = useAuthStore()
  const [selectedPlan, setSelectedPlan] = useState<'OptionA' | 'OptionB'>(
    'OptionA'
  )
  const queryClient = useQueryClient()
  const [isChecked, setIsChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Query if agreement exists
  const { data: agreement, isLoading } = useQuery({
    queryKey: ['seller-revenue-agreement', user?.id],
    queryFn: () =>
      user?.id ? broadcastService.getSellerAgreement(user.id) : null,
    enabled: !!user?.id,
  })

  useEffect(() => {
    if (agreement === null && !isLoading) {
      setIsOpen(true)
    } else if (agreement) {
      setIsOpen(false)
      onAccept()
    }
  }, [agreement, isLoading, onAccept])

  const handleSubmitAgreement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !isChecked) return
    setIsSubmitting(true)
    try {
      await broadcastService.createSellerAgreement(user.id, selectedPlan)
      setIsOpen(false)
      onAccept()
    queryClient.invalidateQueries({ queryKey: ['seller-revenue-agreement', user?.id] })
      alert('Revenue share plan accepted successfully!')
    } catch (error) {
      console.error('SELLER AGREEMENT ERROR:', error)
      alert(
          error instanceof Error
              ? error.message
              : JSON.stringify(error, null, 2)
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-lg space-y-5 rounded-xl border bg-card p-6 shadow-xl duration-200">
        <div className="space-y-2 text-center">
          <div className="bg-primary/10 border-primary/20 mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Seller Revenue Share Agreement
          </h2>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Please digitally review and accept our platform commission terms
            before publishing remote job listings.
          </p>
        </div>

        <form onSubmit={handleSubmitAgreement} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {/* Option A */}
            <button
              type="button"
              onClick={() => setSelectedPlan('OptionA')}
              className={`flex flex-col justify-between space-y-2 rounded-lg border p-4 text-left transition-all ${
                selectedPlan === 'OptionA'
                  ? 'bg-primary/5 shadow-xs border-primary'
                  : 'border-border/80 bg-background hover:bg-muted'
              }`}
            >
              <div>
                <h4 className="flex items-center justify-between font-bold text-foreground">
                  Option A
                  {selectedPlan === 'OptionA' && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </h4>
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                  30% Platform Revenue Share calculated weekly from sales
                  commissions.
                </p>
              </div>
            </button>

            {/* Option B */}
            <button
              type="button"
              onClick={() => setSelectedPlan('OptionB')}
              className={`flex flex-col justify-between space-y-2 rounded-lg border p-4 text-left transition-all ${
                selectedPlan === 'OptionB'
                  ? 'bg-primary/5 shadow-xs border-primary'
                  : 'border-border/80 bg-background hover:bg-muted'
              }`}
            >
              <div>
                <h4 className="flex items-center justify-between font-bold text-foreground">
                  Option B
                  {selectedPlan === 'OptionB' && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </h4>
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                  20% Platform Revenue Share plus ₦5,000 bonus on every
                  qualifying weekly payout.
                </p>
              </div>
            </button>
          </div>

          <label className="bg-muted/20 flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-muted-foreground">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5"
              required
            />
            <span className="text-[10px] leading-relaxed">
              I digitally acknowledge, accept, and agree to follow all
              conditions outlined in version 1.0 of the Seller Revenue Share
              Agreement.
            </span>
          </label>

          <button
            type="submit"
            disabled={!isChecked || isSubmitting}
            className="hover:bg-primary/95 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-bold text-white transition-colors disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              'Accept Terms & Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
export default SellerAgreementModal
