import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal,
  ShieldAlert,
  Database,
  Info,
  X,
  Bug,
  Sparkles,
  Zap,
  CheckCircle,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const DeveloperConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'workspace' | 'simulators' | 'device' | 'debug'>('workspace')
  const [selectedWidth, setSelectedWidth] = useState<number>(390)
  const [iframeUrl, setIframeUrl] = useState(window.location.origin)
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'error'>('checking')

  const { profile, user, sandboxSession, setSandboxSession } = useAuthStore()
  const navigate = useNavigate()

  // Keybind toggles console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Check database connection on open
  useEffect(() => {
    if (isOpen) {
      const checkDb = async () => {
        setDbStatus('checking')
        try {
          const { error } = await supabase
            .from('profiles')
            .select('count', { count: 'exact', head: true })
          if (error) {
            setDbStatus('error')
          } else {
            setDbStatus('online')
          }
        } catch {
          setDbStatus('error')
        }
      }
      checkDb()
    }
  }, [isOpen])

  // Sync iframe destination
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen) {
        setIframeUrl(window.location.href)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!import.meta.env.DEV) return null

  // Role switching
  const switchRole = (newRole: 'buyer' | 'seller' | 'admin') => {
    setSandboxSession({
      enabled: true,
      role: newRole,
      kycStatus: newRole === 'seller' ? 'not_started' : 'approved',
    })
    toast.success(`Switched role permission to ${newRole.toUpperCase()} instantly.`)
    if (newRole === 'buyer') {
      navigate('/dashboard')
    } else if (newRole === 'seller') {
      navigate('/seller')
    } else if (newRole === 'admin') {
      navigate('/admin')
    }
  }

  // Seller Unlock
  const unlockSeller = () => {
    setSandboxSession({
      enabled: true,
      role: 'seller',
      kycStatus: 'approved',
    })
    toast.success('KYC Approved. Seller workspace unlocked instantly.')
    navigate('/seller')
  }

  // Admin Unlock
  const unlockAdmin = () => {
    setSandboxSession({
      enabled: true,
      role: 'admin',
      kycStatus: 'approved',
    })
    toast.success('Admin clearance permissions granted.')
    navigate('/admin')
  }

  const setKycStatus = (status: any) => {
    setSandboxSession({
      ...sandboxSession,
      kycStatus: status,
    })
    toast.success(`Simulated KYC Status updated to ${status.toUpperCase()} instantly.`)
  }

  // Payment simulator
  const simulatePayment = async (status: 'completed' | 'failed' | 'pending') => {
    if (!user?.id) return
    toast.info(`Simulating payment trigger: ${status.toUpperCase()}...`)
    
    // Create simulated wallet txn or trigger alert
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: `Payment ${status.toUpperCase()}`,
      message: status === 'completed'
        ? 'Your deposit of ₦2,500 has cleared successfully.'
        : 'Your deposit was declined by processing gateway.',
      type: 'payment',
      is_read: false,
    })
    toast.success('Simulated payment events successfully routed.')
  }

  // Escrow simulator
  const simulateEscrow = async (stage: 'escrow_funded' | 'delivered' | 'completed' | 'cancelled') => {
    if (!user?.id) return
    toast.info(`Simulating Escrow state transition: ${stage.toUpperCase()}...`)

    // Get a recent order ID to update or create notifications
    const { data: orders } = await supabase
      .from('orders')
      .select('id')
      .limit(1)

    if (orders && orders.length > 0) {
      await supabase
        .from('orders')
        .update({ status: stage })
        .eq('id', orders[0].id)
      
      toast.success(`Escrow contract status updated to ${stage.toUpperCase()}`)
    } else {
      toast.error('No active order contracts found to mock stages on.')
    }
  }

  // Notification simulator
  const generateNotification = async (type: string) => {
    if (!user?.id) return
    let title = 'System Update'
    let msg = 'General system alert triggered.'
    if (type === 'message') {
      title = 'New message from @chimobi'
      msg = '"Is the Fiverr Level 2 account recovery mail verified?"'
    } else if (type === 'order') {
      title = 'New Order Funded'
      msg = 'Buyer @operator has funded escrow contract #ORD-9801'
    } else if (type === 'kyc') {
      title = 'KYC Verification Approved'
      msg = 'Congratulations. Your identity checklist has been verified.'
    }

    await supabase.from('notifications').insert({
      user_id: user.id,
      title,
      message: msg,
      type: 'system',
      is_read: false,
    })
    toast.success('Notification alert dispatched.')
  }

  // Seeding mock data
  const generateDemoData = async () => {
    if (!user?.id) return
    toast.info('Generating mock development listings...')
    try {
      // Create a mock listing
      await supabase.from('listings').insert({
        seller_id: user.id,
        title: 'Level 2 Fiverr Profile with 4.9 rating',
        platform: 'fiverr',
        country: 'NG',
        description: 'Verified seller listing generated from debug console.',
        price: 2450.00,
        status: 'published',
      })
      toast.success('Demo data seeded successfully.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to seed listings.')
    }
  }

  return (
    <>
      {/* Hidden floating toggle bug icon */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/60 text-slate-400 opacity-30 hover:opacity-100 hover:text-white backdrop-blur-md transition-all hover:scale-105 border border-white/10"
        title="Open Developer Console (Ctrl+Shift+D)"
      >
        <Bug className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 450 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 450 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-[450px] border-l border-white/10 bg-slate-950/90 text-white shadow-2xl backdrop-blur-xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-indigo-400" />
                <h2 className="font-heading text-lg font-bold">Dev Sandbox</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-slate-900/40 text-xs font-bold text-slate-400">
              <button
                onClick={() => setActiveTab('workspace')}
                className={`flex-1 py-3 text-center transition-all ${
                  activeTab === 'workspace' ? 'border-b-2 border-indigo-500 text-white bg-white/5' : ''
                }`}
              >
                Workspace
              </button>
              <button
                onClick={() => setActiveTab('simulators')}
                className={`flex-1 py-3 text-center transition-all ${
                  activeTab === 'simulators' ? 'border-b-2 border-indigo-500 text-white bg-white/5' : ''
                }`}
              >
                Simulators
              </button>
              <button
                onClick={() => setActiveTab('device')}
                className={`flex-1 py-3 text-center transition-all ${
                  activeTab === 'device' ? 'border-b-2 border-indigo-500 text-white bg-white/5' : ''
                }`}
              >
                Responsive
              </button>
              <button
                onClick={() => setActiveTab('debug')}
                className={`flex-1 py-3 text-center transition-all ${
                  activeTab === 'debug' ? 'border-b-2 border-indigo-500 text-white bg-white/5' : ''
                }`}
              >
                Diagnostics
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'workspace' && (
                <div className="space-y-6">
                  {/* Current Active User Info */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Environment</span>
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 uppercase">
                        development
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Logged Profile</span>
                      <span className="font-bold text-sm block truncate">
                        {profile?.full_name || 'No full name initialized'}
                      </span>
                    </div>
                  </div>

                  {/* Active Permission Role switcher */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Dynamic Role Switcher
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['buyer', 'seller', 'admin'].map((r) => {
                        const isCurrent = sandboxSession.enabled
                          ? sandboxSession.role === r
                          : profile?.role === r
                        return (
                          <button
                            key={r}
                            onClick={() => switchRole(r as any)}
                            className={`rounded-xl py-3 text-xs font-bold transition-all border ${
                              isCurrent
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                                : 'bg-slate-900 border-white/5 hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            {r.toUpperCase()}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* KYC Simulation (only show if active role is seller) */}
                  {(sandboxSession.enabled ? sandboxSession.role === 'seller' : profile?.role === 'seller') && (
                    <div className="space-y-3 pt-4 border-t border-white/5 animate-in fade-in duration-200">
                      <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                        Seller KYC Status Simulator
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'not_started', label: 'Not Started' },
                          { key: 'pending', label: 'Pending Review' },
                          { key: 'under_review', label: 'In Progress' },
                          { key: 'approved', label: 'Approved' },
                          { key: 'rejected', label: 'Rejected' },
                          { key: 'requires_more_info', label: 'Requires Info' },
                        ].map((item) => {
                          const isCurrent = sandboxSession.kycStatus === item.key
                          return (
                            <button
                              key={item.key}
                              onClick={() => setKycStatus(item.key as any)}
                              className={`rounded-xl py-2 text-[10px] font-bold transition-all border ${
                                isCurrent
                                  ? 'bg-indigo-650 border-indigo-600 text-white shadow-md'
                                  : 'bg-slate-900 border-white/5 hover:bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Instant Unlock features */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Instant Access Builders
                    </label>
                    <div className="grid gap-3">
                      <button
                        onClick={unlockSeller}
                        className="flex w-full items-center justify-between rounded-xl bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 py-4 px-5 text-left text-xs font-bold text-emerald-400 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4.5 w-4.5" /> Approved KYC Seller Unlock
                        </span>
                        <Zap className="h-4 w-4" />
                      </button>

                      <button
                        onClick={unlockAdmin}
                        className="flex w-full items-center justify-between rounded-xl bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/20 py-4 px-5 text-left text-xs font-bold text-rose-400 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="h-4.5 w-4.5" /> Full Admin Control Bypass
                        </span>
                        <Zap className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'simulators' && (
                <div className="space-y-6">
                  {/* Database Seeder */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Demo Data Seeder
                    </label>
                    <button
                      onClick={generateDemoData}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 py-3 text-xs font-bold transition-all text-white"
                    >
                      <Database className="h-4 w-4 text-indigo-400" /> Seeding Mock Assets
                    </button>
                  </div>

                  {/* Payment simulation triggers */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Payment Simulator
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => simulatePayment('completed')}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-600/10 py-2.5 text-center text-xs font-bold text-emerald-400 hover:bg-emerald-600/20"
                      >
                        Success
                      </button>
                      <button
                        onClick={() => simulatePayment('failed')}
                        className="rounded-xl border border-rose-500/20 bg-rose-600/10 py-2.5 text-center text-xs font-bold text-rose-400 hover:bg-rose-600/20"
                      >
                        Failed
                      </button>
                      <button
                        onClick={() => simulatePayment('pending')}
                        className="rounded-xl border border-amber-500/20 bg-amber-600/10 py-2.5 text-center text-xs font-bold text-amber-400 hover:bg-amber-600/20"
                      >
                        Pending
                      </button>
                    </div>
                  </div>

                  {/* Escrow contract simulations */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Escrow Vault Stage Transitions
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => simulateEscrow('escrow_funded')}
                        className="rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-slate-200"
                      >
                        1. Funded Vault
                      </button>
                      <button
                        onClick={() => simulateEscrow('delivered')}
                        className="rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-slate-200"
                      >
                        2. Credentials Delivered
                      </button>
                      <button
                        onClick={() => simulateEscrow('completed')}
                        className="rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-slate-200"
                      >
                        3. Payout Release
                      </button>
                      <button
                        onClick={() => simulateEscrow('cancelled')}
                        className="rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-slate-200"
                      >
                        4. Refund Cancelled
                      </button>
                    </div>
                  </div>

                  {/* Alerts dispatch triggers */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Immediate Notification Dispatcher
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => generateNotification('message')}
                        className="rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-300"
                      >
                        Chat Msg
                      </button>
                      <button
                        onClick={() => generateNotification('order')}
                        className="rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-300"
                      >
                        Contract Funded
                      </button>
                      <button
                        onClick={() => generateNotification('kyc')}
                        className="rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-300"
                      >
                        KYC OK
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'device' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Device Resolution Preview
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[320, 360, 390, 430, 768, 1024].map((width) => (
                        <button
                          key={width}
                          onClick={() => setSelectedWidth(width)}
                          className={`rounded-xl py-2.5 text-xs font-bold transition-all border ${
                            selectedWidth === width
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-900 border-white/5 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          {width}px
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <div
                      className="border border-white/20 bg-slate-950 overflow-hidden rounded-xl transition-all duration-300"
                      style={{ width: `${selectedWidth}px`, height: '400px' }}
                    >
                      <iframe
                        src={iframeUrl}
                        title="Viewport preview"
                        className="w-full h-full border-0 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'debug' && (
                <div className="space-y-6">
                  <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                    Infrastructure Health Checks
                  </label>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Database connection (Supabase)</span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          dbStatus === 'online' ? 'text-emerald-400' : dbStatus === 'checking' ? 'text-slate-400' : 'text-rose-400'
                        }`}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {dbStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Active user session id</span>
                      <span className="font-mono text-slate-300 truncate max-w-[200px]" title={user?.id}>
                        {user?.id || 'NO ACTIVE SESSION'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Storage Service Bucket</span>
                      <span className="font-bold text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Escrow Gateway Engine</span>
                      <span className="font-bold text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Active Browser Route</span>
                      <span className="font-bold text-indigo-400">{window.location.pathname}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 bg-slate-900/20 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Remote Jobs Hub Sandbox v1.0.0</span>
              <span className="flex items-center gap-1 text-indigo-400">
                <Info className="h-3.5 w-3.5" /> Dev Mode Enabled
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
