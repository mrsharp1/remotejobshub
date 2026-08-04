import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Wallet as WalletIcon } from 'lucide-react'
import { paystackService } from '@/services/marketplace/paystack.service'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const presetAmounts = [5000, 10000, 20000, 50000]

  const prepareWalletDeposit = async (depositAmount: number): Promise<void> => {
    // Determine the base URL dynamically based on environment
    const baseUrl = import.meta.env.VITE_APP_URL || import.meta.env.VITE_SITE_URL || window.location.origin
    const callbackUrl = `${baseUrl}/dashboard/payment/verify`
    
    const response = await paystackService.initializeDeposit(depositAmount, callbackUrl)
    
    if (response.authorization_url) {
      // Redirect to Paystack checkout
      window.location.href = response.authorization_url
    } else {
      throw new Error('No authorization URL returned')
    }
  }

  const handleDeposit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError(null)

    const numericAmount = Number(amount)

    if (!amount || isNaN(numericAmount)) {
      setError('Please enter a valid amount.')
      return
    }

    if (numericAmount <= 0) {
      setError('Deposit amount must be greater than zero.')
      return
    }

    setIsProcessing(true)
    try {
      await prepareWalletDeposit(numericAmount)
      onSuccess()
      onClose()
    } catch (err) {
      setError('Failed to prepare deposit. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString())
    setError(null)
  }

  const formatNaira = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(val)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="w-full overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:max-w-md sm:rounded-2xl"
            >
              <div className="relative border-b border-border/50 bg-muted/30 p-4 sm:p-6">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <WalletIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      Fund Wallet
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Add funds securely via Paystack
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 pb-safe">
                <form onSubmit={handleDeposit} className="space-y-6">
                  {/* Presets */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handlePresetClick(preset)}
                          className={`flex min-h-[48px] items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                            amount === preset.toString()
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted/50'
                          }`}
                        >
                          {formatNaira(preset)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Or Enter Custom Amount
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="font-heading text-lg font-bold text-muted-foreground">
                          ₦
                        </span>
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value)
                          if (error) setError(null)
                        }}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-input bg-background py-3 pl-9 pr-4 text-[16px] font-bold text-foreground shadow-sm min-h-[48px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                        min="1"
                        step="any"
                      />
                    </div>
                    {error && (
                      <p className="text-xs font-medium text-destructive">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col gap-3 sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isProcessing || !amount}
                      className="group flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[16px] font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:flex-1"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Continue to Payment
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isProcessing}
                      className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-[16px] font-bold text-foreground shadow-sm transition-all hover:bg-muted active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
