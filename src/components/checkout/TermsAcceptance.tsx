import React from 'react'

interface TermsAcceptanceProps {
  termsAccepted: boolean
  setTermsAccepted: (val: boolean) => void
  escrowAccepted: boolean
  setEscrowAccepted: (val: boolean) => void
  verificationAccepted: boolean
  setVerificationAccepted: (val: boolean) => void
}

export const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({
  termsAccepted,
  setTermsAccepted,
  escrowAccepted,
  setEscrowAccepted,
  verificationAccepted,
  setVerificationAccepted,
}) => {
  return (
    <div className="space-y-4 rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="font-heading text-lg font-bold text-white">Terms of Transaction</h3>
      
      <div className="space-y-4">
        <label className="flex cursor-pointer items-start gap-3 select-none">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="premium-input h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
              checked={escrowAccepted}
              onChange={(e) => setEscrowAccepted(e.target.checked)}
            />
          </div>
          <span className="text-sm leading-relaxed text-slate-300">
            I understand that my payment is held in escrow by Remote Job Hub and the seller will not receive funds until I verify the account.
          </span>
        </label>
        
        <label className="flex cursor-pointer items-start gap-3 select-none">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="premium-input h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
              checked={verificationAccepted}
              onChange={(e) => setVerificationAccepted(e.target.checked)}
            />
          </div>
          <span className="text-sm leading-relaxed text-slate-300">
            I understand the verification period is 3 days. If I do not report an issue within this timeframe, the escrow funds will be automatically released to the seller.
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 select-none">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="premium-input h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          </div>
          <span className="text-sm leading-relaxed text-slate-300">
            I agree to the <a href="#" className="text-indigo-400 hover:underline">Platform Terms of Service</a> and <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
          </span>
        </label>
      </div>
    </div>
  )
}
