import React from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

interface SecurityScoreProps {
  score: number
  factors: {
    twoFactorEnabled: boolean
    passwordStrength: 'strong' | 'medium' | 'weak'
    emailVerified: boolean
    identityVerified: boolean
  }
}

export const SecurityScore: React.FC<SecurityScoreProps> = ({ score, factors }) => {
  const isExcellent = score >= 80

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-start sm:gap-8">
        
        {/* Score Ring */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
            <path
              className="text-muted stroke-current"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${isExcellent ? 'text-emerald-500' : 'text-amber-500'} stroke-current transition-all duration-1000 ease-out`}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">Score</span>
          </div>
        </div>

        {/* Factors */}
        <div className="mt-6 w-full space-y-4 sm:mt-0">
          <div>
            <h3 className="font-heading text-lg font-bold flex items-center gap-2">
              <ShieldCheck className={isExcellent ? 'text-emerald-500' : 'text-amber-500'} />
              {isExcellent ? 'Excellent Security' : 'Security Needs Attention'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete these steps to maximize your account protection.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              {factors.twoFactorEnabled ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span>Two-Factor Auth</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {factors.passwordStrength === 'strong' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span>Strong Password</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {factors.emailVerified ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span>Email Verified</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {factors.identityVerified ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span>Identity Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
