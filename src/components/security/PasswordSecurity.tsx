import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const PasswordSecurity: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })
      
      if (updateError) throw updateError
      
      setMessage('Password updated successfully.')
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
          <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">Password Security</h3>
          <p className="text-sm text-muted-foreground">Managed securely through your account authentication.</p>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
        {message && <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">{message}</div>}
        
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="min-h-[48px] w-full rounded-xl border border-border bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Enter new password"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="min-h-[48px] w-full rounded-xl border border-border bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Confirm new password"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="min-h-[48px] w-full sm:w-auto rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
