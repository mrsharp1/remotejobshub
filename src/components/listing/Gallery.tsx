import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Globe, Maximize2 } from 'lucide-react'

interface GalleryProps {
  images: string[]
  title: string
}

export const Gallery: React.FC<GalleryProps> = ({ images, title }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const hasMedia = images.length > 0

  const handleNext = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black/95 backdrop-blur-xl' : 'aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-white/5 bg-slate-900 shadow-2xl'}`}>
      {hasMedia ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIdx}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {images[activeImageIdx].toLowerCase().match(/\.(mp4|webm|mov)$/) ? (
                <video
                  src={images[activeImageIdx]}
                  controls
                  className={`h-full w-full object-contain ${isFullscreen ? 'max-h-screen' : 'bg-black'}`}
                  preload="metadata"
                />
              ) : (
                <img
                  src={images[activeImageIdx]}
                  alt={`${title} - Media ${activeImageIdx + 1}`}
                  className={`h-full w-full ${isFullscreen ? 'object-contain p-4' : 'object-cover'}`}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-90"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-90"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-2 rounded-full transition-all ${activeImageIdx === idx ? 'w-4 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute right-4 top-4 rounded-xl bg-black/40 p-2.5 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-slate-500">
          <Globe className="h-16 w-16 opacity-20" />
          <span className="mt-4 text-sm font-semibold uppercase tracking-wider">
            No Media Available
          </span>
        </div>
      )}
      
      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute left-4 top-4 rounded-xl bg-black/40 px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
        >
          Close Fullscreen
        </button>
      )}
    </div>
  )
}
