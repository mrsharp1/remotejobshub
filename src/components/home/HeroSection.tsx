import React, { useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowRight, Lock, Shield, Cpu, Activity, BadgeCheck, CheckCircle2 } from 'lucide-react'
import { useHomepageContent } from '@/services/cms/cms.store'

export const HeroSection: React.FC = () => {
  const data = useHomepageContent()

  // Parallax / mouse movement effect for floating elements
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const floatX1 = useTransform(mouseX, [-500, 500], [-15, 15])
  const floatY1 = useTransform(mouseY, [-500, 500], [-15, 15])
  const floatX2 = useTransform(mouseX, [-500, 500], [20, -20])
  const floatY2 = useTransform(mouseY, [-500, 500], [20, -20])
  const floatX3 = useTransform(mouseX, [-500, 500], [-10, 10])
  const floatY3 = useTransform(mouseY, [-500, 500], [15, -15])

  return (
    <section className="relative min-h-[100vh] sm:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-slate-950 px-4 pb-20 pt-32 sm:pb-32 sm:pt-40 lg:pt-48">
      {/* Animated Gradient Mesh Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/80 to-slate-950"></div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-[10%] top-0 h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-[10%] top-1/4 h-[700px] w-[700px] rounded-full bg-purple-600/10 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mb-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <Lock className="h-3.5 w-3.5" />
                Escrow Protected
              </div>
              <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5" />
                KYC Verified
              </div>
              <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md hidden sm:flex">
                <Cpu className="h-3.5 w-3.5" />
                AI Risk Score
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="font-heading text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight text-white md:text-6xl xl:text-7xl drop-shadow-2xl"
            >
              {data?.hero.headline || 'Trade Verified Digital Assets Instantly'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 max-w-xl text-base sm:text-lg text-slate-300 mx-auto lg:mx-0 leading-relaxed"
            >
              {data?.hero.subheadline || 'The enterprise escrow standard for secure credential delivery. Buy and sell with total confidence.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                to="/marketplace"
                className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                {data?.hero.ctaText || 'Browse Marketplace'} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                to="/register"
                className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                Become a Seller
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Floating Dashboard UI */}
          <div className="relative hidden lg:block">
            <motion.div 
              style={{ x: floatX1, y: floatY1 }}
              className="absolute left-1/2 top-1/2 -ml-[250px] -mt-[250px] w-[500px] rounded-[2rem] border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-2xl xl:w-[600px] xl:-ml-[300px]"
            >
              {/* Mock Dashboard Header */}
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Active Escrow</h3>
                    <p className="text-xs font-medium text-slate-400">Transaction #8992</p>
                  </div>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
                  Secured Vault
                </div>
              </div>
              
              {/* Mock Dashboard Body */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5 shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-400">Upwork Top Rated Account</span>
                    <span className="text-lg font-black text-white">₦4,500,000</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800/50 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[65%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                  </div>
                  <div className="mt-3 flex justify-between text-xs font-medium text-slate-500">
                    <span>Funds Locked in Escrow</span>
                    <span className="text-indigo-400">Awaiting Transfer</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Risk Score</span>
                    </div>
                    <span className="text-3xl font-black text-white">99<span className="text-lg text-slate-600">/100</span></span>
                    <p className="mt-1 text-xs font-medium text-emerald-400">Extremely Safe</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Seller Status</span>
                    </div>
                    <span className="text-3xl font-black text-white">&lt; 5m</span>
                    <p className="mt-1 text-xs font-medium text-emerald-400">Online Now</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Mini Cards */}
            <motion.div
              style={{ x: floatX2, y: floatY2 }}
              className="absolute -left-10 top-20 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Identity Verified</p>
                  <p className="text-xs font-medium text-slate-400">Jumio KYC Passed</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ x: floatX3, y: floatY3 }}
              className="absolute -right-5 bottom-10 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm font-bold text-white">Revenue Verified</p>
                  <p className="text-xs text-slate-400">₦2.5M/mo Proven</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
