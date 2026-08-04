import React, { useState } from 'react'
import { Download, Maximize2, X } from 'lucide-react'

interface DocumentViewerProps {
  images: string[]
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ images }) => {
  const [activeZoom, setActiveZoom] = useState<string | null>(null)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm text-xs">
      <div>
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Listing Attachments Audit</h4>
        <p className="text-[9.5px] text-slate-400 mt-0.5">Verification documents and revenue screenshots</p>
      </div>

      {images.length > 0 ? (
        <div className="grid gap-3 grid-cols-2">
          {images.map((url, idx) => (
            <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-950 dark:border-slate-850">
              <img src={url} alt={`Listing doc ${idx + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setActiveZoom(url)}
                  className="rounded-lg bg-black/60 p-2 text-white hover:bg-black/90"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <a
                  href={url}
                  download
                  className="rounded-lg bg-black/60 p-2 text-white hover:bg-black/90"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic">No attachments uploaded for this listing.</p>
      )}

      {/* Lightbox Modal */}
      {activeZoom && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-4">
            <button
              onClick={() => setActiveZoom(null)}
              className="absolute right-4 top-4 rounded-xl bg-black/60 p-2 text-white hover:bg-black/90 z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={activeZoom} alt="Zoomed audit screenshot" className="w-full h-auto object-contain max-h-[80vh] rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}
