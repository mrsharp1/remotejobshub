import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

const sellers = [
  { name: 'DevStudioPro', type: 'Agency', trust: 99, response: '< 1 hr', completion: '100%', avatar: 'D', verified: true, elite: true },
  { name: 'DesignMasters', type: 'Studio', trust: 98, response: '< 2 hrs', completion: '99%', avatar: 'M', verified: true, elite: false },
  { name: 'DataTechSolutions', type: 'Agency', trust: 100, response: '< 30 min', completion: '100%', avatar: 'T', verified: true, elite: true },
]

export const FeaturedSellers: React.FC = () => {
  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Elite Sellers
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg font-medium text-slate-400 px-2 sm:px-0">
            Work with established agencies and freelancers who have proven track records of successful account transfers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {sellers.map((seller, i) => (
            <motion.div
              key={seller.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ ...springs.gentle, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-white/10 hover:bg-slate-900/60"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-2xl font-bold text-white shadow-inner border border-white/10">
                    {seller.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-1">
                      {seller.name}
                      {seller.verified && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </h3>
                    <p className="text-sm font-medium text-slate-400">{seller.type}</p>
                  </div>
                </div>
                {seller.elite && (
                  <div className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">
                    <Award className="h-3 w-3" /> Elite
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-slate-950/80 p-4 text-center shadow-inner">
                <div>
                  <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-indigo-400" />
                  <p className="text-lg font-black text-white">{seller.trust}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trust Score</p>
                </div>
                <div>
                  <Clock className="mx-auto mb-1 h-4 w-4 text-blue-400" />
                  <p className="text-lg font-black text-white">{seller.response}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Response</p>
                </div>
                <div>
                  <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
                  <p className="text-lg font-black text-white">{seller.completion}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Success</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
