import React from 'react'
import { Sparkles, Trophy, Handshake } from 'lucide-react'

export const PartnerProgramPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Partner Program
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Grow Your Remote Business With Us
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Partner with Remote Jobs Hub and earn high-tier commissions by introducing buyers or sellers to our secure escrow platform.
          </p>
        </div>

        {/* Perks */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl">Top-Tier Payouts</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Earn up to 20% of marketplace transaction fees on every successfully delivered account.
            </p>
          </div>
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl">Dedicated Manager</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get priority technical support, escrow advice, and dashboard tracking assistance.
            </p>
          </div>
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl">Exclusive Access</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Early previews of premium, high-revenue accounts before they are listed publicly.
            </p>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold font-heading">Apply For Partnership</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We partner with remote work agencies, freelancing coaches, and trusted account providers worldwide.
          </p>
          <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/20">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}
