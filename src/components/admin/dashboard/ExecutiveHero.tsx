import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  AlertOctagon,
  TrendingUp,
  FileCheck,
  Calendar,
  Clock,
  Server,
  Database,
  HardDrive,
  Mail,
  Zap,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  BarChart2
} from 'lucide-react'

interface ExecutiveHeroProps {
  fullName: string;
  formattedDate: string;
  formattedTime: string;
  pendingKyc: number;
  disputes: number;
  pendingListings: number;
  pendingWithdrawals: number;
}

export const ExecutiveHero: React.FC<ExecutiveHeroProps> = React.memo(({
  fullName,
  formattedDate,
  formattedTime,
  pendingKyc,
  disputes,
  pendingListings,
  pendingWithdrawals,
}) => {
  // Mobile swipe index for modules
  const [activeMobileModuleIndex, setActiveMobileModuleIndex] = useState(0)

  // Workstation Status Ribbon
  const services = [
    { name: 'Core API', status: 'Operational', latency: '12ms', icon: Server, color: 'bg-emerald-500 shadow-emerald-500/20' },
    { name: 'Database Pool', status: 'Operational', latency: '9ms', icon: Database, color: 'bg-emerald-500 shadow-emerald-500/20' },
    { name: 'Escrow Vault', status: 'Operational', latency: 'Active', icon: Layers, color: 'bg-emerald-500 shadow-emerald-500/20' },
    { name: 'Realtime WS', status: 'Connected', latency: '14ms', icon: Zap, color: 'bg-emerald-500 shadow-emerald-500/20' },
    { name: 'SMTP Mailer', status: 'Healthy', latency: '0 backlog', icon: Mail, color: 'bg-emerald-500 shadow-emerald-500/20' },
    { name: 'Storage Node', status: 'Healthy', latency: '94.2%', icon: HardDrive, color: 'bg-emerald-500 shadow-emerald-500/20' },
  ]

  // Large premium command modules (Visual focus, 220px-260px tall)
  const modules = [
    {
      title: 'Pending KYC Reviews',
      value: pendingKyc,
      subtitle: 'COMPLIANCE AUDITS',
      desc: 'Active identity verification queues awaiting administrative clearance.',
      icon: ShieldAlert,
      color: 'text-indigo-400',
      glow: 'shadow-indigo-500/5 border-indigo-500/10 bg-indigo-950/10 hover:border-indigo-500/30',
      radialColor: 'from-indigo-500/10 to-transparent',
      borderColor: 'group-hover:border-indigo-500/40',
      accentColor: 'bg-indigo-400',
    },
    {
      title: 'Platform Disputes',
      value: disputes,
      subtitle: 'ESCROW MEDIATION',
      desc: 'Escrow dispute tickets raised by contract participants.',
      icon: AlertOctagon,
      color: 'text-rose-400',
      glow: 'shadow-rose-500/5 border-rose-500/10 bg-rose-950/10 hover:border-rose-500/30',
      radialColor: 'from-rose-500/10 to-transparent',
      borderColor: 'group-hover:border-rose-500/40',
      accentColor: 'bg-rose-400',
    },
    {
      title: 'Jobs Review Queue',
      value: pendingListings,
      subtitle: 'CONTENT MODERATION',
      desc: 'Listing submissions pending approval from moderators.',
      icon: FileCheck,
      color: 'text-amber-400',
      glow: 'shadow-amber-500/5 border-amber-500/10 bg-amber-950/10 hover:border-amber-500/30',
      radialColor: 'from-amber-500/10 to-transparent',
      borderColor: 'group-hover:border-amber-500/40',
      accentColor: 'bg-amber-400',
    },
    {
      title: 'Payout Requests',
      value: pendingWithdrawals,
      subtitle: 'ESCROW PAYOUTS',
      desc: 'Pending vendor and partner withdrawals in queue.',
      icon: TrendingUp,
      color: 'text-emerald-400',
      glow: 'shadow-emerald-500/5 border-emerald-500/10 bg-emerald-950/10 hover:border-emerald-500/30',
      radialColor: 'from-emerald-500/10 to-transparent',
      borderColor: 'group-hover:border-emerald-500/40',
      accentColor: 'bg-emerald-400',
    },
  ]

  const nextModule = () => {
    setActiveMobileModuleIndex((prev) => (prev + 1) % modules.length)
  }

  const prevModule = () => {
    setActiveMobileModuleIndex((prev) => (prev - 1 + modules.length) % modules.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 14 }}
      className="relative min-h-[640px] lg:min-h-[680px] overflow-hidden rounded-[48px] border border-slate-800/80 bg-gradient-to-b from-[#0b0e14] via-[#040609] to-[#0b0e14] p-8 md:p-12 lg:p-14 text-white shadow-2xl flex flex-col justify-between"
    >
      {/* Luxury Layered Background & Mesh Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        {/* Layer 1: Massive Blurred Mesh Lights */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-60 -left-60 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-[180px] mix-blend-screen"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 60, 0],
            scale: [1.2, 0.9, 1.2],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-60 -right-60 w-[900px] h-[900px] rounded-full bg-destructive/5 blur-[200px] mix-blend-screen"
        />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/5 blur-[160px] mix-blend-screen" />

        {/* Layer 2: Cybernetic Fine Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_80%,transparent_100%)] opacity-35" />

        {/* Layer 3: Animated Floating Ambient Particles */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={i}
              cx={`${10 + i * 16}%`}
              cy={`${40 + (i % 3) * 20}%`}
              r={2 + (i % 2)}
              fill="#818cf8"
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>

        {/* Layer 4: Glass reflection layers */}
        <div className="absolute inset-0 rounded-[48px] border border-white/[0.02] pointer-events-none" />
      </div>

      {/* Main Workstation Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch w-full flex-1">
        {/* Left Column (45% Width): Greeting & Executive Action Buttons */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20 self-start inline-block">
              PLATFORM KERNEL ONLINE
            </span>
            <div className="space-y-1.5 pt-1">
              <h2 className="text-slate-400 font-bold uppercase tracking-widest text-xs md:text-sm">
                GOOD EVENING
              </h2>
              <h1 className="font-heading text-5xl md:text-[62px] font-black leading-none tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-450 bg-clip-text text-transparent py-1">
                Administrator
              </h1>
              <h2 className="text-indigo-300 font-medium text-lg md:text-xl tracking-wide">
                Remote Jobs Hub Operations
              </h2>
            </div>
          </div>

          <p className="text-slate-400 text-xs md:text-sm font-medium tracking-wide leading-relaxed max-w-sm">
            Platform operations are stable. Review today's intelligence, user compliance queries, and pending escrow actions.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <motion.a
              href="/admin/verification"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12.5 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-xs font-bold text-slate-950 shadow-lg shadow-white/5 transition duration-300 hover:bg-slate-100"
            >
              Review Platform <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="/admin/analytics"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12.5 items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-6 text-xs font-bold text-white transition duration-300 hover:bg-slate-900/60 hover:border-slate-700"
            >
              View Live Analytics <BarChart2 className="h-4 w-4" />
            </motion.a>
          </div>
        </div>

        {/* Center (40% Width): Large Floating Command Modules */}
        <div className="lg:col-span-4 flex items-center w-full">
          {/* Desktop/Tablet Grid View */}
          <div className="hidden sm:grid grid-cols-2 gap-5 w-full">
            {modules.map((mod, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className={`group relative overflow-hidden rounded-[28px] border p-6 min-h-[220px] lg:min-h-[240px] flex flex-col justify-between transition-all duration-300 ${mod.glow}`}
              >
                {/* Accent glow on hover */}
                <div className={`absolute -right-10 -bottom-10 w-28 h-28 rounded-full opacity-5 group-hover:opacity-15 blur-2xl transition-opacity duration-300 ${mod.accentColor}`} />
                
                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl p-3 bg-slate-950 border border-slate-800/80 ${mod.color} shrink-0`}>
                    <mod.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                    {mod.subtitle}
                  </span>
                </div>

                <div className="space-y-1 mt-6">
                  <span className="block font-heading text-4xl lg:text-[42px] font-black tracking-tight text-white leading-none">
                    {mod.value}
                  </span>
                  <span className="block text-[10px] font-bold text-slate-300 tracking-wide mt-2">
                    {mod.title}
                  </span>
                  <p className="text-[9px] text-slate-500 font-medium leading-relaxed mt-1">
                    {mod.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Swipeable View */}
          <div className="sm:hidden relative w-full flex flex-col items-center">
            <div className="w-full min-h-[240px] flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMobileModuleIndex}
                  initial={{ opacity: 0, scale: 0.96, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: -30 }}
                  className={`w-full rounded-[28px] border p-6 min-h-[230px] flex flex-col justify-between relative ${modules[activeMobileModuleIndex].glow}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-2xl p-3 bg-slate-950 border border-slate-800/80 ${modules[activeMobileModuleIndex].color} shrink-0`}>
                      {React.createElement(modules[activeMobileModuleIndex].icon, { className: 'h-6 w-6' })}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                      {modules[activeMobileModuleIndex].subtitle}
                    </span>
                  </div>
                  <div className="space-y-1 mt-6">
                    <span className="block font-heading text-4xl font-black tracking-tight text-white leading-none">
                      {modules[activeMobileModuleIndex].value}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-350 tracking-wide mt-2">
                      {modules[activeMobileModuleIndex].title}
                    </span>
                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed mt-1">
                      {modules[activeMobileModuleIndex].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Mobile Navigation dots */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={prevModule}
                className="h-9 w-9 rounded-full border border-slate-800 bg-slate-950/80 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {modules.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeMobileModuleIndex ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextModule}
                className="h-9 w-9 rounded-full border border-slate-800 bg-slate-950/80 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Workstation panel console */}
        <div className="lg:col-span-3 flex items-center w-full">
          <div className="relative overflow-hidden rounded-[36px] border border-slate-800/80 bg-slate-950/65 p-6 shadow-2xl backdrop-blur-xl w-full">
            {/* Top glowing status ribbon segment */}
            <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 -m-1 rounded-2xl bg-gradient-to-tr from-indigo-500 via-rose-500 to-amber-500 opacity-30 blur-md" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#070b12] font-heading text-xl font-black text-white border border-white/10 shadow-2xl">
                  AD
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-lg animate-pulse" />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-black text-white leading-tight">
                  {fullName}
                </h3>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
                  Platform Operations Director
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 pt-5 border-t border-slate-900/60 text-[10px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-indigo-400" /> Date</span>
                <span className="font-semibold text-white truncate max-w-[125px]">{formattedDate}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-indigo-400" /> Live Clock</span>
                <span className="font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">{formattedTime}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5 text-indigo-400" /> Platform Uptime</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" /> 99.998%
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-indigo-400" /> Region</span>
                <span className="font-bold text-slate-200">EU-WEST (MOCK)</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-indigo-400" /> Auth State</span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[8px] font-black uppercase text-indigo-400">
                  SECURE LEVEL 4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar: Luxury status chips ribbon */}
      <div className="relative mt-10 pt-6 border-t border-slate-900/60 w-full z-10 select-none">
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar scroll-smooth w-full pb-1">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl bg-slate-950/50 border border-slate-900/80 hover:border-slate-800 px-4 py-2 shrink-0 text-[9px] font-bold text-slate-400 transition"
            >
              <svc.icon className="h-3 w-3 text-indigo-400 shrink-0" />
              <span>{svc.name}:</span>
              <span className="text-white font-mono font-black">{svc.latency}</span>
              <span className="flex items-center gap-1 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase">
                <span className={`h-1 w-1 rounded-full ${svc.color} shrink-0`} /> Operational
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
})
