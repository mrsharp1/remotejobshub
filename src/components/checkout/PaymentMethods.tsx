import React from 'react'
import { Wallet, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface PaymentMethodsProps {
  walletBalance: number
  totalAmount: number
  onFundWallet: () => void
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  walletBalance,
  totalAmount,
  onFundWallet,
}) => {
  const hasEnoughBalance = walletBalance >= totalAmount
  const remainingBalance = walletBalance - totalAmount
  const additionalRequired = totalAmount - walletBalance

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-bold text-white">Payment Method</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Wallet Option (Only Option) */}
        <div
          className={`relative flex flex-col gap-4 rounded-xl border p-5 transition-colors sm:col-span-2 ${
            hasEnoughBalance
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-amber-500/50 bg-amber-500/5'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className={`h-5 w-5 ${hasEnoughBalance ? 'text-indigo-400' : 'text-amber-400'}`} />
                  <span className={`text-base font-bold ${hasEnoughBalance ? 'text-white' : 'text-amber-100'}`}>
                    Buyer Wallet
                  </span>
                </div>
                {!hasEnoughBalance && (
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                    Insufficient Funds
                  </span>
                )}
              </div>
              
              <div className="mt-4 space-y-2 rounded-lg bg-slate-950/50 p-4 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Available Balance:</span>
                  <span className="font-medium text-white">{formatCurrency(walletBalance)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Purchase Total:</span>
                  <span className="font-medium text-white">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="my-2 border-t border-white/10"></div>
                {hasEnoughBalance ? (
                  <div className="flex justify-between text-indigo-300">
                    <span>Remaining Balance After Purchase:</span>
                    <span className="font-bold text-indigo-400">{formatCurrency(remainingBalance)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-amber-300">
                      <span>Additional Amount Required:</span>
                      <span className="font-bold text-amber-400">{formatCurrency(additionalRequired)}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-slate-400 text-xs mb-3">
                        Please fund your wallet before completing this purchase.
                      </p>
                      <button
                        onClick={onFundWallet}
                        className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition-colors"
                      >
                        Fund Wallet
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Confidence Section */}
      <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
        <ul className="space-y-3 text-sm text-emerald-200/80">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>Your payment is held securely in escrow.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>The seller only gets paid after you approve delivery.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>If there is a dispute, your payment remains protected until resolution.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
