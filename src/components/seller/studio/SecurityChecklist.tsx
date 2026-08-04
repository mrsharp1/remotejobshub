import React from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

interface SecurityChecklistProps {
  kycApproved: boolean
  credentialsVaulted: boolean
  documentsUploaded: boolean
  priceSet: boolean
}

export const SecurityChecklist: React.FC<SecurityChecklistProps> = ({
  kycApproved,
  credentialsVaulted,
  documentsUploaded,
  priceSet,
}) => {
  const checks = [
    { label: 'KYC Verification Approved', desc: 'Active verification clearances found on record', ok: kycApproved },
    { label: 'Credentials Vaulted & Encrypted', desc: 'Secure passwords and 2FA backup codes locked', ok: credentialsVaulted },
    { label: 'Media Documents Uploaded', desc: 'Revenue & dashboard screenshots verified', ok: documentsUploaded },
    { label: 'Sale Price Declared', desc: 'Listing price is active and above zero value', ok: priceSet },
    { label: 'AES-256 Vault Encryption', desc: 'Simulated client-side crypt key signatures locked', ok: credentialsVaulted },
    { label: 'Escrow Multi-Sig Handshake', desc: 'Deposit release workflows pre-configured', ok: priceSet },
  ]

  const passedCount = checks.filter((c) => c.ok).length
  const pct = Math.round((passedCount / checks.length) * 100)

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-purple-600 animate-pulse" />
            <h4 className="font-heading text-base font-bold text-white">Security Checklist Audit</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Vetting listing parameters against trust guidelines</p>
        </div>
        <span className="text-xs font-mono font-bold text-purple-400">{pct}% passed</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-550 to-indigo-650 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {checks.map((c, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${
              c.ok
                ? 'border-emerald-500/20 bg-emerald-500/[0.02]'
                : 'border-white/5 bg-slate-950/40 opacity-70'
            }`}
          >
            {c.ok ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-450 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
            )}
            <div>
              <span className={`block text-xs font-bold leading-tight ${c.ok ? 'text-white' : 'text-slate-500'}`}>
                {c.label}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5 leading-relaxed">{c.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
