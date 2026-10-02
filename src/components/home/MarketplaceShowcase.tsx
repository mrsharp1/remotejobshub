import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Scale, Cpu, ShieldCheck, Star, Sparkles, ArrowRight } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const sampleListings = [
  {
    id: '1',
    title: 'Top Rated Plus Upwork Agency Account',
    niche: 'Web Development',
    price: 15000,
    monthlyRevenue: 5000000,
    riskScore: 99,
    avatar: 'A',
    seller: 'AlexDev',
    rating: 5.0,
    featured: true,
  },
  {
    id: '2',
    title: 'Level 2 Fiverr Seller - Logo Design',
    niche: 'Graphic Design',
    price: 8500,
    monthlyRevenue: 3000000,
    riskScore: 95,
    avatar: 'S',
    seller: 'StudioPixel',
    rating: 4.9,
    editorsChoice: true,
  },
  {
    id: '3',
    title: 'Aged Toptal Developer Profile',
    niche: 'Backend Engineering',
    price: 25000,
    monthlyRevenue: 7500000,
    riskScore: 98,
    avatar: 'D',
    seller: 'DataNinja',
    rating: 5.0,
  }
]

export const MarketplaceShowcase: React.FC = () => {
  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
          <div>
            <h2 className="font-heading text-3xl font-black tracking-tight text-white md:text-5xl">
              Curated Premium Assets
            </h2>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-400">
              Only the highest quality, revenue-generating accounts make it to our marketplace.
              Every listing is rigorously verified.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md px-8 py-4 text-sm sm:text-base font-bold text-white transition-all hover:border-white/20 hover:bg-slate-800 active:scale-95"
          >
            View All Listings
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleListings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springs.gentle, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-1 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/10"
            >
              {/* Outer Glow on Hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="flex h-full flex-col rounded-[22px] bg-slate-950/80 p-6 backdrop-blur-sm">
                {/* Header / Badges */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex flex-wrap gap-2">
                    {listing.featured && (
                      <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </span>
                    )}
                    {listing.editorsChoice && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20">
                        <Sparkles className="h-3 w-3" /> Editor's Choice
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                      <Scale className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-rose-400">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6 flex-1">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {listing.niche}
                  </p>
                  <h3 className="mb-4 font-heading text-xl font-bold leading-snug text-white line-clamp-2">
                    {listing.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-slate-900/30 p-4 shadow-inner">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Asking Price</p>
                      <p className="font-heading text-lg font-black text-white">
                        ₦{listing.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Monthly Rev</p>
                      <p className="font-heading text-lg font-black text-emerald-400">
                        ₦{listing.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-inner">
                      {listing.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-300">{listing.seller}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{listing.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <Cpu className="h-3 w-3 text-purple-400" />
                      Risk Score: <span className="text-white">{listing.riskScore}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <ShieldCheck className="h-3 w-3 text-indigo-400" />
                      Escrow Vault
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
