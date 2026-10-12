import React, { useState } from 'react';
import { SEO } from '@/components/common/SEO';
import {
  TERMS_TITLE,
  TERMS_VERSION,
  TERMS_LAST_UPDATED,
  TERMS_DOCUMENT_HASH,
  TERMS_SECTIONS,
} from '@/constants/terms';
import { ShieldCheck, Hash, Copy, Check } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(TERMS_DOCUMENT_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <>
      <SEO 
        title="Terms and Conditions | Remote Jobs Hub"
        description="Official Terms and Conditions for using Remote Jobs Hub."
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-10">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
            
            <div className="not-prose mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      Official Legal Agreement
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {TERMS_TITLE}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Version {TERMS_VERSION} ({TERMS_LAST_UPDATED})
                  </span>
                </div>
              </div>

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
            </div>

            <p className="leading-relaxed">
              By accessing this page, communicating with the service provider, or making any form of payment, you (&ldquo;Client&rdquo;) confirm that you have read, understood, and agreed to be legally bound by the following Terms and Conditions.
            </p>

            {TERMS_SECTIONS.map((section, idx) => (
              <div key={idx} className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/60">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{section.title}</span>
                </h2>
                <p className="whitespace-pre-line mb-3 leading-relaxed">
                  {section.content}
                </p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1.5 mb-3">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
                {section.footer && (
                  <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">
                    {section.footer}
                  </p>
                )}
              </div>
            ))}

            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
              Remote Jobs Hub &bull; Canonical Version {TERMS_VERSION} &bull; Document SHA-256: {TERMS_DOCUMENT_HASH}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
