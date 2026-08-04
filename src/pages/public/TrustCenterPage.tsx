import React, { useEffect, useState } from 'react'
import { ShieldCheck, Lock, UserCheck, Search, Handshake, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { platformService, PlatformStats } from '@/services/platform/platform.service'

export const TrustCenterPage: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    platformService.getLiveStats().then(setStats)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-sm"
            >
              <ShieldCheck className="w-4 h-4" /> The Most Trusted Marketplace
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold font-heading tracking-tight"
            >
              Your security is our <span className="text-primary">top priority.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Remote Jobs Hub uses enterprise-grade encryption, AI fraud detection, and 100% Escrow protection to ensure every transaction is secure.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Core Protections */}
      <section className="py-20 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-heading">Escrow Protection</h3>
              <p className="text-muted-foreground">Your money is held safely in Escrow until the account is fully delivered, inspected, and secured by you. The seller doesn't get paid until you are satisfied.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
                <UserCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-heading">Identity Verification</h3>
              <p className="text-muted-foreground">Every seller goes through strict KYC (Know Your Customer) identity checks. We verify passports, utility bills, and face scans to eliminate bad actors.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-heading">AI Scam Detection</h3>
              <p className="text-muted-foreground">Our proprietary AI scans every listing, chat message, and account history to instantly flag and remove suspicious behavior before it reaches you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-6">How Buyer Protection Works</h2>
            <p className="text-xl text-muted-foreground">A transparent, risk-free process designed to give you peace of mind.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border -z-10" />
              
              <div className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-background border-4 border-primary rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <Handshake className="w-10 h-10 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">1. Secure Payment</h4>
                <p className="text-sm text-muted-foreground">Funds are locked securely in our partnered Escrow vault.</p>
              </div>

              <div className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-background border-4 border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-xl font-bold mb-2">2. Full Inspection</h4>
                <p className="text-sm text-muted-foreground">You receive the account credentials to inspect the quality and history.</p>
              </div>

              <div className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-background border-4 border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <Lock className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-xl font-bold mb-2">3. Security Lock</h4>
                <p className="text-sm text-muted-foreground">You change the email, password, and recovery questions.</p>
              </div>

              <div className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-background border-4 border-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h4 className="text-xl font-bold mb-2">4. Release Funds</h4>
                <p className="text-sm text-muted-foreground">Only when you confirm full ownership do we release the funds to the seller.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Statistics (Will be hooked up to real DB in Phase 7) */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold font-heading mb-2">100%</div>
              <div className="text-primary-foreground/80 font-medium">Escrow Protected</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-heading mb-2">
                ₦{stats ? (stats.escrowVolume / 1000000).toFixed(1) + 'M+' : '...'}
              </div>
              <div className="text-primary-foreground/80 font-medium">Safe Transactions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-heading mb-2">
                {stats ? (100 - stats.buyerSatisfaction).toFixed(2) + '%' : '...'}
              </div>
              <div className="text-primary-foreground/80 font-medium">Fraud Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold font-heading mb-2">24/7</div>
              <div className="text-primary-foreground/80 font-medium">Support Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold font-heading mb-6">Need more details?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Check out our detailed guides on security, escrow, and platform policies.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/knowledge" className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Knowledge Base
            </Link>
            <Link to="/help" className="px-8 py-4 bg-background border border-border rounded-xl font-medium hover:bg-muted transition-colors text-foreground">
              Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
