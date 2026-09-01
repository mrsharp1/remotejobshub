import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Save, Lock, Key, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export const AdminPaymentGatewayPage: React.FC = () => {
  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [maskedSecret, setMaskedSecret] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const fetchConfiguration = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack-config`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch configuration')
      }

      const data = await response.json()
      
      if (data.is_configured) {
        setIsConfigured(true)
        setPublicKey(data.live_public_key)
        setMaskedSecret(data.masked_secret_key)
        setLastUpdated(data.updated_at)
      } else {
        setIsConfigured(false)
      }
    } catch (err) {
      console.error('Failed to load configuration:', err)
      toast.error('Failed to load payment gateway configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const pk = publicKey.trim()
    const sk = secretKey.trim()

    if (!pk || !sk) {
      setError('Both Public Key and Secret Key are required to save.')
      return
    }

    if (!pk.startsWith('pk_live_')) {
      setError('Invalid Public Key format. Must begin with pk_live_')
      return
    }

    if (!sk.startsWith('sk_live_')) {
      setError('Invalid Secret Key format. Must begin with sk_live_')
      return
    }

    try {
      setIsSaving(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack-config`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            live_public_key: pk,
            live_secret_key: sk,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update credentials')
      }

      toast.success(result.message || 'Paystack connection verified and credentials saved.')
      setSecretKey('') // Clear plain text input
      await fetchConfiguration() // Refresh masked data
    } catch (err: any) {
      console.error('Failed to save configuration:', err)
      setError(err.message || 'An error occurred while saving the configuration.')
      toast.error('Paystack connection failed. Please check your LIVE credentials.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Payment Gateway
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your live Paystack credentials for platform payments and wallet deposits.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="border-b border-border bg-muted/30 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Paystack Configuration
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {isConfigured ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active Connection
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Not Configured
                  </span>
                )}
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground">
                    Last updated: {new Date(lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-bold mb-1">Security Notice</p>
                <p>These credentials are encrypted and stored securely on the server. The complete secret key will never be exposed to the browser. Changes require an active connection verification before saving.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                LIVE Public Key
              </label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="pk_live_..."
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                The public key used by the frontend client to initialize Paystack popups.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                LIVE Secret Key
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder={isConfigured ? maskedSecret : "sk_live_..."}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to keep existing configuration. Entering a new key will verify and replace the current configuration.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <div className="pt-4 flex justify-end border-t border-border">
              <button
                type="submit"
                disabled={isSaving || !publicKey || !secretKey}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
