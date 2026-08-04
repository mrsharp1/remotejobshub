import React from 'react'
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react'

interface FraudAnalyticsProps {
  kycSuccessRate: number
  fraudDetectionRate: number
  disputeRate: number
  verificationSuccess: number
}

export const FraudAnalytics: React.FC<FraudAnalyticsProps> = ({
  kycSuccessRate,
  fraudDetectionRate,
  disputeRate,
  verificationSuccess
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold">Trust & Safety</h3>
        <ShieldCheck className="h-5 w-5 text-emerald-500" />
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">KYC Success Rate</span>
            <span className="font-bold text-emerald-500">{kycSuccessRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-500" style={{ width: `${kycSuccessRate}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Verification Success</span>
            <span className="font-bold text-emerald-500">{verificationSuccess.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-500" style={{ width: `${verificationSuccess}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-medium">
              <ShieldAlert className="h-4 w-4 text-blue-500" />
              Fraud Detection Rate
            </span>
            <span className="font-bold text-blue-500">{fraudDetectionRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-blue-500" style={{ width: `${fraudDetectionRate}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Transactions flagged and blocked before settlement.</p>
        </div>

        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-bold text-destructive">Dispute Rate</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-destructive">{disputeRate.toFixed(2)}%</span>
            <span className="text-xs text-muted-foreground">of all completed orders</span>
          </div>
        </div>
      </div>
    </div>
  )
}
