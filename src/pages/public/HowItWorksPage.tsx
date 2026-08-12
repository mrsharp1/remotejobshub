import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, AlertTriangle, Shield, Wallet, BookOpen, Smartphone, Globe, ArrowRight, Zap, RefreshCw } from 'lucide-react'
import { springs } from '@/lib/framer-physics'
import { SEO } from '@/components/common/SEO'

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 pb-20 pt-28 selection:bg-indigo-500/30 font-sans">
      <SEO 
        title="Outlier & Handshake AI — How It Works | Remote Jobs Hub"
        description="Learn how Outlier and Handshake AI work platforms operate, what tasks users may complete, how earnings work, account eligibility, withdrawals and what to understand before getting started."
      />
      
      {/* Hero Section */}
      <section className="relative px-4 pb-16 pt-8 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/20 mix-blend-screen blur-[100px]" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 backdrop-blur-md">
              <Zap className="h-4 w-4" />
              Information Guide
            </div>
            <h1 className="mb-6 font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Outlier & Handshake AI <br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Learn what these AI work platforms are, what kind of tasks you may perform, how earnings work, account eligibility, withdrawals, and what to understand before getting started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="mx-auto max-w-4xl px-4 space-y-8 sm:space-y-12">
        
        {/* 3. INTRODUCTION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-inner">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="mb-4 font-heading text-2xl font-bold text-white sm:text-3xl">What Are Outlier and Handshake AI?</h2>
          <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            <p>
              Outlier and Handshake AI are platforms where people can work on projects that help companies improve artificial intelligence.
            </p>
            <p>
              In simple terms, AI needs people to check its work and tell it when something is right or wrong. That is where these types of tasks come in.
            </p>
          </div>
        </motion.section>

        {/* 4. TASKS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 shadow-inner">
            <CheckCircle className="h-7 w-7" />
          </div>
          <h2 className="mb-4 font-heading text-2xl font-bold text-white sm:text-3xl">What Will You Be Doing?</h2>
          <p className="mb-6 text-slate-300 text-sm sm:text-base leading-relaxed">Your work may include simple AI-related tasks such as:</p>
          <ul className="mb-8 grid gap-3 sm:grid-cols-2">
            {[
              'Reading AI-generated answers',
              'Checking if the answer is correct or useful',
              'Giving the response a quality rating',
              'Finding and correcting mistakes',
              'Comparing different AI answers',
              'Completing other AI evaluation assignments'
            ].map((task, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm font-medium text-indigo-200">
            <strong>Beginner Friendly:</strong> You do not need programming or coding skills for these types of tasks.
          </div>
        </motion.section>

        {/* 5. EARNINGS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-inner">
            <Wallet className="h-7 w-7" />
          </div>
          <h2 className="mb-4 font-heading text-2xl font-bold text-white sm:text-3xl">How Much Can You Earn?</h2>
          <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            <p>
              Payment is usually based on the project and the type of task you qualify for.
            </p>
            <p>
              Some projects may advertise rates of approximately <strong>$50–$200 per hour</strong>. However, this is not guaranteed income or a fixed salary.
            </p>
            <div>
              <p className="mb-3 font-semibold text-white">Actual earnings depend on:</p>
              <ul className="ml-6 list-disc space-y-1 text-slate-400">
                <li>Your qualifications</li>
                <li>Available projects</li>
                <li>The amount of work you complete</li>
                <li>Task availability</li>
                <li>The platform's current rates</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 flex gap-4">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />
            <p className="text-sm font-medium text-amber-200">
              <strong className="text-amber-400">Important:</strong> Earnings are not guaranteed. Rates, task availability and eligibility can change.
            </p>
          </div>
        </motion.section>

        {/* 6. BEGINNERS & 11. REQUIREMENTS */}
        <div className="grid gap-8 sm:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springs.gentle}
            className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <h2 className="mb-4 font-heading text-xl font-bold text-white">What If You Are a Beginner?</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              You don't need to already know how everything works. If you're new, you'll be added to our training group where you'll receive guidance on:
            </p>
            <ul className="space-y-2 text-sm text-slate-400 mb-4">
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> How the platform works</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> How to access and complete tasks</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> How to understand different assignments</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> How earnings are calculated</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> How the withdrawal process works</li>
            </ul>
            <p className="text-sm text-slate-300 font-medium">
              We also provide practical lessons so you can learn the process step by step.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ ...springs.gentle, delay: 0.1 }}
            className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <h2 className="mb-4 font-heading text-xl font-bold text-white">What Do You Need?</h2>
            <div className="mb-4 flex gap-4">
              <div className="flex h-12 flex-1 flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <Smartphone className="mb-1 h-5 w-5" />
                <span className="text-xs font-semibold">Smartphone</span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center text-sm font-bold text-slate-500">OR</div>
              <div className="flex h-12 flex-1 flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <Smartphone className="mb-1 h-5 w-5" />
                <span className="text-xs font-semibold">Laptop</span>
              </div>
            </div>
            <p className="mb-3 text-sm font-semibold text-white">You should also have:</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> A reliable internet connection</li>
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Time to learn</li>
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Time to complete available tasks</li>
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> A willingness to follow the platform's requirements</li>
            </ul>
          </motion.section>
        </div>

        {/* 7. ACCOUNT ACCESS & 8. CONNECTION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-white">Account Access</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                Some AI projects have location and eligibility requirements, and availability can vary by country.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                For eligible users who need assistance with account access, we can explain the available options, including UK and USA arrangements through our sellers.
              </p>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs leading-relaxed text-rose-200">
                <strong>Disclaimer:</strong> Account availability does not mean that everyone is automatically eligible for every project. You must still meet the platform's requirements and applicable verification rules.
              </div>
            </div>
            
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-white">How Is the Connection Set Up?</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                After an account arrangement is completed, the seller will explain how to connect to the required environment/server.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                Where a connection configuration is legitimately part of the arrangement, the seller may provide the configuration needed for the connection.
              </p>
              <p className="text-sm font-medium text-indigo-300">
                If you have questions about the setup, contact our support team.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 9. WITHDRAWALS & 10. SELLER PAYMENT */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-heading text-xl font-bold text-emerald-400">Weekly Withdrawals</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                Once you complete eligible tasks and your earnings become available for withdrawal, payments may be withdrawn according to the platform's withdrawal schedule.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                For our setup, weekly withdrawals are intended to be made to PayPal, subject to the platform's available payment options and your account eligibility.
              </p>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-sm font-medium text-white mb-1">Don't have a PayPal account?</p>
                <p className="text-sm text-slate-400">No problem. Contact our support team and we can guide you through the process of creating and setting up a PayPal account where available.</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-heading text-xl font-bold text-white">How Does the Seller Get Paid?</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                The seller provides the account/access arrangement and related support, so there is a revenue-sharing agreement.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">
                This means you may share an agreed percentage of your earnings with the seller. The exact percentage depends on the agreement made before you proceed.
              </p>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-medium text-amber-200">
                <strong>Warning:</strong> Always understand the revenue-sharing percentage and all terms before making a payment or accepting an arrangement.
              </div>
            </div>
          </div>
        </motion.section>

        {/* 12. IMPORTANT (Trust/Warning Section) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="rounded-[2rem] border border-rose-500/30 bg-rose-500/10 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="mb-6 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
            <h2 className="font-heading text-2xl font-bold text-white">Important Things to Know</h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-rose-100/90">
            <p>AI projects are not guaranteed to be available at all times.</p>
            <p>Your earnings can change depending on:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Your qualifications</li>
              <li>Available projects</li>
              <li>Task volume</li>
              <li>Your completed work</li>
              <li>Platform rates</li>
              <li>Platform eligibility requirements</li>
            </ul>
            <p className="pt-2 font-bold text-white">
              Please only proceed if you are prepared to learn, dedicate time to the work, and follow the agreed terms.
            </p>
          </div>
        </motion.section>

        {/* 13. AVAILABILITY & 14. REGISTERED BUSINESS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springs.gentle}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-6 py-2 backdrop-blur-md">
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" style={{ animationDuration: '3s' }} />
            <span className="text-sm font-bold text-indigo-300">Limited Availability: We currently have a limited number of seller account arrangements available.</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/50 px-6 py-3">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              🇳🇬 Registered Nigerian Business &bull; BN: 2953697
            </p>
          </div>
        </motion.div>

        {/* 15. CTA SECTION */}
        <div className="grid gap-4 sm:grid-cols-2 pt-8">
          <Link
            to="/marketplace"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-95"
          >
            Browse Available Accounts <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-slate-700 hover:shadow-xl active:scale-95 border border-white/5"
          >
            Need Help?
          </Link>
        </div>

      </div>
    </div>
  )
}
