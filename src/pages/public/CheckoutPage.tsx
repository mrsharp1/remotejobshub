import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Lock, Loader2 } from 'lucide-react'

import { listingService } from '@/services/marketplace/listing.service'
import { orderService } from '@/services/marketplace/order.service'
import { useAuthStore } from '@/stores/authStore'
import { EventEngine } from '@/lib/events/EventEngine'

import { CheckoutHero } from '@/components/checkout/CheckoutHero'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { BuyerProtection } from '@/components/checkout/BuyerProtection'
import { PaymentMethods } from '@/components/checkout/PaymentMethods'
import { EscrowTimeline } from '@/components/checkout/EscrowTimeline'
import { SecurityPanel } from '@/components/checkout/SecurityPanel'
import { OrderInformation } from '@/components/checkout/OrderInformation'
import { TermsAcceptance } from '@/components/checkout/TermsAcceptance'

import { PaymentFailure } from '@/components/checkout/PaymentFailure'
import { StickyCheckoutBar } from '@/components/checkout/StickyCheckoutBar'
import { LoadingSkeleton } from '@/components/checkout/LoadingSkeleton'
import { DepositModal } from '@/components/wallet/DepositModal'
import { walletService } from '@/services/marketplace/wallet.service'

export const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [escrowAccepted, setEscrowAccepted] = useState(false)
  const [verificationAccepted, setVerificationAccepted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failure'>('idle')
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)


  // Fetch listing data
  const {
    data: listing,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['listing-checkout', id],
    queryFn: () => {
      if (!id) throw new Error('No ID provided')
      return listingService.getListing(id)
    },
    enabled: !!id,
  })

  // Fetch wallet data
  const {
    data: wallet,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: () => walletService.getWallet(user!.id),
    enabled: !!user?.id,
  })

  // Wait for wallet and listing data to calculate canPay correctly
  const totalPayment = listing ? Number(listing.price) + (Number(listing.price) * 0.05) : 0
  const walletBalance = Number(wallet?.available_balance || 0)
  const hasEnoughBalance = walletBalance >= totalPayment

  const canPay = escrowAccepted && verificationAccepted && termsAccepted && hasEnoughBalance

  // Ensure user is logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate(`/login?redirect=/checkout/${id}`)
    }
  }, [user, isLoading, id, navigate])

  const handlePaySecurely = async () => {
    if (!user?.id || !user?.email || !listing || !canPay) return

    setIsSubmitting(true)
    setPaymentError(null)

    try {
      if (walletBalance >= totalPayment) {
        // Direct escrow flow from Buyer Wallet
        await proceedToEscrow()
      } else {
        setPaymentError('Insufficient wallet balance. Please fund your wallet.')
        setIsSubmitting(false)
      }
    } catch (err: any) {
      console.error('Payment Error:', err)
      setPaymentError(err?.message || 'We could not process your transaction.')
      setPaymentStatus('failure')
      setIsSubmitting(false)
    }
  }

  const proceedToEscrow = async () => {
    try {
      // 1. Single Atomic RPC Checkout
      const result = await orderService.checkoutWithWallet(listing!.id)

      // 2. Publish Events
      EventEngine.publish('ORDER_CREATED', {
        orderId: result.order_id,
        amount: Number(listing!.price),
        buyerId: user!.id,
        sellerId: listing!.seller_id
      })

      EventEngine.publish('PAYMENT_CONFIRMED', {
        orderId: result.order_id,
        amount: Number(listing!.price)
      })
      
      EventEngine.publish('ESCROW_LOCKED', {
        orderId: result.order_id,
        amount: Number(listing!.price)
      })

      // 3. Update UI
      setCreatedOrderId(result.order_id)
      setPaymentStatus('success')

      // 4. Invalidate order caches so the new order appears on the dashboard immediately
      queryClient.invalidateQueries({ queryKey: ['buyer-orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview-orders'] })
    } catch (err: any) {
      console.error('Escrow Error:', err)
      setPaymentError(err?.message || 'Failed to secure escrow.')
      setPaymentStatus('failure')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setPaymentStatus('idle')
    setPaymentError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-8">
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center text-slate-400">
          <p>Listing not found or no longer available.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="mt-4 rounded-xl bg-indigo-500 px-6 py-2 text-white"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'success' && createdOrderId) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 sm:px-6 flex items-center justify-center">
        <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/5 bg-slate-900 p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">Congratulations!</h1>
            <p className="text-lg text-emerald-400 font-medium">Your account purchase has been successfully confirmed.</p>
          </div>

          <div className="space-y-6 text-slate-300 leading-relaxed text-[15px] sm:text-base">
            <p>
              The vendor will begin sourcing the exact type of account you purchased. Your account is expected to be delivered within 2 weeks.
            </p>
            <p>
              If the vendor is unable to deliver your account within the specified timeframe, you will be placed in a set, subject to the terms and conditions you agreed to at the time of purchase.
            </p>

            <div className="mt-10 rounded-2xl bg-slate-950/50 p-6 sm:p-8 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-indigo-400">❓</span> What does &ldquo;set&rdquo; mean?
              </h2>
              <p className="mb-6">
                A set is a queue for customers who are still waiting to receive their accounts. Once it is your turn, you will be contacted via Telegram or email with further instructions regarding your account.
              </p>
              
              <div className="bg-indigo-500/10 rounded-xl p-6 border border-indigo-500/20 text-center">
                <p className="text-indigo-100 mb-6 font-medium leading-relaxed">
                  Please join our Millionaire Inner Circle Community for updates and further communication when your set is ready.
                </p>
                <a 
                  href="https://t.me/+UpeORMuCGgNhMDE0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#229ED9] px-8 py-3.5 font-bold text-white transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#229ED9]/20"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Join Telegram Community
                </a>
              </div>
            </div>

            <div className="text-center mt-10 space-y-4">
              <p className="text-sm text-slate-400">
                Also, ensure email notifications are enabled. You will receive an email notification as soon as your account is ready.
              </p>
              <p className="font-semibold text-white text-lg mt-4">
                Thank you for your patience and cooperation. 🙏
              </p>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center border-t border-white/5 pt-8">
             <button
               onClick={() => navigate('/dashboard')}
               className="rounded-xl border border-white/10 bg-white/5 px-10 py-3.5 font-bold text-white transition-colors hover:bg-white/10"
             >
               Go to Dashboard
             </button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'failure') {
    return (
      <div className="min-h-screen bg-slate-950 px-4 pt-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <PaymentFailure onRetry={handleRetry} error={paymentError || undefined} />
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-950 pb-32 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-8 pb-40 lg:px-8">
        <div className="mb-8 flex items-center border-b border-white/5 pb-4">
          <Link
            to={`/listing/${listing.id}`}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Asset
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Main Checkout Flow Column */}
          <div className="space-y-12 lg:col-span-7 xl:col-span-8">
            <CheckoutHero />
            
            <div className="lg:hidden">
              <OrderSummary listing={listing} />
            </div>

            <PaymentMethods
              walletBalance={walletBalance}
              totalAmount={totalPayment}
              onFundWallet={() => setIsDepositModalOpen(true)}
            />
            <BuyerProtection />
            <EscrowTimeline />
            <OrderInformation />
            <TermsAcceptance 
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              escrowAccepted={escrowAccepted}
              setEscrowAccepted={setEscrowAccepted}
              verificationAccepted={verificationAccepted}
              setVerificationAccepted={setVerificationAccepted}
            />

            {/* Desktop Pay Button */}
            <div className="hidden lg:block">
              <button
                onClick={handlePaySecurely}
                disabled={!canPay || isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-indigo-500 py-5 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <div className="absolute inset-0 translate-y-full bg-indigo-400 transition-transform duration-300 ease-out group-hover:translate-y-0" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Pay Securely
                    </span>
                  </>
                )}
              </button>
              <div className="mt-4 text-center">
                <SecurityPanel />
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              <OrderSummary listing={listing} />
              
              <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6">
                <SecurityPanel />
              </div>
            </div>
          </div>
        </div>
      </div>

      <StickyCheckoutBar 
        total={totalPayment}
        isDisabled={!canPay}
        isSubmitting={isSubmitting}
        onPayClick={handlePaySecurely}
      />

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onSuccess={() => refetchWallet()}
      />
    </div>
  )
}
export default CheckoutPage
