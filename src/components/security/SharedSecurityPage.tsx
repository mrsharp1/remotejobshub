import React, { useEffect, useState } from 'react'
import { SecurityScore } from './SecurityScore'
import { TwoFactorCard } from './TwoFactorCard'
import { PasswordSecurity } from './PasswordSecurity'
import { Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const SharedSecurityPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  const fetchSecurityState = async () => {
    try {
      setLoading(true)
      // 1. Get user for Email status
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      
      if (user) {
        setEmail(user.email || '')
        // Supabase sets email_confirmed_at when verified
        setEmailVerified(!!user.email_confirmed_at)
      }

      // 2. Get MFA status
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (!factorsError && factorsData?.totp) {
        const hasVerifiedTotp = factorsData.totp.some(f => f.status === 'verified')
        setTwoFactorEnabled(hasVerifiedTotp)
      }
    } catch (err) {
      console.error('Error fetching security state:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSecurityState()
  }, [])

  const handleResendVerification = async () => {
    if (!email) return
    setResending(true)
    setResendError('')
    setResendMessage('')
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })
      if (error) throw error
      setResendMessage('Verification email sent! Check your inbox.')
    } catch (err: any) {
      console.error(err)
      setResendError(err.message || 'Failed to send verification email.')
    } finally {
      setResending(false)
    }
  }

  const handleTwoFactorChange = () => {
    // Re-fetch state when 2FA changes
    fetchSecurityState()
  }

  // Calculate real score
  // Strong password = 30
  // Email verified = 30
  // 2FA enabled = 40
  const score = 30 + (emailVerified ? 30 : 0) + (twoFactorEnabled ? 40 : 0)

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          Security Center
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Protect your Remote Jobs Hub account and wallet.
        </p>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* SECURITY STATUS */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Security Status</h2>
          <SecurityScore 
            score={score}
            factors={{
              twoFactorEnabled,
              emailVerified
            }}
          />
        </section>

        {/* ACCOUNT SECURITY */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Account Security</h2>
          <div className="space-y-6">
            
            {/* EMAIL SECURITY */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold">Email Address</h3>
                    <p className="text-sm font-medium text-foreground">{email}</p>
                    <p className={`text-xs font-bold ${emailVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {emailVerified ? '✓ Verified' : '⚠ Not verified'}
                    </p>
                  </div>
                </div>
                
                {!emailVerified && (
                  <button 
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full sm:w-auto flex-shrink-0 min-h-[44px] rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend Verification'}
                  </button>
                )}
              </div>
              {resendMessage && <div className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">{resendMessage}</div>}
              {resendError && <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{resendError}</div>}
            </div>

            <PasswordSecurity />
            <TwoFactorCard onStatusChange={handleTwoFactorChange} />
          </div>
        </section>
      </div>
    </div>
  )
}
