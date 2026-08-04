import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Minus, ChevronDown } from 'lucide-react'

const features = [
  {
    category: 'Core Capabilities',
    items: [
      { name: 'Marketplace Access', free: true, pro: true, elite: true },
      { name: 'Escrow Protection', free: true, pro: true, elite: true },
      { name: 'Dispute Resolution', free: true, pro: true, elite: true },
      { name: 'Active Listings Limit', free: '0', pro: '10', elite: 'Unlimited' },
      { name: 'Custom Storefront', free: false, pro: false, elite: true },
    ],
  },
  {
    category: 'Trust & Security',
    items: [
      { name: 'KYC Verification', free: 'Basic', pro: 'Priority', elite: 'VIP' },
      { name: 'Verified Seller Badge', free: false, pro: true, elite: true },
      { name: 'AI Risk Analysis', free: 'Standard', pro: 'Advanced', elite: 'Advanced' },
      { name: 'Escrow Funds Lock', free: true, pro: true, elite: true },
    ],
  },
  {
    category: 'Marketing & Analytics',
    items: [
      { name: 'Search Placement', free: 'Standard', pro: 'Boosted', elite: 'Featured' },
      { name: 'Analytics Dashboard', free: false, pro: 'Basic', elite: 'Advanced' },
      { name: 'AI Quality Coach', free: false, pro: true, elite: true },
      { name: 'Bulk Upload Tools', free: false, pro: false, elite: true },
    ],
  },
  {
    category: 'Support',
    items: [
      { name: 'Support Level', free: 'Email', pro: 'Priority 24/7', elite: 'Dedicated Manager' },
      { name: 'Resolution SLA', free: '48 hours', pro: '12 hours', elite: '4 hours' },
    ],
  },
]

export const FeatureComparison: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(features[0].category)

  const renderValue = (val: boolean | string, isPrimary = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <Check className={`mx-auto h-5 w-5 ${isPrimary ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-500'}`} />
      ) : (
        <Minus className="mx-auto h-5 w-5 text-slate-300 dark:text-slate-700" />
      )
    }
    return <span className={`font-medium ${isPrimary ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>{val}</span>
  }

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Compare Feature Tiers
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A detailed breakdown of capabilities included in each plan to help you make the right choice for your digital business.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-6 text-lg font-bold text-slate-900 dark:text-white w-2/5">Feature Overview</th>
                <th className="p-6 text-center text-lg font-bold text-slate-600 dark:text-slate-400 w-1/5">Free Buyer</th>
                <th className="p-6 text-center text-lg font-bold text-indigo-600 dark:text-indigo-400 w-1/5 bg-indigo-50/50 dark:bg-indigo-900/10">Seller Pro</th>
                <th className="p-6 text-center text-lg font-bold text-amber-600 dark:text-amber-500 w-1/5">Seller Elite</th>
              </tr>
            </thead>
            <tbody>
              {features.map((cat) => (
                <React.Fragment key={cat.category}>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td colSpan={4} className="px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-500">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.items.map((item) => (
                    <tr key={item.name} className="border-b border-slate-100 last:border-0 dark:border-slate-800/50">
                      <td className="p-6 font-medium text-slate-700 dark:text-slate-300">{item.name}</td>
                      <td className="p-6 text-center">{renderValue(item.free)}</td>
                      <td className="p-6 text-center bg-indigo-50/30 dark:bg-indigo-900/10">{renderValue(item.pro, true)}</td>
                      <td className="p-6 text-center">{renderValue(item.elite)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-4">
          {features.map((cat) => (
            <div key={cat.category} className="premium-card overflow-hidden">
              <button
                onClick={() => setOpenCategory(openCategory === cat.category ? null : cat.category)}
                className="flex w-full items-center justify-between bg-white p-6 dark:bg-slate-950"
              >
                <span className="font-heading text-lg font-bold text-foreground">{cat.category}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${openCategory === cat.category ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openCategory === cat.category && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 p-6 dark:bg-slate-900">
                      {cat.items.map((item) => (
                        <div key={item.name} className="mb-8 last:mb-0 border-b border-slate-200 pb-8 last:border-0 last:pb-0 dark:border-slate-800">
                          <h4 className="mb-4 font-bold text-slate-900 dark:text-white">{item.name}</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-slate-950">
                              <span className="text-sm font-medium text-slate-500">Free Buyer</span>
                              <div className="flex items-center justify-end">{renderValue(item.free)}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Seller Pro</span>
                              <div className="flex items-center justify-end">{renderValue(item.pro, true)}</div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-slate-950">
                              <span className="text-sm font-medium text-amber-600 dark:text-amber-500">Seller Elite</span>
                              <div className="flex items-center justify-end">{renderValue(item.elite)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
