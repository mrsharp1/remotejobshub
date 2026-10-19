import React, { useState } from 'react'
import { SEO } from '@/components/common/SEO'
import {
  TERMS_TITLE,
  TERMS_VERSION,
  TERMS_LAST_UPDATED,
  TERMS_STATUS,
  TERMS_PREAMBLE,
  TERMS_DOCUMENT_HASH,
  TERMS_SECTIONS,
} from '@/constants/terms'
import {
  ShieldCheck,
  Hash,
  Copy,
  Check,
  AlertTriangle,
  List,
} from 'lucide-react'

export const TermsPage: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState(false)

  const handleCopyHash = () => {
    navigator.clipboard.writeText(TERMS_DOCUMENT_HASH)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const isDraft = TERMS_STATUS === 'draft'

  return (
    <>
      <SEO
        title="Terms and Conditions | Remote Jobs Hub"
        description="Terms and Conditions for using Remote Jobs Hub."
      />

      <div className="min-h-screen bg-gray-50 px-4 py-12 transition-colors duration-200 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-10">
          <div className="prose prose-sm sm:prose-base dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 max-w-none">
            <div className="not-prose mb-8 space-y-4 border-b border-gray-200 pb-6 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {isDraft
                        ? 'Platform Legal Document (Draft Status)'
                        : 'Platform Legal Agreement'}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                      {TERMS_TITLE}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 font-mono text-xs font-semibold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400">
                    Version {TERMS_VERSION} &bull; Last Updated:{' '}
                    {TERMS_LAST_UPDATED}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-xs font-bold uppercase ${
                      isDraft
                        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    }`}
                  >
                    Status: {TERMS_STATUS}
                  </span>
                </div>
              </div>

              {isDraft && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <strong className="font-semibold">
                      Draft Review Status:
                    </strong>{' '}
                    This terms version ({TERMS_VERSION}) is currently staged in{' '}
                    <code className="font-mono">draft</code> status pending
                    final client publication sign-off.
                  </div>
                </div>
              )}

              {/* SHA-256 Fingerprint Verification Box */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700/60 dark:bg-gray-900/60">
                <div className="flex min-w-0 items-center gap-2">
                  <Hash className="h-4 w-4 shrink-0 text-indigo-500" />
                  <span className="shrink-0 font-medium text-gray-600 dark:text-gray-400">
                    SHA-256 Fingerprint:
                  </span>
                  <span className="select-all truncate font-mono text-[11px] text-gray-700 dark:text-gray-300">
                    {TERMS_DOCUMENT_HASH}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {copiedHash ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Accessible Section Navigation */}
              <nav
                aria-label="Terms and Conditions Sections"
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700/60 dark:bg-gray-900/40"
              >
                <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  <List className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Quick Section Navigation</span>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
                  {TERMS_SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="truncate text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      {sec.title}
                    </a>
                  ))}
                </div>
              </nav>
            </div>

            <p className="font-medium leading-relaxed text-gray-800 dark:text-gray-200">
              {TERMS_PREAMBLE}
            </p>

            {TERMS_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={`mt-8 scroll-mt-20 border-t border-gray-100 pt-6 dark:border-gray-700/60 ${
                  section.isNotice
                    ? 'rounded-xl border border-indigo-200/60 bg-indigo-50/40 p-5 dark:border-indigo-800/40 dark:bg-indigo-950/20'
                    : ''
                }`}
              >
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  <span>{section.title}</span>
                </h2>

                {section.content && (
                  <p className="mb-3 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                )}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mb-3 list-disc space-y-1.5 pl-5">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && section.subsections.length > 0 && (
                  <div className="mt-3 space-y-4">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        {sub.heading && (
                          <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
                            {sub.heading}
                          </h3>
                        )}
                        {sub.content && (
                          <p className="whitespace-pre-line leading-relaxed">
                            {sub.content}
                          </p>
                        )}
                        {sub.bullets && sub.bullets.length > 0 && (
                          <ul className="list-disc space-y-1.5 pl-5">
                            {sub.bullets.map((sb, sbIdx) => (
                              <li key={sbIdx} className="leading-relaxed">
                                {sb}
                              </li>
                            ))}
                          </ul>
                        )}
                        {sub.footer && (
                          <p className="text-xs italic text-gray-600 dark:text-gray-400">
                            {sub.footer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.footer && (
                  <p className="mt-3 text-xs italic text-gray-600 dark:text-gray-400">
                    {section.footer}
                  </p>
                )}
              </section>
            ))}

            <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Remote Jobs Hub &bull; Version {TERMS_VERSION} (
              {TERMS_STATUS.toUpperCase()}) &bull; Document SHA-256:{' '}
              {TERMS_DOCUMENT_HASH}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TermsPage
