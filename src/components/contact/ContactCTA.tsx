import React from 'react'
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const ContactCTA: React.FC = () => {
  const handleScrollToForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const element = document.getElementById('contact-form-anchor')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 py-32 text-white">
      {/* Deep Indigo Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[800px] w-[1200px] -translate-x-1/2 rounded-full bg-indigo-600/20 mix-blend-screen blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 font-heading text-5xl font-black tracking-tight md:text-7xl">
          Get Assisted in <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Real Time.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-400">
          Join the standard for digital asset trading. Open a secure ticket or join the Telegram ecosystem.
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <a
            href="https://t.me/+mm7Rk9WkcHc0ZTBk"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-14 items-center gap-2 rounded-xl bg-sky-500 px-8 text-lg font-bold text-white shadow-xl shadow-sky-500/20 transition-all hover:scale-105"
          >
            Join Telegram Community
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <button
            onClick={handleScrollToForm}
            className="flex h-14 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10"
          >
            Open Support Ticket
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Escrow Protected Disputes
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Human Operators
          </div>
        </div>
      </div>
    </section>
  )
}
