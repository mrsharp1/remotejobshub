import React from 'react'
import { motion } from 'framer-motion'
import { Star, CheckCircle2, ThumbsUp } from 'lucide-react'
import { useReviewsContent } from '@/services/cms/cms.store'
import { springs } from '@/lib/framer-physics'

export const WrittenReviews: React.FC<{ location?: 'homepage' | 'marketplace' | 'community' | 'about' | 'sellerProfile' }> = ({ location = 'homepage' }) => {
  const { writtenReviews } = useReviewsContent()
  const filteredReviews = writtenReviews.filter(r => {
    if (location === 'homepage') return r.showOnHomepage !== false
    if (location === 'marketplace') return r.showOnMarketplace !== false
    if (location === 'community') return r.showOnCommunity !== false
    if (location === 'about') return r.showOnAbout !== false
    if (location === 'sellerProfile') return r.showOnSellerProfile !== false
    return true
  })

  // SPRINT 11.3E FORENSIC DUMP
  if (import.meta.env.DEV) {
    console.log('--- SPRINT 11.3E RUNTIME EVIDENCE ---')
    console.log('1. localStorage cms-storage:', JSON.parse(localStorage.getItem('cms-storage') || '{}'))
    console.log('2. useReviewsContent() output:', { writtenReviews })
    console.log('3. WrittenReviews props:', { location })
    console.log('4. Filtered Array output:', filteredReviews)
    console.log('---------------------------------------')
  }

  if (filteredReviews.length === 0) {
    if (import.meta.env.DEV) {
      return (
        <div className="p-8 m-8 border-4 border-red-500 bg-black text-white font-mono text-xs rounded">
          <h2 className="text-red-500 text-lg font-bold mb-4">SPRINT 11.3E FORENSIC DUMP - WrittenReviews.tsx</h2>
          <pre>1. localStorage size: {localStorage.getItem('cms-storage')?.length || 0} bytes</pre>
          <pre>2. useReviewsContent() hook result length: {writtenReviews.length}</pre>
          <pre>3. Component props: location={location}</pre>
          <pre>4. Filtered array length: {filteredReviews.length}</pre>
          <div className="mt-4 text-gray-400">Please check DevTools Console for the full JSON objects.</div>
        </div>
      )
    }
    return null
  }

  console.log("WRITTEN", writtenReviews)
  return (
    <section className="bg-slate-950 px-4 py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springs.gentle, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:bg-slate-900/60 sm:p-8"
            >
              <div className="flex-1">
                <div className="mb-4 flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`h-4 w-4 ${idx < review.rating ? 'fill-current' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>
                <h5 className="mb-2 break-words text-lg font-bold text-white sm:text-xl">{review.title}</h5>
                <p className="mb-6 break-words text-sm leading-relaxed text-slate-300 sm:text-base">
                  "{review.body}"
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex items-center gap-4">
                  {review.avatar ? (
                    <img 
                      src={review.avatar} 
                      alt={review.customerName} 
                      className="h-12 w-12 rounded-full object-cover shadow-inner"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shadow-inner">
                      {review.customerName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="flex items-center gap-1 truncate font-bold text-white">
                      <span className="truncate">{review.customerName}</span>
                      {review.verified && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
                    </h4>
                    <p className="truncate text-xs text-slate-500">
                      {review.country} • {review.platformPurchased}
                    </p>
                  </div>
                </div>
                <button className="flex shrink-0 items-center gap-1 rounded-full bg-slate-800/50 px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                  <ThumbsUp className="h-3 w-3" /> Helpful
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
