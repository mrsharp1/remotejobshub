import React from 'react'
import { Download } from 'lucide-react'

export const BrandKitPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Brand Kit
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Brand Guidelines & Assets
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Official guidelines, colors, typography rules, and logo resources for Remote Jobs Hub.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Logo Card */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
            <h3 className="font-bold text-xl font-heading">Primary Logos</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use the primary dark logo on light backgrounds, and the light logo on dark backgrounds to maintain high visibility.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-border flex items-center justify-center font-black tracking-tight text-slate-800 dark:text-white">
                remote jobs hub
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl flex items-center justify-center font-black tracking-tight text-white">
                remote jobs hub
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-xl font-bold text-sm hover:bg-muted/50 transition-colors">
              <Download className="w-4 h-4 text-primary" /> Download SVG Pack
            </button>
          </div>

          {/* Color Palettes */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
            <h3 className="font-bold text-xl font-heading">Brand Colors</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our core colors are crafted to evoke trust, security, and a premium SaaS aesthetic.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-xl" />
                <div className="text-xs font-bold text-center">Primary (#6366f1)</div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-emerald-500 rounded-xl" />
                <div className="text-xs font-bold text-center">Success (#10b981)</div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-slate-900 rounded-xl" />
                <div className="text-xs font-bold text-center">Neutral (#0f172a)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
