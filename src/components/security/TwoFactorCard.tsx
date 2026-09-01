import React, { useState, useEffect } from 'react'
import { Shield, Smartphone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TwoFactorCardProps {
  onStatusChange?: () => void
}

export const TwoFactorCard: React.FC<TwoFactorCardProps> = ({ onStatusChange }) => {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // Enrollment state
  const [enrollmentInProgress, setEnrollmentInProgress] = useState(false)
  const [qrCodeData, setQrCodeData] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [factorId, setFactorId] = useState('')

  useEffect(() => {
    checkMfaStatus()
  }, [])

  const checkMfaStatus = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (error) throw error
      
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) throw factorsError

      const totpFactor = factorsData.totp.find(f => f.status === 'verified')
      setEnabled(!!totpFactor)
      
    } catch (err: any) {
      console.error(err)
      setError('Failed to load 2FA status.')
    } finally {
      setLoading(false)
    }
  }

  const startEnrollment = async () => {
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      })
      if (error) throw error
      
      setFactorId(data.id)
      setQrCodeData(data.totp.qr_code)
      setEnrollmentInProgress(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to start 2FA enrollment.')
    } finally {
      setLoading(false)
    }
  }

  const verifyEnrollment = async () => {
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId
      })
      if (challengeError) throw challengeError

      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode
      })
      if (error) throw error

      setMessage('Two-Factor Authentication enabled successfully.')
      setEnrollmentInProgress(false)
      setVerifyCode('')
      await checkMfaStatus()
      if (onStatusChange) {
        onStatusChange()
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to verify code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const disableMfa = async () => {
    if (!confirm('Disabling two-factor authentication will reduce the security of your account. Continue?')) {
      return
    }

    setError('')
    setMessage('')
    setLoading(true)
    try {
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) throw factorsError

      const totpFactor = factorsData.totp.find(f => f.status === 'verified')
      if (totpFactor) {
        const { error } = await supabase.auth.mfa.unenroll({
          factorId: totpFactor.id
        })
        if (error) throw error
        setMessage('Two-Factor Authentication has been disabled.')
        await checkMfaStatus()
        if (onStatusChange) {
          onStatusChange()
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to disable 2FA.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of protection to your account.</p>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
      {message && <div className="mb-4 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">{message}</div>}

      <div className="space-y-4">
        {/* Auth App Status */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Authenticator App</p>
              <p className="text-xs text-muted-foreground">Status: {enabled ? 'Enabled ✓' : 'Disabled'}</p>
            </div>
          </div>
          
          <div className="flex shrink-0 items-center gap-2 w-full sm:w-auto">
            {!loading && !enabled && !enrollmentInProgress && (
              <button 
                onClick={startEnrollment}
                className="w-full sm:w-auto min-h-[44px] rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Enable 2FA
              </button>
            )}
            
            {!loading && enabled && (
              <button 
                onClick={disableMfa}
                className="w-full sm:w-auto min-h-[44px] rounded-xl border border-border bg-background px-6 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Disable 2FA
              </button>
            )}
          </div>
        </div>

        {/* Enrollment Flow - Mobile First */}
        {enrollmentInProgress && (
          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 sm:p-8">
            <h4 className="mb-6 text-center font-heading text-xl font-bold sm:text-left">Setup Authenticator</h4>
            
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
              
              {/* QR Code Section */}
              <div className="flex w-full flex-col items-center justify-center lg:w-auto">
                <div className="mb-4 text-center lg:hidden">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground">STEP 1</span>
                  <p className="mt-1 text-sm font-bold">Scan this QR code</p>
                </div>
                
                <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border/50 w-full max-w-[280px] aspect-square">
                  <div dangerouslySetInnerHTML={{ __html: qrCodeData }} className="h-full w-full [&>svg]:h-full [&>svg]:w-full" />
                </div>
              </div>
              
              {/* Instructions and Input Section */}
              <div className="flex w-full flex-1 flex-col space-y-8">
                
                {/* Desktop Step 1 (Hidden on mobile) */}
                <div className="hidden lg:block">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground">STEP 1</span>
                  <p className="mt-1 text-base font-bold text-foreground">Scan this QR code</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Use Google Authenticator, Microsoft Authenticator, or another compatible app.
                  </p>
                </div>

                {/* Mobile text for QR */}
                <div className="block text-center lg:hidden">
                  <p className="text-sm text-muted-foreground leading-relaxed px-4">
                    Use Google Authenticator, Microsoft Authenticator, or another compatible app.
                  </p>
                </div>
                
                <div className="h-px w-full bg-border/50 lg:hidden" />

                {/* Step 2 */}
                <div className="space-y-4">
                  <div className="text-center lg:text-left">
                    <span className="text-xs font-bold tracking-wider text-muted-foreground lg:block">STEP 2</span>
                    <p className="mt-1 text-base font-bold text-foreground">Enter verification code</p>
                    <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit code generated by your app.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      value={verifyCode}
                      onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="min-h-[52px] w-full rounded-xl border border-border bg-background px-4 text-center text-3xl tracking-[0.25em] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-48"
                      maxLength={6}
                      disabled={loading}
                    />
                    <button 
                      onClick={verifyEnrollment}
                      disabled={loading || verifyCode.length < 6}
                      className="min-h-[52px] w-full rounded-xl bg-primary px-8 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
                    >
                      {loading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-2 lg:justify-start">
                  <button 
                    onClick={() => setEnrollmentInProgress(false)}
                    className="min-h-[44px] px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline"
                  >
                    Cancel setup
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
