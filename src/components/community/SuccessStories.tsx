import React from 'react'
import { motion } from 'framer-motion'
import { Star, ShieldCheck } from 'lucide-react'
import { useReviewsContent } from '@/services/cms/cms.store'

export const SuccessStories: React.FC = () => {
  const { writtenReviews } = useReviewsContent()
  const stories = writtenReviews.filter(r => r.showOnCommunity)

  if (stories.length === 0) return null

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Success Stories
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Real feedback from professional agencies and independent traders inside our network.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="premium-card flex flex-col justify-between p-8"
            >
              <div>
                <div className="mb-6 flex gap-1">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="mb-8 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  "{story.body}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                {story.avatar ? (
                  <img
                    src={story.avatar}
                    alt={story.customerName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shadow-inner">
                    {story.customerName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">{story.customerName}</span>
                    {story.verified && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <p className="text-xs text-slate-500">
                    {story.platformPurchased} • {story.country}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
