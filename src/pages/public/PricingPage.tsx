import React from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Zap, Shield, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Free Buyer',
    price: '$0',
    period: 'forever',
    icon: Zap,
    iconColor: 'text-muted-foreground',
    iconBg: 'bg-muted',
    badge: null,
    description: 'Everything you need to browse and purchase listings.',
    features: [
      'Unlimited marketplace browsing',
      'Favorite up to 50 listings',
      'Secure escrow on all purchases',
      'Dispute resolution support',
      'Order tracking & history',
      'Email notifications',
    ],
    cta: 'Get Started Free',
    ctaTo: '/register',
    variant: 'outline' as const,
  },
  {
    name: 'Seller Pro',
    price: '$29',
    period: 'per month',
    icon: Shield,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    badge: 'Most Popular',
    description: 'Everything sellers need to list, manage, and grow.',
    features: [
      'List up to 10 active accounts',
      'KYC verification badge',
      'Priority listing placement',
      'AI listing quality coach',
      'Seller analytics dashboard',
      'Revenue agreement management',
      'Referral commission program',
      'Dedicated seller support',
    ],
    cta: 'Start Selling',
    ctaTo: '/register',
    variant: 'primary' as const,
  },
  {
    name: 'Seller Elite',
    price: '$79',
    period: 'per month',
    icon: Crown,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    badge: 'Best Value',
    description: 'Maximum exposure and unlimited listings for power sellers.',
    features: [
      'Unlimited active listings',
      'Featured listing placement',
      'Advanced AI recommendations',
      'Priority KYC review',
      'Bulk listing tools',
      'Custom seller storefront',
      'Higher referral rates',
      'Account manager access',
      'Advanced analytics & reports',
    ],
    cta: 'Go Elite',
    ctaTo: '/register',
    variant: 'amber' as const,
  },
]

export const PricingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="from-primary/5 to-secondary/10 bg-gradient-to-br via-background px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. No surprises. Start for free, scale when you're
            ready.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md ${
                  plan.variant === 'primary'
                    ? 'ring-primary/20 border-primary shadow-md ring-1'
                    : ''
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white shadow ${
                      plan.variant === 'primary' ? 'bg-primary' : 'bg-amber-500'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${plan.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${plan.iconColor}`} />
                </div>
                <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-heading text-3xl font-extrabold">
                    {plan.price}
                  </span>
                  <span className="mb-0.5 text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="my-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.ctaTo}
                  className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    plan.variant === 'primary'
                      ? 'hover:bg-primary/90 bg-primary text-primary-foreground shadow'
                      : plan.variant === 'amber'
                        ? 'bg-amber-500 text-white shadow hover:bg-amber-500/90'
                        : 'border border-border bg-background hover:bg-muted'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ note */}
      <section className="border-t px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground">
            Questions about pricing?{' '}
            <Link
              to="/faq"
              className="font-medium text-primary hover:underline"
            >
              Check our FAQ
            </Link>{' '}
            or{' '}
            <Link
              to="/contact"
              className="font-medium text-primary hover:underline"
            >
              contact our team
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
