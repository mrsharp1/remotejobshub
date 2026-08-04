import React from 'react'
import { motion } from 'framer-motion'
import { Star, ShieldCheck } from 'lucide-react'

import { useReviewsContent } from '@/services/cms/cms.store'

export const CustomerTestimonials: React.FC = () => {
  const { writtenReviews } = useReviewsContent()
  const testimonials = writtenReviews.filter(r => r.showOnHomepage !== false).slice(0, 3)

  if (testimonials.length === 0) return null

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Don't just take our word for it
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Read real stories from verified buyers and sellers who trust our platform with their digital assets.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="premium-card flex flex-col justify-between p-8"
            >
              <div>
                <div className="mb-6 flex gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="mb-8 text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                  "{t.body}"
                </p>
              </div>
              
              <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{t.customerName}</p>
                    <p className="text-sm text-slate-500">{t.country}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>Purchased {t.platformPurchased} Account</span>
                  <span>{t.verified ? 'Verified Purchase' : 'Purchase'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
