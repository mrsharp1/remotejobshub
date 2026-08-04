import React from 'react'

export const PublicMediaLibraryPage: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80'
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Media Library
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Company Photo Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Glimpses into our distributed team culture, annual summits, workspace environment, and branding assets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-64 overflow-hidden relative">
                <img src={img} alt={`Summit Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
