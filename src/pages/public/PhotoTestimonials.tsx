import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, X } from 'lucide-react'

export const PhotoTestimonials: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const photos = [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">Photo Testimonials & Earnings Proof</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verified screenshots of client milestones, platform dashboards, and bank deposits shared by our buyers.
          </p>
        </div>

        {/* Masonry / Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <div 
              key={index}
              onClick={() => setSelectedPhoto(photo)}
              className="break-inside-avoid bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group relative cursor-pointer"
            >
              <img src={photo} alt={`Earning Proof ${index + 1}`} className="w-full h-auto object-cover group-hover:scale-102 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-full text-foreground shadow-2xl">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={selectedPhoto} 
              alt="Lightbox Proof" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
