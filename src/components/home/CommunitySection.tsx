import React from 'react'
import { motion } from 'framer-motion'
import { Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import { springs } from '@/lib/framer-physics'
// In a real app we might fetch the actual member count from the CMS or an API
// For now, we simulate fetching it
import { useGlobalStats } from '@/services/cms/cms.store'

export const CommunitySection: React.FC = () => {
  const stats = useGlobalStats()
  const memberCount = parseInt(stats.users.replace(/[^0-9]/g, ''), 10) || 0

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-24 sm:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950"></div>
      
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            The Private Network
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-xl text-slate-400 px-2 sm:px-0">
            Join the most exclusive remote work marketplace community. 
            Connect directly with verified buyers and elite sellers before listings go public.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={springs.gentle}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl md:p-12"
        >
          {/* Telegram glow */}
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px]"></div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0088cc] shadow-[0_0_40px_rgba(0,136,204,0.3)]">
                <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>

              <h3 className="mb-4 font-heading text-3xl font-black text-white">
                Official Telegram Group
              </h3>

              <div className="mb-8 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <img 
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-slate-900 object-cover" 
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt="Member"
                    />
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-white">
                    {memberCount.toLocaleString()}+ Members
                  </p>
                  <p className="text-sm text-blue-400">1,200+ Online Now</p>
                </div>
              </div>

              <a
                href="https://t.me/+mm7Rk9WkcHc0ZTBk"
                target="_blank"
                rel="noreferrer"
                className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#0088cc] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#0088cc]/20 transition-all hover:-translate-y-1 hover:shadow-[#0088cc]/40 active:scale-95"
              >
                Join Telegram Community
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="mb-1 font-bold text-white">Early Access to Listings</h4>
                  <p className="text-sm text-slate-400">Get notified of premium accounts 24 hours before they hit the public marketplace.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="mb-1 font-bold text-white">Direct Verification</h4>
                  <p className="text-sm text-slate-400">Chat directly with sellers and our moderation team to verify claims before initiating escrow.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="mb-1 font-bold text-white">Networking & Advice</h4>
                  <p className="text-sm text-slate-400">Learn strategies from buyers who are currently earning ₦1.5M+/month from purchased accounts.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
