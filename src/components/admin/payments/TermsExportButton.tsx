import React, { useState } from 'react'
import {
  Download,
  ShieldCheck,
  Loader2,
  FileSpreadsheet,
  FileCode,
  X,
  AlertCircle,
} from 'lucide-react'
import { orderService } from '@/services/marketplace/order.service'

export const TermsExportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recordsCount, setRecordsCount] = useState<number | null>(null)
  const [format, setFormat] = useState<'csv' | 'json'>('csv')

  const handleOpen = async () => {
    setIsOpen(true)
    setError(null)
    setIsLoading(true)
    try {
      const records = await orderService.getAdminTermsAcceptanceLedger({
        limit: 1000,
      })
      setRecordsCount(records.length)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to terms acceptance ledger. Admin privileges required.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const records = await orderService.getAdminTermsAcceptanceLedger({
        limit: 5000,
      })
      if (!records || records.length === 0) {
        setError('No acceptance records found in ledger to export.')
        setIsLoading(false)
        return
      }
      orderService.downloadAcceptanceLedger(records, format)
      setIsOpen(false)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Export failed. Access denied or query error.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 shadow-sm transition-all hover:bg-indigo-500/20 hover:text-white"
        title="Export full terms acceptance ledger for compliance and dispute audits"
      >
        <ShieldCheck className="h-4 w-4 text-indigo-400" />
        <span>Export Terms Ledger</span>
        <Download className="h-3.5 w-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => !isLoading && setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-50 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Terms Acceptance Export
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Server-authorized administrative evidence ledger
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="rounded-lg border border-white/5 bg-slate-950/50 p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 py-5 text-xs">
              {error ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-rose-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-[11px] leading-relaxed">{error}</p>
                </div>
              ) : (
                <div className="space-y-2 rounded-xl border border-white/5 bg-slate-950/60 p-3.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">
                      Available Audit Records:
                    </span>
                    <span className="font-mono font-bold text-white">
                      {isLoading && recordsCount === null ? (
                        <Loader2 className="inline h-3.5 w-3.5 animate-spin text-indigo-400" />
                      ) : (
                        `${recordsCount ?? 0} entries`
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Exports acceptance references, order references, buyer
                    account IDs, version IDs, cryptographic SHA-256 document
                    hashes, server timestamps, and client user-agents.
                  </p>
                </div>
              )}

              {/* Format Selection */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase text-slate-400">
                  Export File Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('csv')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                      format === 'csv'
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                        : 'border-white/5 bg-slate-950 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    CSV Spreadsheet
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('json')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                      format === 'json'
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                        : 'border-white/5 bg-slate-950 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <FileCode className="h-4 w-4 text-indigo-400" />
                    JSON Forensic Data
                  </button>
                </div>
              </div>

              {/* Audit Safeguard Note */}
              <div className="space-y-1 rounded-lg bg-slate-950/40 p-3 text-[10px] text-slate-500">
                <p className="font-semibold text-slate-400">
                  Security & Privacy Protection:
                </p>
                <p>
                  Only administrators with verified server roles may export this
                  ledger. Records in the underlying database table are immutable
                  and cannot be altered or deleted.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="rounded-xl border border-white/5 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    Download {format.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
