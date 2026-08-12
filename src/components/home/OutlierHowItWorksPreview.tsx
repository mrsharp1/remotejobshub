import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const OutlierHowItWorksPreview: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-16 sm:py-24 border-b border-white/5">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />
      
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="rounded-[2.5rem] border border-white/5 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl sm:p-12 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-[200px] w-[200px] translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-500/20 blur-[60px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-inner">
              <BookOpen className="h-8 w-8" />
            </div>
            
            <h2 className="mb-4 font-heading text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              Outlier & Handshake AI <br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Learn what these AI work platforms are, what kind of tasks you may perform, how earnings work, what beginners need to know, account eligibility, withdrawals, and what to understand before purchasing an account.
            </p>
            
            <Link
              to="/how-it-works"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-5 text-lg font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-95 sm:w-auto"
            >
              Learn How It Works <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
