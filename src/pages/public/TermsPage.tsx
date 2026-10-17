import React, { useState } from 'react';
import { SEO } from '@/components/common/SEO';
import {
  TERMS_TITLE,
  TERMS_VERSION,
  TERMS_LAST_UPDATED,
  TERMS_STATUS,
  TERMS_PREAMBLE,
  TERMS_DOCUMENT_HASH,
  TERMS_SECTIONS,
} from '@/constants/terms';
import { ShieldCheck, Hash, Copy, Check, AlertTriangle, List } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(TERMS_DOCUMENT_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isDraft = TERMS_STATUS === 'draft';

  return (
    <>
      <SEO 
        title="Terms and Conditions | Remote Jobs Hub"
        description="Terms and Conditions for using Remote Jobs Hub."
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-10">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
            
            <div className="not-prose mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      {isDraft ? 'Platform Legal Document (Draft Status)' : 'Platform Legal Agreement'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {TERMS_TITLE}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Version {TERMS_VERSION} &bull; Last Updated: {TERMS_LAST_UPDATED}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                      isDraft
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    Status: {TERMS_STATUS}
                  </span>
                </div>
              </div>

              {isDraft && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <strong className="font-semibold">Draft Review Status:</strong> This terms version ({TERMS_VERSION}) is currently staged in <code className="font-mono">draft</code> status pending final client publication sign-off.
                  </div>
                </div>
              )}

              {/* SHA-256 Fingerprint Verification Box */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700/60 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Hash className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="font-medium text-gray-600 dark:text-gray-400 shrink-0">SHA-256 Fingerprint:</span>
                  <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300 truncate select-all">
                    {TERMS_DOCUMENT_HASH}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[11px]"
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
              <nav aria-label="Terms and Conditions Sections" className="rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2.5">
                  <List className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Quick Section Navigation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  {TERMS_SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                    >
                      {sec.title}
                    </a>
                  ))}
                </div>
              </nav>
            </div>

            <p className="leading-relaxed font-medium text-gray-800 dark:text-gray-200">
              {TERMS_PREAMBLE}
            </p>

            {TERMS_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={`mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/60 scroll-mt-20 ${
                  section.isNotice
                    ? 'rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 p-5'
                    : ''
                }`}
              >
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{section.title}</span>
                </h2>

                {section.content && (
                  <p className="whitespace-pre-line mb-3 leading-relaxed">
                    {section.content}
                  </p>
                )}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1.5 mb-3">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}

                {section.subsections && section.subsections.length > 0 && (
                  <div className="space-y-4 mt-3">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        {sub.heading && (
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-3">
                            {sub.heading}
                          </h3>
                        )}
                        {sub.content && (
                          <p className="whitespace-pre-line leading-relaxed">
                            {sub.content}
                          </p>
                        )}
                        {sub.bullets && sub.bullets.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1.5">
                            {sub.bullets.map((sb, sbIdx) => (
                              <li key={sbIdx} className="leading-relaxed">{sb}</li>
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
                  <p className="text-xs italic text-gray-600 dark:text-gray-400 mt-3">
                    {section.footer}
                  </p>
                )}
              </section>
            ))}

            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
              Remote Jobs Hub &bull; Version {TERMS_VERSION} ({TERMS_STATUS.toUpperCase()}) &bull; Document SHA-256: {TERMS_DOCUMENT_HASH}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
