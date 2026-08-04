import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'

export const PricingCTA: React.FC = () => {
  const { globalStats } = useCMSStore()

  return (
    <section className="relative overflow-hidden bg-slate-950 py-32 text-white">
      {/* Deep Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-indigo-600/20 mix-blend-screen blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 font-heading text-5xl font-black tracking-tight md:text-7xl">
          Start Trading With <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Zero Risk.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-400">
          Join the {globalStats.escrowVolume} trusted marketplace. Create your free account today and upgrade only when you are ready to scale.
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Link
            to="/register"
            className="group flex h-14 items-center gap-2 rounded-xl bg-white px-8 text-lg font-bold text-slate-900 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:bg-slate-100"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/marketplace"
            className="flex h-14 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10"
          >
            Browse Listings
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Escrow Protected
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            No Hidden Fees
          </div>
        </div>
      </div>
    </section>
  )
}
