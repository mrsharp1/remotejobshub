import React from 'react'
import { Award, Zap, Diamond, TrendingUp, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { springs } from '@/lib/framer-physics'

export const MarketplaceHighlights: React.FC = () => {
  const highlights = [
    {
      title: 'Top Sellers This Week',
      description: 'Discover accounts from our highest-rated verified sellers.',
      icon: Award,
      color: 'text-amber-300',
      bg: 'bg-amber-500/10 border-amber-500/20',
      link: '/marketplace?seller_verified=true&sort=rating',
    },
    {
      title: 'Best Value Listings',
      description: 'High-earning accounts with the fastest ROI payback period.',
      icon: Zap,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      link: '/marketplace?sort=best-value',
    },
    {
      title: "Editor's Picks",
      description: 'Premium, aged accounts hand-picked by our moderation team.',
      icon: Diamond,
      color: 'text-indigo-300',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      link: '/marketplace?featured=true',
    },
    {
      title: 'Trending Platforms',
      description:
        'The most sought-after platforms right now: Outlier & DataAnnotation.',
      icon: TrendingUp,
      color: 'text-rose-300',
      bg: 'bg-rose-500/10 border-rose-500/20',
      link: '/marketplace?platforms=Outlier,DataAnnotation,Scale%20AI,TELUS,Appen',
    },
  ]

  return (
    <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {highlights.map((highlight) => (
        <Link
          key={highlight.title}
          to={highlight.link}
          className="group relative block outline-none"
        >
          <motion.div
            whileHover={{ y: -6, transition: springs.gentle }}
            className="flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="relative z-10">
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${highlight.bg} shadow-inner backdrop-blur-md`}
              >
                <highlight.icon className={`h-6 w-6 ${highlight.color}`} />
              </div>
              <h3 className="mb-2 font-heading text-base font-bold text-white transition-colors group-hover:text-indigo-300">
                {highlight.title}
              </h3>
              <p className="text-xs font-medium leading-relaxed text-slate-400">
                {highlight.description}
              </p>
            </div>
            
            <div className="relative z-10 mt-6 flex items-center">
              <span className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-400 opacity-80 transition-all group-hover:bg-indigo-500/20 group-hover:opacity-100 group-hover:text-indigo-300">
                Explore now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
