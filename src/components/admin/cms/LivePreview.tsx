import React, { useState } from 'react'
import { Monitor, Smartphone, Tablet, X, ChevronDown } from 'lucide-react'
import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { CommunityPage } from '@/pages/public/CommunityPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { MarketplacePage } from '@/pages/public/MarketplacePage'

interface LivePreviewProps {
  children?: React.ReactNode
  initialPage?: string
  onClose: () => void
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export const LivePreview: React.FC<LivePreviewProps> = ({ children, onClose, initialPage = 'current' }) => {
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const [previewPage, setPreviewPage] = useState<string>(initialPage)
  const [showPageMenu, setShowPageMenu] = useState(false)

  const pages = [
    { id: 'current', label: 'Current Editor' },
    { id: 'home', label: 'Homepage' },
    { id: 'about', label: 'About Us' },
    { id: 'community', label: 'Community' },
    { id: 'contact', label: 'Contact' },
    { id: 'marketplace', label: 'Marketplace' },
  ]

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return 'max-w-[375px]'
      case 'tablet': return 'max-w-[768px]'
      case 'desktop': return 'max-w-full'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-sm">
      {/* Top Bar */}
      <div className="h-14 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowPageMenu(!showPageMenu)}
              className="flex items-center gap-2 font-heading font-bold text-foreground hover:text-primary transition-colors"
            >
              Preview: {pages.find(p => p.id === previewPage)?.label || 'Live'}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showPageMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-card border rounded-xl shadow-xl overflow-hidden py-1 z-50">
                {pages.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPreviewPage(p.id)
                      setShowPageMenu(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${previewPage === p.id ? 'font-bold text-primary bg-primary/5' : ''}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-md transition-colors ${device === 'tablet' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
        <div className={`w-full bg-background min-h-full transition-all duration-300 shadow-2xl ${device !== 'desktop' ? 'rounded-2xl overflow-hidden border-8 border-slate-800' : ''} ${getDeviceWidth()}`}>
          <div className="pointer-events-none">
            {previewPage === 'current' && children}
            {previewPage === 'home' && <HomePage />}
            {previewPage === 'about' && <AboutPage />}
            {previewPage === 'community' && <CommunityPage />}
            {previewPage === 'contact' && <ContactPage />}
            {previewPage === 'marketplace' && <MarketplacePage />}
          </div>
        </div>
      </div>
    </div>
  )
}
