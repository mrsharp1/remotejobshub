import React from 'react'
import { ShieldCheck, Clock, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react'

export type KycStatus = 'not_started' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_more_info'

interface KycStatusAlertProps {
  status: KycStatus
  notes?: string | null
  onStartVerification?: () => void
}

export const KycStatusAlert: React.FC<KycStatusAlertProps> = ({
  status,
  notes,
  onStartVerification,
}) => {
  const getAlertConfig = () => {
    switch (status) {
      case 'approved':
        return {
          title: 'KYC Verification Approved',
          description: 'Your identity has been fully verified. Listing Studio, Wallet, and Withdrawals are now active.',
          icon: Sparkles,
          styles: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
        }
      case 'pending':
      case 'under_review':
        return {
          title: 'Verification Under Audit',
          description: 'Our compliance desk is currently auditing your documents. This process usually completes in under 2 hours.',
          icon: Clock,
          styles: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
        }
      case 'rejected':
        return {
          title: 'Identity Verification Rejected',
          description: notes || 'Your verification documents did not meet our compliance guidelines. Please review and resubmit.',
          icon: AlertTriangle,
          styles: 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400',
        }
      case 'requires_more_info':
        return {
          title: 'Additional Documentation Required',
          description: notes || 'Please upload a clearer copy of your government ID or utility bill.',
          icon: AlertCircle,
          styles: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400',
        }
      case 'not_started':
      default:
        return {
          title: 'Identity Verification Required',
          description: 'Sellers must pass KYC identity checks before creating listings or processing withdrawals.',
          icon: ShieldCheck,
          styles: 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300',
        }
    }
  }

  const config = getAlertConfig()
  const Icon = config.icon

  return (
    <div className={`rounded-2xl border p-5 shadow-xl transition-all duration-300 flex items-start gap-4 ${config.styles}`}>
      <div className="rounded-xl bg-black/5 dark:bg-white/5 p-2 shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-heading text-sm font-bold text-slate-900 dark:text-white leading-none">
          {config.title}
        </h4>
        <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          {config.description}
        </p>
        {status === 'not_started' && onStartVerification && (
          <button
            onClick={onStartVerification}
            className="mt-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-[10.5px] font-bold text-white transition-all shadow-md"
          >
            Start Identity Verification
          </button>
        )}
        {status === 'rejected' && onStartVerification && (
          <button
            onClick={onStartVerification}
            className="mt-3 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-[10.5px] font-bold text-white transition-all shadow-md"
          >
            Resubmit Documents
          </button>
        )}
      </div>
    </div>
  )
}
