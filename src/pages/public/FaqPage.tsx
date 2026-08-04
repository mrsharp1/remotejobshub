import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Play, ShoppingBag, Landmark, ShieldCheck } from 'lucide-react'
import { FaqHero } from '@/components/faq/FaqHero'
import { PopularQuestions } from '@/components/faq/PopularQuestions'

// Lazy loaded below-the-fold components
const StepGuides = lazy(() => import('@/components/faq/StepGuides').then(m => ({ default: m.StepGuides })))
const FaqSupportChannels = lazy(() => import('@/components/faq/FaqSupportChannels').then(m => ({ default: m.FaqSupportChannels })))
const FaqTrust = lazy(() => import('@/components/faq/FaqTrust').then(m => ({ default: m.FaqTrust })))
const FaqCTA = lazy(() => import('@/components/faq/FaqCTA').then(m => ({ default: m.FaqCTA })))

const ComponentSkeleton: React.FC = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 space-y-8 animate-pulse">
    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    <div className="grid gap-6 md:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-40 rounded-3xl border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 p-6 space-y-4">
          <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
)

const categories = [
  {
    label: 'Getting Started',
    icon: Play,
    desc: 'New user tutorials, account setups, and profile registrations.',
    items: [
      {
        q: 'What is Remote Jobs Hub?',
        a: 'Remote Jobs Hub is a secure marketplace where verified sellers list established remote work accounts for sale, and verified buyers can purchase them through our escrow-protected system.',
      },
      {
        q: 'Is it free to sign up?',
        a: 'Yes! Creating a buyer account is completely free. Sellers can also register for free but require a subscription plan to publish listings.',
      },
      {
        q: 'How do I verify my identity?',
        a: 'Sellers must complete our KYC process by submitting a government-issued ID and selfie through the Seller Verification section of their dashboard. Approval typically takes 24–48 hours.',
      },
    ],
  },
  {
    label: 'Buying',
    icon: ShoppingBag,
    desc: 'Escrow procedures, disputes, and account handover rules.',
    items: [
      {
        q: 'How does the escrow system work?',
        a: 'When you purchase a listing, your payment is held in secure escrow. The seller transfers the account credentials, and once you confirm successful delivery, the funds are released to the seller.',
      },
      {
        q: 'What if I have a problem with my purchase?',
        a: 'You can open a dispute from your order details page within the dispute window. Our admin team reviews all evidence and makes a fair resolution, including potential refunds.',
      },
      {
        q: 'Can I negotiate prices with sellers?',
        a: 'Yes! You can start a conversation with any seller through our in-app messaging system to discuss pricing before making a purchase.',
      },
    ],
  },
  {
    label: 'Selling',
    icon: Landmark,
    desc: 'Seller Studio creation, verification requirements, and commission scales.',
    items: [
      {
        q: 'How do I list my account for sale?',
        a: 'Complete your seller profile, get KYC verified, then use the Seller Studio to create a listing. All listings are reviewed by our admin team before being published.',
      },
      {
        q: 'How long does listing approval take?',
        a: 'Most listings are reviewed within 24 hours. Verified sellers with a strong history typically see faster approval times.',
      },
      {
        q: 'When do I receive my payment?',
        a: 'Funds are released to your seller wallet once the buyer confirms successful delivery of the account. You can then withdraw to your bank account.',
      },
      {
        q: 'What commission does Remote Jobs Hub charge?',
        a: 'Commission rates depend on your seller agreement plan. Rates typically range from 5–15% of the sale price. Full details are available in your seller dashboard under Revenue Agreement.',
      },
    ],
  },
  {
    label: 'Payments & Security',
    icon: ShieldCheck,
    desc: 'Gateway integrations, seller wallets, and bank withdrawals.',
    items: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major cards and bank transfers through our Paystack payment gateway. Wallet balance can also be used for purchases.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All payment processing is handled by Paystack, a PCI-DSS compliant gateway. We never store your card details on our servers.',
      },
      {
        q: 'How do I withdraw my seller earnings?',
        a: 'Navigate to your Seller Wallet, click "Withdraw", enter your bank details, and submit a withdrawal request. Withdrawals are processed within 1–3 business days.',
      },
    ],
  },
]

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const handlePopularQuestionClick = useCallback((qText: string) => {
    setSearchQuery(qText)
    setExpandedQuestion(qText)
    const element = document.getElementById('faq-accordion-anchor')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const highlightText = useCallback((text: string, search: string) => {
    if (!search) return text
    const parts = text.split(new RegExp(`(${search})`, 'gi'))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-yellow-100 text-slate-900 rounded px-0.5 font-bold dark:bg-yellow-500/30 dark:text-slate-100">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    )
  }, [])

  // Filter categories based on selection and search
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const matchedItems = cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        return { ...cat, items: matchedItems }
      })
      .filter((cat) => {
        if (activeCategory && cat.label !== activeCategory) return false
        return cat.items.length > 0
      })
  }, [searchQuery, activeCategory])

  return (
    <div className="flex flex-col bg-background">
      <FaqHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Popular questions */}
      {searchQuery === '' && (
        <PopularQuestions onQuestionClick={handlePopularQuestionClick} />
      )}

      {/* Category Quick Filter */}
      <section className="bg-white py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                activeCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                  activeCategory === cat.label
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordions */}
      <section id="faq-accordion-anchor" className="bg-slate-50 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4">
          {filteredCategories.map((cat) => (
            <div key={cat.label} className="mb-12 last:mb-0">
              <h3 className="mb-6 font-heading text-xl font-bold text-foreground">
                {cat.label}
              </h3>
              <div className="space-y-4">
                {cat.items.map((item) => {
                  const isOpen = expandedQuestion === item.q
                  return (
                    <div
                      key={item.q}
                      className={`premium-card overflow-hidden transition-colors ${
                        isOpen ? 'border-indigo-500/50 dark:border-indigo-500/30' : ''
                      }`}
                    >
                      <button
                        onClick={() => setExpandedQuestion(isOpen ? null : item.q)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start justify-between gap-4 p-6 text-left"
                      >
                        <span className="font-heading text-base font-bold text-slate-900 dark:text-white">
                          {highlightText(item.q, searchQuery)}
                        </span>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                              {highlightText(item.a, searchQuery)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-medium text-slate-500">
                No matching questions found for "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory(null)
                }}
                className="mt-4 text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Clear search query
              </button>
            </div>
          )}
        </div>
      </section>

      <Suspense fallback={<ComponentSkeleton />}>
        <StepGuides />
        <FaqTrust />
        <FaqSupportChannels />
        <FaqCTA />
      </Suspense>
    </div>
  )
}
