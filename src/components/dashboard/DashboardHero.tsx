import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, User } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

interface DashboardHeroProps {
  fullName?: string
  role?: string
  isVerified?: boolean
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  fullName = 'Operator',
  role = 'Buyer',
  isVerified = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className="relative overflow-hidden rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl md:p-12"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[80px]" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
            <User className="h-8 w-8 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-1 font-heading text-3xl font-black md:text-4xl">
              {fullName}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold capitalize text-slate-300">
              {role} Workspace
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
