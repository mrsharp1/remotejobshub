import React, { useEffect, useState } from 'react'
import { Download, FileText, Search, FileDown } from 'lucide-react'

export const DownloadCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const downloads = [
    { category: 'Guides', title: 'Ultimate Remote Job Guide 2026', format: 'PDF', size: '2.4 MB' },
    { category: 'Guides', title: 'VPN & Proxy Setup Manual', format: 'PDF', size: '1.1 MB' },
    { category: 'Checklists', title: 'Buyer Security Checklist', format: 'PDF', size: '800 KB' },
    { category: 'Checklists', title: 'Seller KYC Requirements', format: 'PDF', size: '450 KB' },
    { category: 'Legal', title: 'Terms of Service', format: 'PDF', size: '1.8 MB' },
    { category: 'Legal', title: 'Escrow Agreement', format: 'PDF', size: '1.2 MB' },
  ]

  const filtered = downloads.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">Download Center</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Access all official Remote Jobs Hub documentation, guides, and policies in offline-ready formats.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors shadow-sm group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">{item.category}</div>
                    <h3 className="font-bold text-lg leading-tight mb-1">{item.title}</h3>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="uppercase font-bold tracking-wider text-xs">{item.format}</span> • {item.size}
                    </div>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                  <FileDown className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-20 text-muted-foreground">
                No downloads found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
