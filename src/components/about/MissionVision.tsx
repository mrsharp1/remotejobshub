import React from 'react'
import { motion } from 'framer-motion'
import { Target, Lightbulb } from 'lucide-react'
import { springs } from '@/lib/framer-physics'
import { useAboutContent } from '@/services/cms/cms.store'

export const MissionVision: React.FC = () => {
  const { missionVision } = useAboutContent()
  
  return (
    <section className="bg-slate-950 px-4 py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50" />
      
      <div className="mx-auto w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...springs.gentle }}
            className="group relative flex flex-col h-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 sm:p-12 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/30 hover:bg-slate-900/60"
          >
            {/* Hover Gradient Glow */}
            <div className="absolute -right-32 -top-32 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[100px] transition-all duration-700 group-hover:bg-indigo-500/30" />
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.15)] group-hover:scale-110 transition-transform duration-500">
                <Target className="h-10 w-10" />
              </div>
              <h3 className="mb-6 font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
                Our Mission
              </h3>
              <div 
                className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: missionVision.mission }} 
              />
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...springs.gentle, delay: 0.1 }}
            className="group relative flex flex-col h-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 sm:p-12 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-slate-900/60"
          >
            {/* Hover Gradient Glow */}
            <div className="absolute -bottom-32 -left-32 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[100px] transition-all duration-700 group-hover:bg-blue-500/30" />
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform duration-500">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h3 className="mb-6 font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
                Our Vision
              </h3>
              <div 
                className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: missionVision.vision }} 
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
