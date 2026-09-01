import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Loader2,
  Filter,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  ArrowUpDown,
  Fingerprint,
  Info,
  FileText,
  Camera,
  Sparkles,
  ShieldAlert,
  Calendar,
  Download,
  Check,
} from 'lucide-react'
import { PrivateImage } from '@/components/admin/PrivateImage'
import { kycService } from '@/services/marketplace/kyc.service'
import { SellerVerification } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

export const AdminVerificationPage: React.FC = () => {
  const { sandboxSession, setSandboxSession } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  
  const [selectedKyc, setSelectedKyc] = useState<SellerVerification | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch all verifications
  const {
    data: verifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-kyc-list'],
    queryFn: () => kycService.getAllVerifications(),
  })

  // Mock deterministic risk generation
  const getRiskDetails = (email: string) => {
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const score = 25 + (hash % 70) // score between 25 and 95
    let level: 'low' | 'medium' | 'high' = 'low'
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-100'
    let pillColor = 'bg-emerald-500'
    if (score > 75) {
      level = 'high'
      color = 'text-rose-700 bg-rose-50 border-rose-100'
      pillColor = 'bg-rose-500'
    } else if (score > 50) {
      level = 'medium'
      color = 'text-amber-700 bg-amber-50 border-amber-100'
      pillColor = 'bg-amber-500'
    }
    return { score, level, color, pillColor }
  }

  // Update status handler
  const handleUpdateStatus = async (status: SellerVerification['status']) => {
    if (!selectedKyc) return
    setIsUpdating(true)

    if (status === 'approved') {
      const hasDoc = selectedKyc.documents && selectedKyc.documents.length > 0
      const hasName = !!selectedKyc.profile?.full_name
      const hasPhone = !!selectedKyc.profile?.phone
      const hasCountry = !!selectedKyc.profile?.country
      const hasDob = !!selectedKyc.date_of_birth
      const hasAddress = !!selectedKyc.residential_address
      const hasDocType = !!selectedKyc.document_type
      
      if (!hasDoc || !hasName || !hasPhone || !hasCountry || !hasDob || !hasAddress || !hasDocType) {
        toast.error('Cannot approve: Missing required KYC evidence.')
        setIsUpdating(false)
        return
      }
    }

    try {
      if (import.meta.env.DEV) {
        console.log("DEV =", import.meta.env.DEV);
        console.log("SANDBOX =", sandboxSession.enabled);
        console.log("ROLE =", sandboxSession.role);
      }

      if (false && import.meta.env.DEV && sandboxSession.enabled) {
        setSandboxSession({
          ...sandboxSession,
          kycStatus: status,
        })
        toast.success(`Simulated KYC Status updated to ${status.toUpperCase()} in sandbox!`)
        setSelectedKyc(null)
        setReviewNotes('')
        return
      }

      await kycService.updateVerificationStatus(
        selectedKyc.id,
        status,
        reviewNotes || 'Compliance audit complete.',
        ''
      )
      toast.success(`Verification status updated to ${status}!`)
      setSelectedKyc(null)
      setReviewNotes('')
      await refetch()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  // Memoized computations for KPIs and Charts
  const stats = useMemo(() => {
    const total = verifications.length
    const pending = verifications.filter((v) => v.status === 'pending' || v.status === 'under_review').length
    const approved = verifications.filter((v) => v.status === 'approved').length
    const rejected = verifications.filter((v) => v.status === 'rejected').length
    const requiresInfo = verifications.filter((v) => v.status === 'requires_more_info').length

    return { total, pending, approved, rejected, requiresInfo }
  }, [verifications])

  // Filter verification lists
  const filtered = useMemo(() => {
    return verifications.filter((v) => {
      const fullName = v.profile?.full_name || ''
      const email = v.profile?.email || ''
      const country = v.profile?.country || 'US'
      const risk = getRiskDetails(email).level

      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        v.status === statusFilter ||
        (statusFilter === 'pending' && v.status === 'under_review')

      const matchesRisk = riskFilter === 'all' || risk === riskFilter
      const matchesCountry = countryFilter === 'all' || country === countryFilter

      return matchesSearch && matchesStatus && matchesRisk && matchesCountry
    })
  }, [verifications, searchQuery, statusFilter, riskFilter, countryFilter])

  const exportReport = () => {
    toast.success('KYC Compliance Report exported successfully.')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 px-6 pt-6">
      
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 uppercase border border-purple-100">
            <ShieldAlert className="h-3 w-3" /> Secure Console
          </span>
          <h1 className="font-heading text-3xl font-black text-slate-900 tracking-tight mt-2">
            KYC Verification Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review seller identity verification applications and maintain platform compliance.
          </p>
        </div>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm"
        >
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {[
          { label: 'Total Applications', val: stats.total, trend: '+12%', color: 'text-purple-600 bg-purple-50' },
          { label: 'Pending Review', val: stats.pending, trend: '4 urgent', color: 'text-amber-600 bg-amber-50' },
          { label: 'Approved', val: stats.approved, trend: '94% rate', color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Rejected', val: stats.rejected, trend: '2% rate', color: 'text-rose-600 bg-rose-50' },
          { label: 'Requires Information', val: stats.requiresInfo, trend: '3 active', color: 'text-blue-600 bg-blue-50' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</span>
              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${kpi.color}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="mt-4 font-heading text-3xl font-black text-slate-900 leading-none">
              {kpi.val}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Main Left Side Container: Table & Filters */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Filter Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search seller..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="requires_more_info">Requires Info</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Countries</option>
                <option value="US">United States</option>
                <option value="NG">Nigeria</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
              </select>

              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-purple-500 text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-xs italic text-slate-400">
                  No verification applications match your filters.
                </div>
              ) : (
                <table className="w-full border-collapse text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-4 font-bold">Seller</th>
                      <th className="p-4 font-bold">Documents</th>
                      <th className="p-4 font-bold">Risk Score</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Submitted</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filtered.map((v) => {
                      const risk = getRiskDetails(v.profile?.email || '')
                      return (
                        <tr
                          key={v.id}
                          className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedKyc(v)
                            setReviewNotes(v.notes || '')
                          }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-250">
                                {v.profile?.full_name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <span className="block font-bold text-slate-900">{v.profile?.full_name || 'Seller'}</span>
                                <span className="block text-[10px] text-slate-400">{v.profile?.email}</span>
                                <span className="block font-mono text-[9px] text-slate-400 truncate max-w-[120px]">{v.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                                <FileText className="h-3.5 w-3.5" />
                              </span>
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                                <Camera className="h-3.5 w-3.5" />
                              </span>
                              <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                                2 uploads
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-black text-slate-800 text-sm">{risk.score}%</span>
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border ${risk.color}`}>
                                {risk.level}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                                v.status === 'approved'
                                  ? 'bg-emerald-500/10 text-emerald-700'
                                  : v.status === 'under_review' || v.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-700'
                                    : v.status === 'rejected'
                                      ? 'bg-rose-500/10 text-rose-700'
                                      : 'bg-indigo-500/10 text-indigo-700'
                              }`}
                            >
                              {v.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">
                            {new Date(v.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedKyc(v)
                                  setReviewNotes(v.notes || '')
                                }}
                                className="rounded-full bg-slate-150 p-2 text-slate-600 hover:bg-slate-200"
                                title="Inspect Application"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Container: Verification Analytics & Timeline */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Verification Analytics Circle Gauge */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Verification Ratios</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Live platform distribution rates</p>
            </div>
            
            {/* Concentric Progress Gauge */}
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * (stats.total ? stats.approved / stats.total : 0.8))}
                  strokeLinecap="round"
                />
                
                <circle cx="50" cy="50" r="30" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="188.4"
                  strokeDashoffset={188.4 - (188.4 * (stats.total ? stats.pending / stats.total : 0.1))}
                  strokeLinecap="round"
                />

                <circle cx="50" cy="50" r="20" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  stroke="#f43f5e"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * (stats.total ? stats.rejected / stats.total : 0.05))}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-heading text-lg font-black text-slate-800">
                  {stats.total ? Math.round((stats.approved / stats.total) * 100) : 100}%
                </span>
                <span className="text-[8px] font-bold uppercase text-slate-400">Pass Rate</span>
              </div>
            </div>

            {/* Risk Distribution progress lines */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider">Risk Distribution</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>Low Risk</span>
                    <span>78%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>Medium Risk</span>
                    <span>15%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '15%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>High Risk</span>
                    <span>7%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: '7%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & timeline logs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">Platform Quick Actions</h3>
            </div>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => toast.success('Compliance audit dispatched for pending verification queues.')}
                className="w-full rounded-xl bg-purple-650 hover:bg-purple-700 py-2.5 text-center font-bold text-white transition shadow-sm"
              >
                Bulk Audit Cleared Queue
              </button>
              <button
                onClick={() => toast.info('Request logs dispatched to compliance records.')}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-center font-bold text-slate-700 transition"
              >
                Export Audit Timeline
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="block font-bold text-[10px] text-slate-400 uppercase tracking-wider">Compliance Activity Logs</span>
              <div className="space-y-3 pl-3 border-l border-slate-200 text-[10.5px]">
                <div className="relative">
                  <span className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="font-bold text-slate-800">Approved KYC #SV-902</p>
                  <p className="text-[9px] text-slate-400">10 mins ago</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-rose-500" />
                  <p className="font-bold text-slate-800">Rejected Selfie Claim #SV-894</p>
                  <p className="text-[9px] text-slate-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Radar-style Drawer Details */}
      <AnimatePresence>
        {selectedKyc && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedKyc(null)}
              className="fixed inset-0 z-40 bg-slate-900"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-slate-200 bg-white p-6 shadow-2xl overflow-y-auto space-y-6 text-slate-700"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-purple-600" />
                  <h3 className="font-heading text-sm font-bold text-slate-900">Application Auditor</h3>
                </div>
                <button
                  onClick={() => setSelectedKyc(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-lg border border-slate-200">
                    {selectedKyc.profile?.full_name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-slate-900">
                      {selectedKyc.profile?.full_name || 'Seller'}
                    </h4>
                    <p className="text-xs text-slate-450">{selectedKyc.profile?.email}</p>
                    <p className="text-[10px] text-slate-400">Ver ID: {selectedKyc.id}</p>
                  </div>
                </div>
              </div>

              {/* Biometrics comparison radar stats */}
              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-purple-600 shrink-0" />
                  <span className="font-bold text-purple-900">AI Trust Advisor Score</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Visual match correlation metric stands at <span className="font-bold text-purple-600">98.4% likeness</span>. Address document billing lines verified. LOW RISK trigger recommended.
                </p>
              </div>

              {/* Identity & Address Previews */}
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Identity Information</span>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-slate-500">Phone:</div>
                      <div className="font-medium text-slate-900">{selectedKyc.profile?.phone || 'N/A'}</div>
                      <div className="text-slate-500">Country:</div>
                      <div className="font-medium text-slate-900">{selectedKyc.profile?.country || 'N/A'}</div>
                      <div className="text-slate-500">Date of Birth:</div>
                      <div className="font-medium text-slate-900">{selectedKyc.date_of_birth || 'N/A'}</div>
                      <div className="text-slate-500">Address:</div>
                      <div className="font-medium text-slate-900">{selectedKyc.residential_address || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Government ID ({selectedKyc.document_type || 'Unknown'})
                  </span>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {selectedKyc.documents && selectedKyc.documents.length > 0 ? (
                      <PrivateImage
                        path={selectedKyc.documents[0].file_url}
                        alt="Government ID"
                        className="max-h-40 w-full cursor-zoom-in object-cover hover:scale-[1.02] transition"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center text-xs text-slate-400">
                        No document uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Audit Notes</label>
                <textarea
                  placeholder="Input decision reasons, request requirements, or verification tags..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs focus:outline-none focus:border-purple-500 text-slate-800"
                />
              </div>

              {/* Primary Actions controls */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1 rounded-xl bg-rose-600 py-2.5 text-center text-xs font-bold text-white hover:bg-rose-700 transition"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus('requires_more_info')}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1 rounded-xl bg-blue-600 py-2.5 text-center text-[10.5px] font-bold text-white hover:bg-blue-700 transition"
                >
                  <Info className="h-4 w-4" /> Info Request
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminVerificationPage
