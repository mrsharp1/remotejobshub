import React from 'react'
import { motion } from 'framer-motion'
import { Lock, CreditCard, Shield, RefreshCw, CheckCircle, Wallet } from 'lucide-react'
import { springs } from '@/lib/framer-physics'

export const MarketplaceHighlights: React.FC = () => {
  const steps = [
    {
      icon: CreditCard,
      title: '1. You Pay',
      desc: "Your payment enters the platform's protected transaction flow.",
    },
    {
      icon: Shield,
      title: '2. Funds Are Secured',
      desc: 'The seller does not immediately receive the payment.',
    },
    {
      icon: RefreshCw,
      title: '3. Account Handoff',
      desc: 'The seller completes the agreed account transfer.',
    },
    {
      icon: CheckCircle,
      title: '4. You Verify',
      desc: 'You confirm that the account handoff has been successfully completed.',
    },
    {
      icon: Wallet,
      title: '5. Seller Gets Paid',
      desc: "The transaction proceeds according to the platform's existing payment rules.",
    },
  ]

  return (
    <div className="mb-10 w-full overflow-hidden rounded-[24px] border border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950/90 shadow-2xl backdrop-blur-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Side: Header & Context */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/5 p-8 lg:p-10 flex flex-col justify-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-400 backdrop-blur-md">
              <Lock className="h-4 w-4" />
              ESCROW PROTECTED
            </div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-bold text-indigo-400 backdrop-blur-md">
            Payment Protection — Powered by Paystack
          </div>
            
            <h2 className="mb-4 font-heading text-3xl font-black text-white leading-tight">
              Pay with confidence. <br />
              <span className="text-indigo-400">Your funds stay protected.</span>
            </h2>
            
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
               When you purchase an account, your payment is securely held through Paystack’s payment protection process while the seller completes the account handoff. The seller does not receive the funds immediately.
            </p>
            
            <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-5">
              <p className="text-sm font-medium leading-relaxed text-indigo-200">
                You don't have to simply trust the seller. Remote Jobs Hub provides a structured transaction process designed to protect the payment while the account handoff is being completed.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The 5 Steps */}
        <div className="lg:col-span-8 p-8 lg:p-10 relative bg-slate-950/50">
          <div className="absolute top-0 right-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="mb-8 font-heading text-xl font-bold text-white">How it works:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...springs.gentle, delay: idx * 0.1 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-white/5 text-indigo-400 shadow-inner">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base mb-1">{step.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        {/* Beginner Class Card */}
        <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm font-medium text-indigo-200">
          <strong>New to AI Tasks? Join Our Free Master Class</strong>
          <p className="mt-2">After purchasing an account, Paystack will send the link to our free practical master class directly to your email 📧. Simply click the link to join the class and learn how to get started, complete tasks successfully, and maximize your earnings.</p>
          <p className="mt-2 font-semibold">Learn. Task. Earn.</p>
        </div>
                  {/* Pricing Explanation Card */}
          <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm font-medium text-indigo-200">
            <strong>Why Are Listing Prices Different?</strong>
            <p className="mt-2">
              Prices are different because each account may have a different earning rate per hour.
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>A higher-priced account may offer higher earning potential per hour.</li>
              <li>Because of the higher earning potential, sellers may include additional benefits.</li>
              <li>These benefits may include a proxy or an additional free account with the purchase, where applicable.</li>
              <li>So, a higher-priced account may offer greater earning potential along with additional benefits.</li>
            </ul>
          </div>
        {/* FAQ Section */}
        <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm font-medium text-indigo-200">
          <strong>Frequently Asked Questions</strong>
          <ol className="mt-4 list-decimal list-inside space-y-2">
            <li className="mt-2">
              <p className="font-semibold">Once I make payment, can I start immediately?</p>
              <p>Yes. Once your payment is confirmed, you can start immediately.</p>
            </li>
            <li className="mt-2">
              <p className="font-semibold">After buying an account, will I receive the account details immediately?</p>
              <p>Yes. Paystack will automatically send you the account details immediately after your payment. You will also receive the link to our Masterclass, where you’ll learn how to properly use and manage the account.</p>
            </li>
            <li className="mt-2">
              <p className="font-semibold">Will I also get a proxy with the account?</p>
              <p>It depends on the account you’re buying.</p>
              <p>Before making payment, check the account description or chat with the seller to confirm whether a proxy is included.</p>
              <p>If the account comes with a proxy, you’ll receive the proxy details together with the account.</p>
            </li>
            <li className="mt-2">
              <p className="font-semibold">Can the seller just wake up one day and log me out of the account?</p>
              <p>No. As a buyer, you should understand that this is not just a casual buyer-and-seller agreement. This is a business contract the seller must follow.</p>
              <p>As long as you follow the agreed terms, properly manage the account, and pay the seller their agreed percentage, the seller should not simply log you out or take back the account.</p>
            </li>
            <li className="mt-2">
              <p className="font-semibold">Who receives the payout?</p>
              <p>This depends on the seller and the account.</p>
              <p>Some sellers allow the buyer to receive the payout directly through their own PayPal account. (Read the account description to confirm.)</p>
              <p>If you don’t have PayPal or Airtm, don’t worry. You’ll be taught in the Masterclass how to create and connect your PayPal or Airtm account.</p>
            </li>
            <li className="mt-2">
              <p className="font-semibold">How long can I use the account?</p>
              <p>An account can potentially last for years, as long as you take proper care of it and follow the agreement.</p>
              <p>To keep the account running:</p>
              <ul className="ml-5 list-disc space-y-1">
                <li>Use the proxy or RDP correctly.</li>
                <li>Follow all the agreed terms.</li>
                <li>Pay the seller their agreed percentage.</li>
                <li>Avoid doing anything that could cause problems or get the account restricted.</li>
              </ul>
            </li>
            <li className="mt-2">
              <p className="font-semibold">Is there a project on the account?</p>
              <p>Yes, there is. That is one thing the brand confirms before an account is approved.</p>
              <p>Don’t worry if you’re new to all this. The free Masterclass will guide you step-by-step on how to properly use and manage the account.</p>
            </li>
          </ol>
        </div>
        </div>
        
      </div>
    </div>
  )
}
