import React from 'react'
import { Download, Mail, Phone, MapPin } from 'lucide-react'

export const PressCenterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">Press Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Official brand resources, guidelines, statistics, and press contact credentials.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-2xl font-bold font-heading">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Remote Jobs Hub is the world’s leading escrow marketplace for verified remote work assets. We eliminate geographical limits for remote professionals by providing safe, vetted, and revenue-generating accounts globally.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="text-2xl font-bold font-heading">Brand Assets</h2>
              <p className="text-muted-foreground">
                Download high-resolution company logos, product screenshots, and executive portrait assets.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-bold text-sm">
                  <span>Press Kit (Complete ZIP)</span>
                  <Download className="w-4 h-4 text-primary" />
                </button>
                <button className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors font-bold text-sm">
                  <span>Logo Pack (SVG & PNG)</span>
                  <Download className="w-4 h-4 text-primary" />
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="font-bold font-heading text-lg">Media Relations</h3>
            <p className="text-sm text-muted-foreground">
              For official inquiries, interviews, or statement releases, contact our press relations desk.
            </p>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:press@remotejobshub.com" className="hover:underline">press@remotejobshub.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (555) 321-0980</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Austin, Texas, US</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
