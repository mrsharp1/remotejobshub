import React, { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Settings, User, Bell, Shield, Loader2 } from 'lucide-react'
import { DeviceNotificationControl } from '@/features/notifications/components/DeviceNotificationControl'

export const SellerSettingsPage: React.FC = () => {
  const { profile, setProfile, sandboxSession, setSandboxSession } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'sandbox'>('profile')
  
  // Profile settings form state
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [country, setCountry] = useState(profile?.country || '')
  const [bio, setBio] = useState(profile?.bio || '')
  
  // Sandbox states
  const [sandboxEnabled, setSandboxEnabled] = useState(sandboxSession.enabled)
  const [sandboxRole, setSandboxRole] = useState(sandboxSession.role || 'seller')
  const [sandboxKyc, setSandboxKyc] = useState(sandboxSession.kycStatus || 'approved')
  
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.id) return
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          country,
          bio,
        })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      toast.success('Merchant profile settings updated successfully!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to save merchant settings.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSandbox = (e: React.FormEvent) => {
    e.preventDefault()
    setSandboxSession({
      enabled: sandboxEnabled,
      role: sandboxRole as any,
      kycStatus: sandboxKyc as any,
    })
    toast.success('Sandbox developer environment configurations updated!')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 px-4 sm:px-6">
      {/* Title Header */}
      <div className="border-b border-border pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          Merchant Cockpit & Preferences
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          Seller Settings
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage your seller profile attributes, notification channels, and active test environments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-1 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'profile', label: 'Merchant Profile', icon: User },
          { id: 'notifications', label: 'Notification Settings', icon: Bell },
          { id: 'sandbox', label: 'Developer Sandbox', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="premium-card space-y-6">
            <h3 className="font-heading text-base font-bold text-foreground">Merchant Metadata Details</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white dark:bg-slate-950 p-3.5 text-xs text-foreground placeholder-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g. Acme Studio"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Operating Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white dark:bg-slate-950 p-3.5 text-xs text-foreground placeholder-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g. Nigeria"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Merchant Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border bg-white dark:bg-slate-950 p-3.5 text-xs text-foreground placeholder-muted-foreground/60 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Write a brief background about your portfolio and account delivery terms..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white transition-all shadow-md hover:bg-primary/95 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save Settings Changes'
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <div className="premium-card space-y-4">
              <h3 className="font-heading text-lg font-bold text-foreground">Push Notifications</h3>
              <DeviceNotificationControl userId={profile?.id} />
            </div>

            <div className="premium-card space-y-6">
              <h3 className="font-heading text-lg font-bold text-foreground">Email & In-App Channels</h3>
              
              <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/10 p-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Email Transaction Alerts</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Receive immediate Paystack vault payment success events.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/10 p-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Escrow State Heartbeats</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Receive reminders when a buyer starts inspecting vault credentials.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/10 p-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">AI Seller Coach Push</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Allow AI suggestions updates on pricing optimization sweeps.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 accent-primary" />
              </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <form onSubmit={handleSaveSandbox} className="premium-card space-y-6">
            <h3 className="font-heading text-base font-bold text-foreground">Developer Sandbox Simulation</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use the developer sandbox tools to simulate alternative authenticated user scenarios (e.g. testing admin pages or restricted buyer paths).
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/10 p-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Enable Sandbox State</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Toggles sandbox rules override across the front-end router.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={sandboxEnabled} 
                  onChange={(e) => setSandboxEnabled(e.target.checked)} 
                  className="h-4 w-4 accent-primary" 
                />
              </div>

              {sandboxEnabled && (
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">Override Role</label>
                    <select
                      value={sandboxRole}
                      onChange={(e) => setSandboxRole(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-white dark:bg-slate-950 p-3 text-xs text-foreground focus:outline-none"
                    >
                      <option value="buyer">Buyer / Client</option>
                      <option value="seller">Seller / Merchant</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">Override KYC Status</label>
                    <select
                      value={sandboxKyc}
                      onChange={(e) => setSandboxKyc(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-white dark:bg-slate-950 p-3 text-xs text-foreground focus:outline-none"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="pending">Pending Audit</option>
                      <option value="under_review">Under Active Review</option>
                      <option value="approved">Approved / Verified</option>
                      <option value="rejected">Rejected / Failed</option>
                      <option value="requires_more_info">Requires More Info</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-md"
              >
                Apply Sandbox Simulator Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
