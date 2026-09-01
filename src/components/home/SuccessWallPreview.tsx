import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle2 } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const successStories = [
  { name: 'David M.', country: '🇺🇸', platform: 'Upwork', monthlyIncome: 8500000, niche: 'Mobile Dev', accountAge: '4 Years' },
  { name: 'Elena R.', country: '🇪🇸', platform: 'Fiverr', monthlyIncome: 4200000, niche: 'Illustration', accountAge: '2 Years' },
  { name: 'Ahmad K.', country: '🇦🇪', platform: 'Toptal', monthlyIncome: 12000000, niche: 'Data Science', accountAge: '5 Years' },
  { name: 'Sarah J.', country: '🇬🇧', platform: 'Upwork', monthlyIncome: 6300000, niche: 'Copywriting', accountAge: '3 Years' },
]

export const SuccessWallPreview: React.FC = () => {
  return (
    <section className="overflow-hidden bg-slate-950 py-32">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="mb-4 font-heading text-4xl font-black tracking-tight text-white md:text-5xl">
          Real Results. Real Revenue.
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-lg font-medium text-slate-400 px-4">
          Our buyers are generating millions in monthly revenue using acquired remote assets.
        </p>

        {/* Carousel Container */}
        <div className="relative mx-auto flex w-full max-w-6xl gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory">
          {successStories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springs.gentle, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative w-80 shrink-0 snap-center rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-6 text-left shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-white/10 hover:bg-slate-900/60"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl shadow-inner border border-white/5">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{story.name} {story.country}</h3>
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 rounded-2xl border border-white/5 bg-slate-950/80 p-4 shadow-inner">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Monthly Rev
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-heading text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight whitespace-nowrap">
                    ₦{story.monthlyIncome.toLocaleString()}
                  </span>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Platform</p>
                  <p className="font-bold text-white">{story.platform}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Niche</p>
                  <p className="font-bold text-white">{story.niche}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
