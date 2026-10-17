import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, ExternalLink, ShieldCheck, Hash } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  TERMS_VERSION,
  TERMS_LAST_UPDATED,
  TERMS_STATUS,
  TERMS_PREAMBLE,
  TERMS_DOCUMENT_HASH,
  TERMS_SECTIONS,
} from '@/constants/terms'

interface TermsAcceptanceProps {
  termsAccepted: boolean
  setTermsAccepted: (val: boolean) => void
  escrowAccepted: boolean
  setEscrowAccepted: (val: boolean) => void
  verificationAccepted: boolean
  setVerificationAccepted: (val: boolean) => void
}

export const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({
  termsAccepted,
  setTermsAccepted,
  escrowAccepted,
  setEscrowAccepted,
  verificationAccepted,
  setVerificationAccepted,
}) => {
  const [showFullTerms, setShowFullTerms] = useState(false)

  return (
    <div className="space-y-4 rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      {/* Header with Title and Version Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          <h3 className="font-heading text-lg font-bold text-white">Terms of Transaction</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            Version {TERMS_VERSION} ({TERMS_LAST_UPDATED})
          </span>
          {TERMS_STATUS === 'draft' && (
            <span className="font-mono text-[10px] font-bold uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Draft
            </span>
          )}
        </div>
      </div>
      
      {/* Checkboxes */}
      <div className="space-y-4 pt-1">
        {/* 1. Escrow Vault protection acknowledgment */}
        <label className="flex cursor-pointer items-start gap-3 select-none group">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="premium-input h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors"
              checked={escrowAccepted}
              onChange={(e) => setEscrowAccepted(e.target.checked)}
            />
          </div>
          <span className="text-sm leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors">
            I understand that my payment is held in escrow by Remote Jobs Hub and the seller will not receive funds until I verify the account.
          </span>
        </label>
        
        {/* 2. Verification window acknowledgment */}
        <label className="flex cursor-pointer items-start gap-3 select-none group">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="premium-input h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors"
              checked={verificationAccepted}
              onChange={(e) => setVerificationAccepted(e.target.checked)}
            />
          </div>
          <span className="text-sm leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors">
            I understand the verification period is 3 days. If I do not report an issue within this timeframe, the escrow funds will be automatically released to the seller.
          </span>
        </label>

        {/* 3. Explicit Clickwrap Terms & Conditions Acceptance */}
        <label className="flex cursor-pointer items-start gap-3 select-none group">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="premium-input h-5 w-5 sm:h-4 sm:w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-colors"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          </div>
          <span className="text-sm leading-relaxed text-slate-300 group-hover:text-slate-200 transition-colors">
            I confirm that I have had the opportunity to read, understand, and agree to be bound by the{' '}
            <Link
              to="/terms"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-0.5"
            >
              Remote Jobs Hub Terms and Conditions (v{TERMS_VERSION})
              <ExternalLink className="h-3 w-3 inline" />
            </Link>{' '}
            (including the Refund Policy and Vendor Availability terms) and{' '}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-0.5"
            >
              Privacy Policy
              <ExternalLink className="h-3 w-3 inline" />
            </Link>.
          </span>
        </label>
      </div>

      {/* Full Terms Inline Accordion Viewer */}
      <div className="pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={() => setShowFullTerms((prev) => !prev)}
          className="flex items-center justify-between w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            {showFullTerms ? 'Hide Full Terms & Conditions' : 'Review Full Terms & Conditions in Checkout'}
          </span>
          {showFullTerms ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {showFullTerms && (
          <div className="mt-3 space-y-3 rounded-2xl border border-white/5 bg-slate-950/70 p-4 animate-in fade-in duration-200">
            {/* Cryptographic Hash Notice */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-slate-300">
                <Hash className="h-3 w-3 text-indigo-400" />
                SHA-256 Fingerprint:
              </span>
              <span className="font-mono text-[10px] text-indigo-400/90 break-all select-all">
                {TERMS_DOCUMENT_HASH}
              </span>
            </div>

            {/* Scrollable Terms Content */}
            <div className="max-h-72 overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed text-slate-300 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <p className="italic text-slate-300 text-[11px]">
                {TERMS_PREAMBLE}
              </p>

              {TERMS_SECTIONS.map((sec) => (
                <div
                  key={sec.id}
                  className={`space-y-1.5 border-t border-white/5 pt-2.5 ${
                    sec.isNotice ? 'rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3' : ''
                  }`}
                >
                  <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-indigo-300">
                    {sec.title}
                  </h4>
                  {sec.content && (
                    <p className="whitespace-pre-line text-slate-300">{sec.content}</p>
                  )}
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-slate-400">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          {sub.heading && (
                            <h5 className="font-semibold text-slate-200 text-[11px]">
                              {sub.heading}
                            </h5>
                          )}
                          {sub.content && (
                            <p className="whitespace-pre-line text-slate-300">{sub.content}</p>
                          )}
                          {sub.bullets && sub.bullets.length > 0 && (
                            <ul className="list-disc pl-4 space-y-1 text-slate-400">
                              {sub.bullets.map((sb, sbIdx) => (
                                <li key={sbIdx}>{sb}</li>
                              ))}
                            </ul>
                          )}
                          {sub.footer && (
                            <p className="italic text-[11px] text-slate-400">{sub.footer}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {sec.footer && (
                    <p className="italic text-[11px] text-slate-400">{sec.footer}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[11px]">
              <span className="text-slate-400">
                Document version {TERMS_VERSION} (Status: {TERMS_STATUS.toUpperCase()})
              </span>
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                Open in new window
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
