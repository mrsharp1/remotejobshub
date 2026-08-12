import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ArrowDownLeft } from 'lucide-react'
import { useRequestWithdrawal } from '../hooks/useRequestWithdrawal'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  availableBalance: number
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  userId,
  availableBalance,
}) => {
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const requestWithdrawalMutation = useRequestWithdrawal()

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numericAmount = Number(amount)

    if (!amount || isNaN(numericAmount)) {
      setError('Please enter a valid amount.')
      return
    }

    if (numericAmount <= 0) {
      setError('Withdrawal amount must be greater than zero.')
      return
    }

    if (numericAmount > availableBalance) {
      setError('Amount exceeds your available balance.')
      return
    }

    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      setError('All bank details are required.')
      return
    }

    requestWithdrawalMutation.mutate(
      {
        userId,
        amount: numericAmount,
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      },
      {
        onSuccess: () => {
          // Close modal
          onClose()
          
          // Clear inputs
          setAmount('')
          setBankName('')
          setAccountNumber('')
          setAccountName('')
          
          // Invalidate query caches to trigger instant UI refresh
          queryClient.invalidateQueries({ queryKey: ['wallet', userId] })
          queryClient.invalidateQueries({ queryKey: ['seller-wallet', userId] })
          queryClient.invalidateQueries({ queryKey: ['withdrawals', userId] })
          queryClient.invalidateQueries({ queryKey: ['seller-withdrawals', userId] })
          queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })

          // Show success toast
          toast.success('Withdrawal request submitted successfully!')
        },
        onError: (err: any) => {
          setError(err?.message || 'Failed to submit withdrawal request. Please try again.')
        },
      }
    )
  }

  const formatNaira = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
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
                    <ArrowDownLeft className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      Request Withdrawal
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Payout to your local bank account
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 pb-safe max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleWithdraw} className="space-y-4">
                  {/* Available Balance Status */}
                  <div className="rounded-xl bg-muted/40 p-4 border">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                      Available Balance
                    </span>
                    <span className="font-heading text-xl font-extrabold text-foreground mt-1 block">
                      {formatNaira(availableBalance)}
                    </span>
                  </div>

                  {/* Bank Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Access Bank, GTBank, etc."
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value)
                        if (error) setError(null)
                      }}
                      disabled={requestWithdrawalMutation.isPending}
                      className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-sm text-foreground shadow-sm min-h-[44px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  {/* Account Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="0123456789"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value)
                        if (error) setError(null)
                      }}
                      disabled={requestWithdrawalMutation.isPending}
                      className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-sm text-foreground shadow-sm min-h-[44px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  {/* Account Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Account Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={accountName}
                      onChange={(e) => {
                        setAccountName(e.target.value)
                        if (error) setError(null)
                      }}
                      disabled={requestWithdrawalMutation.isPending}
                      className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-sm text-foreground shadow-sm min-h-[44px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Amount (₦)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="font-heading text-base font-bold text-muted-foreground">
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
                        disabled={requestWithdrawalMutation.isPending}
                        className="w-full rounded-xl border border-input bg-background py-3 pl-8 pr-4 text-base font-bold text-foreground shadow-sm min-h-[48px] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                        min="1"
                        step="any"
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-xs font-medium text-destructive mt-1">
                        {error}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex flex-col gap-3 sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={requestWithdrawalMutation.isPending || !amount}
                      className="group flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[16px] font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:flex-1"
                    >
                      {requestWithdrawalMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Request Cashout
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={requestWithdrawalMutation.isPending}
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
