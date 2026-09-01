import React from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

interface SecurityScoreProps {
  score: number
  factors: {
    twoFactorEnabled: boolean
    emailVerified: boolean
  }
}

export const SecurityScore: React.FC<SecurityScoreProps> = ({ score, factors }) => {
  let statusText = 'Weak Security'
  let statusColor = 'text-red-500'

  if (score >= 90) {
    statusText = 'Excellent Security'
    statusColor = 'text-emerald-500'
  } else if (score >= 70) {
    statusText = 'Good Security'
    statusColor = 'text-blue-500'
  } else if (score >= 50) {
    statusText = 'Needs Improvement'
    statusColor = 'text-amber-500'
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-start sm:gap-8">
        
        {/* Score Ring */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32">
          <svg className="absolute inset-0 h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
            <path
              className="text-muted stroke-current"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${statusColor} stroke-current transition-all duration-1000 ease-out`}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">/100</span>
          </div>
        </div>

        {/* Factors */}
        <div className="w-full space-y-4">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h3 className={`font-heading text-lg font-bold flex items-center justify-center gap-2 sm:justify-start ${statusColor}`}>
              <ShieldCheck className={statusColor} />
              {statusText}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {score === 100 ? 'Your account has maximum protection.' : 'Complete these steps to maximize your account protection.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:grid sm:grid-cols-2 sm:items-start sm:gap-2">
            <div className="flex w-full max-w-[200px] items-center gap-3 text-sm sm:max-w-none sm:gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 sm:h-4 sm:w-4" />
              <span>Strong Password</span>
            </div>

            <div className="flex w-full max-w-[200px] items-center gap-3 text-sm sm:max-w-none sm:gap-2">
              {factors.emailVerified ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 sm:h-4 sm:w-4" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 sm:h-4 sm:w-4" />
              )}
              <span>{factors.emailVerified ? 'Email Verified' : 'Email Not Verified'}</span>
            </div>

            <div className="flex w-full max-w-[200px] items-center gap-3 text-sm sm:max-w-none sm:gap-2">
              {factors.twoFactorEnabled ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 sm:h-4 sm:w-4" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 sm:h-4 sm:w-4" />
              )}
              <span>{factors.twoFactorEnabled ? 'Two-Factor Enabled' : 'Two-Factor Disabled'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
