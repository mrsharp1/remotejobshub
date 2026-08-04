import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { paystackService } from '@/services/marketplace/paystack.service'

export const PaymentVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const reference = searchParams.get('reference')
  const trxref = searchParams.get('trxref') // Sometimes Paystack passes trxref instead/also

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const queryClient = useQueryClient()

  useEffect(() => {
    const verifyPayment = async () => {
      const ref = reference || trxref
      
      if (!ref) {
        setStatus('error')
        setErrorMessage('Invalid payment reference.')
        return
      }

      try {
        const response = await paystackService.verifyDeposit(ref)
        if (response.success) {
          setStatus('success')
          
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['buyer-wallet'] }),
            queryClient.invalidateQueries({ queryKey: ['buyer-wallet-transactions'] })
          ])

          // Wait briefly to show success animation, then redirect
          setTimeout(() => {
            navigate('/dashboard/wallet', { replace: true })
          }, 3000)
        } else {
          setStatus('error')
          setErrorMessage(response.message || 'Payment verification failed.')
        }
      } catch (err) {
        console.error('Verification error:', err)
        setStatus('error')
        setErrorMessage(
          err instanceof Error ? err.message : 'An error occurred during verification.'
        )
      }
    }

    verifyPayment()
  }, [reference, trxref, navigate])

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75"></div>
              <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Verifying Payment
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we confirm your transaction securely. Do not close this page.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 text-green-500 ring-8 ring-green-500/5">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Payment Successful!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your wallet has been credited. Redirecting you to your wallet...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
              <XCircle className="h-12 w-12" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/wallet', { replace: true })}
              className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Return to Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default PaymentVerifyPage
