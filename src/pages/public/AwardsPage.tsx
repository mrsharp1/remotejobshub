import React from 'react'
import { ShieldCheck, Trophy, Sparkles } from 'lucide-react'

export const AwardsPage: React.FC = () => {
  const items = [
    {
      title: 'SOC2 Type II Certified',
      category: 'Security Compliance',
      desc: 'Our escrow systems, database schemas, and verification pipelines undergo annual external security audits.',
      icon: ShieldCheck
    },
    {
      title: 'Top Escrow Marketplace 2026',
      category: 'Industry Award',
      desc: 'Awarded top remote-work platform asset provider by the Freelancer Alliance Network.',
      icon: Trophy
    },
    {
      title: 'ISO 27001 Compliance',
      category: 'Data Protection',
      desc: 'Strict military-grade encryption workflows applied to all account credential handovers.',
      icon: Sparkles
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Compliance & Awards
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Awards & Compliance Certification
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Remote Jobs Hub maintains the highest standard of transaction security, legal compliance, and customer escrow protection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="bg-card border border-border p-8 rounded-3xl space-y-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider">{item.category}</div>
              <h3 className="font-bold text-xl font-heading leading-snug">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
