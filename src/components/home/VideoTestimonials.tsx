import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Star, X } from 'lucide-react'
import { cmsReviewsService, CMSVideoTestimonial } from '@/services/cms/cms-reviews.service'
import { springs } from '@/lib/framer-physics'

export const VideoTestimonials: React.FC<{ location?: 'homepage' | 'marketplace' | 'community' | 'about' | 'sellerProfile' }> = ({ location = 'homepage' }) => {
  const [videoTestimonials, setVideoTestimonials] = useState<CMSVideoTestimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchVideos = async () => {
      try {
        const data = await cmsReviewsService.getVideoTestimonials()
        if (isMounted) {
          setVideoTestimonials(data)
          setIsLoading(false)
        }
      } catch (err: any) {
        console.error('Failed to load video testimonials:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load videos')
          setIsLoading(false)
        }
      }
    }
    fetchVideos()
    return () => { isMounted = false }
  }, [])

  const filteredVideos = videoTestimonials.filter(v => {
    if (location === 'homepage') return v.showOnHomepage !== false
    if (location === 'marketplace') return v.showOnMarketplace !== false
    if (location === 'community') return v.showOnCommunity !== false
    if (location === 'about') return v.showOnAbout !== false
    if (location === 'sellerProfile') return v.showOnSellerProfile !== false
    return true
  })

  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  if (isLoading) {
    return (
      <section className="bg-slate-950 px-4 py-32 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-slate-950 px-4 py-32 flex justify-center">
        <div className="p-4 rounded-xl border border-red-900 bg-red-950/20 text-red-500 text-sm">
          Failed to load videos. Please try again later.
        </div>
      </section>
    )
  }

  if (filteredVideos.length === 0) {
    return null
  }

  return (
    <section className="bg-slate-950 px-4 py-32">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="font-heading text-4xl font-black tracking-tight text-white md:text-5xl">
              Hear from our Buyers
            </h2>
          </div>
          <div className="flex gap-2 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 fill-current" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {filteredVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springs.gentle, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:bg-slate-900/60"
            >
              <div className="aspect-video w-full overflow-hidden relative bg-black shrink-0">
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setActiveVideo(video.id)}
                >
                  <div className="absolute inset-0 bg-slate-900/40 transition-colors group-hover:bg-slate-900/10 z-10" />
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.customerName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500">
                      <Play className="h-12 w-12" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-primary hover:text-white shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.6)] border border-white/40"
                    >
                      <div className="absolute inset-0 animate-ping rounded-full bg-white/20 duration-1000 group-hover:bg-primary/40" />
                      <Play className="relative z-10 h-6 w-6 ml-1 fill-current" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-3 right-3 z-20 rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    {video.duration}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 sm:p-8">
                <div className="mb-4 flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`h-4 w-4 ${idx < video.rating ? 'fill-current' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>
                <h4 className="mb-2 break-words text-lg font-bold text-white sm:text-xl">{video.customerName}</h4>
                <p className="mb-4 truncate text-sm font-medium text-slate-400">{video.country}</p>
                <p className="break-words text-sm leading-relaxed text-slate-300 sm:text-base">
                  "{video.summary}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="aspect-video w-full relative">
                <video
                  src={filteredVideos.find(v => v.id === activeVideo)?.videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain bg-black"
                />
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-white/20 transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
