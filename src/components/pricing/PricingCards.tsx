import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Zap, Shield, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Free Buyer',
    price: '₦0',
    period: 'forever',
    icon: Zap,
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    badge: null,
    description: 'Browse the marketplace, favorite listings, and safely contact sellers completely free.',
    features: [
      'Unlimited marketplace browsing',
      'Favorite up to 50 listings',
      'Direct seller messaging',
      'Neutral dispute resolution',
      'Order tracking & history',
      'Email notifications',
    ],
    cta: 'Get Started Free',
    ctaTo: '/register',
    variant: 'outline' as const,
  },
  {
    name: 'Free Seller',
    price: '₦0',
    period: 'forever',
    icon: Crown,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    badge: 'Zero Listing Fees',
    description: 'List your digital assets and keep 100% of your asking price. We do not charge sellers.',
    features: [
      'Unlimited active listings',
      'Verified KYC seller badge',
      'Priority listing placement',
      'Seller analytics dashboard',
      'Secure messaging workspace',
      'Referral commission program',
      'Priority 24/7 support',
    ],
    cta: 'Start Selling Free',
    ctaTo: '/register',
    variant: 'primary' as const,
  },
  {
    name: 'Escrow Protection',
    price: '9.9%',
    period: 'per transaction',
    icon: Shield,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    badge: 'Buyer Paid',
    description: 'The buyer pays a small escrow fee to guarantee the safety of their funds until transfer completes.',
    features: [
      'Military-grade fund security',
      'Guaranteed credential transfer',
      '24/7 mediation & arbitration',
      'Anti-fraud identity verification',
      'Secure payment processing',
      'Instant payout to seller',
      'Money-back guarantee',
    ],
    cta: 'Learn About Escrow',
    ctaTo: '/faq',
    variant: 'outline' as const,
  },
]

export const PricingCards: React.FC = () => {
  return (
    <section className="relative z-20 -mt-20 px-4 pb-32">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        {plans.map((plan, idx) => {
          const Icon = plan.icon
          const isPrimary = plan.variant === 'primary'

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`premium-card relative flex flex-col p-8 lg:p-10 ${
                isPrimary
                  ? 'border-indigo-500/30 ring-2 ring-indigo-500/20 dark:bg-slate-900/80'
                  : ''
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg ${
                    isPrimary
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-black text-foreground lg:text-5xl">
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                </div>
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${plan.iconBg}`}>
                  <Icon className={`h-7 w-7 ${plan.iconColor}`} />
                </div>
              </div>

              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <div className="mb-8 h-px w-full bg-border" />

              <ul className="mb-10 flex-1 space-y-4">
                {plan.features.map((feature, fIdx) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (idx * 0.1) + (fIdx * 0.05) }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      isPrimary ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        isPrimary ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-500'
                      }`} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <Link
                to={plan.ctaTo}
                className={`group flex h-14 items-center justify-center gap-2 rounded-xl text-base font-bold transition-all ${
                  isPrimary
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
