import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, PlayCircle, Download } from 'lucide-react'

export const InteractiveJourneyPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const steps = [
    {
      title: 'Create Account',
      description: 'Sign up for Remote Jobs Hub and complete your basic profile.',
      duration: '2 mins',
      tips: 'Use your primary email address for important escrow notifications.'
    },
    {
      title: 'Browse Marketplace',
      description: 'Search through hundreds of verified remote work accounts and filter by country, platform, and earnings.',
      duration: '10 mins',
      tips: 'Look for the "Verified Seller" badge for the safest transactions.'
    },
    {
      title: 'Purchase & Escrow',
      description: 'Click buy and submit your payment. Your funds are locked safely in our Escrow vault.',
      duration: 'Instant',
      tips: 'We accept Paystack-secured payments via debit/credit card and bank transfer (NGN only).'
    },
    {
      title: 'Account Delivery',
      description: 'The seller securely transfers the account credentials and any associated emails/phone numbers via the encrypted order chat.',
      duration: '1-12 hours',
      tips: 'Never accept credentials outside of the Remote Jobs Hub platform.'
    },
    {
      title: 'Security Setup',
      description: 'Log in with your VPN/Proxy and immediately change the password and recovery emails.',
      duration: '15 mins',
      tips: 'Read our VPN Guide before your first login to avoid immediate bans.'
    },
    {
      title: 'Release Funds',
      description: 'Once you are 100% satisfied and the account is secure, release the funds to the seller from your dashboard.',
      duration: 'Instant',
      tips: 'You have up to 3 days to inspect the account before auto-release.'
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      <section className="bg-primary text-white py-20 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">The Buyer Journey</h1>
          <p className="text-xl text-primary-foreground/80">
            A step-by-step interactive guide on how to safely purchase and secure a remote work account.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row gap-12">
          
          {/* Stepper Navigation */}
          <div className="md:w-1/3 shrink-0">
            <div className="sticky top-24 bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold font-heading mb-6 text-lg">Journey Progress</h3>
              <div className="space-y-4 relative">
                <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-border -z-10" />
                {steps.map((step, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="flex items-start gap-4 w-full text-left group"
                  >
                    <div className="bg-card py-1">
                      {idx <= activeStep ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className={`py-1 transition-colors ${idx === activeStep ? 'text-foreground font-bold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {step.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Step Content */}
          <div className="md:w-2/3">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6 border-b pb-6">
                <div>
                  <div className="text-sm font-bold text-primary tracking-wider uppercase mb-2">Step {activeStep + 1}</div>
                  <h2 className="text-3xl font-bold font-heading">{steps[activeStep].title}</h2>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Estimated Duration</div>
                  <div className="font-bold">{steps[activeStep].duration}</div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-lg leading-relaxed">{steps[activeStep].description}</p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                  <span className="font-bold text-lg">!</span>
                </div>
                <div>
                  <h4 className="font-bold text-amber-700 dark:text-amber-500 mb-1">Pro Tip</h4>
                  <p className="text-amber-700/80 dark:text-amber-500/80 text-sm">{steps[activeStep].tips}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t">
                <button className="flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-muted transition-colors font-medium">
                  <PlayCircle className="w-5 h-5 text-primary" /> Watch Video Tutorial
                </button>
                <button className="flex items-center justify-center gap-2 p-4 border rounded-xl hover:bg-muted transition-colors font-medium">
                  <Download className="w-5 h-5 text-primary" /> Download Checklist
                </button>
              </div>

              <div className="mt-8 flex justify-between">
                <button 
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="px-6 py-2 border rounded-lg font-medium disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  )
}
