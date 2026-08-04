import React from 'react'
import { Calendar, Tag, ArrowRight } from 'lucide-react'

export const NewsroomPage: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: 'Remote Jobs Hub Secures Series A Funding to Expand Escrow Protection',
      category: 'Announcements',
      date: 'June 28, 2026',
      excerpt: 'We have secured ₦15B in Series A funding to expand our compliance teams and implement military-grade biometric identity verification for all sellers.'
    },
    {
      id: 2,
      title: 'V2 Security Protocol: Biometric KYC Integration is Live',
      category: 'Product Updates',
      date: 'May 14, 2026',
      excerpt: 'All sellers will now undergo automated AI biometric face match verification against local database schemas before creating any listing.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">Newsroom & Press</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay up to date with official company announcements, security protocols, and product roadmap updates.
          </p>
        </div>

        <div className="space-y-8">
          {articles.map(article => (
            <div key={article.id} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {article.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground hover:text-primary transition-colors cursor-pointer leading-tight">
                {article.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
              <button className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all pt-2">
                Read Article <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
