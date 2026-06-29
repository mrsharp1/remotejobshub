import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Globe,
  Zap,
  Users,
  Star,
  CheckCircle,
} from 'lucide-react'

const stats = [
  { label: 'Verified Listings', value: '12,000+' },
  { label: 'Active Buyers', value: '35,000+' },
  { label: 'Countries Served', value: '80+' },
  { label: 'Avg. Sale Time', value: '< 48hrs' },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified & Secure',
    description:
      'Every listing goes through a thorough KYC verification and manual admin review before going live.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Best Market Prices',
    description:
      'AI-powered pricing suggestions help sellers get top value and buyers find fair deals every time.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Globe,
    title: 'Global Marketplace',
    description:
      'Trade remote work accounts from over 80 countries. Reach buyers and sellers worldwide.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Zap,
    title: 'Instant Escrow',
    description:
      'Funds are held in secure escrow until both parties confirm the transaction is complete.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Users,
    title: 'Community Trust',
    description:
      'Verified reviews, seller ratings, and dispute resolution ensure a safe experience for everyone.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Star,
    title: 'Premium Support',
    description:
      'Our dedicated team is available around the clock to assist buyers, sellers, and resolve disputes.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
]

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Register in under 60 seconds. No credit card required.',
  },
  {
    step: '02',
    title: 'Browse Verified Listings',
    description:
      'Filter by platform, income, price, and seller rating to find the perfect account.',
  },
  {
    step: '03',
    title: 'Secure Your Purchase',
    description:
      'Pay via our escrow system — funds are only released when you confirm delivery.',
  },
  {
    step: '04',
    title: 'Grow Your Income',
    description:
      'Take ownership of established remote work accounts and start earning immediately.',
  },
]

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="from-primary/5 to-secondary/10 relative overflow-hidden bg-gradient-to-br via-background px-4 py-20 md:py-32">
        <div className="from-primary/10 absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="border-primary/20 bg-primary/5 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            The World's Most Trusted Remote Account Marketplace
          </div>
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Buy & Sell Remote
            <br />
            <span className="to-primary/60 bg-gradient-to-r from-primary bg-clip-text text-transparent">
              Work Accounts
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Remote Jobs Hub connects verified buyers and sellers of established
            remote work accounts. Every listing is KYC-verified, escrow-secured,
            and backed by our dispute resolution system.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/marketplace"
              className="hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl"
            >
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
            >
              List Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted/30 border-y px-4 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold text-foreground">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              Why Remote Jobs Hub?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built for trust, speed, and security at every step.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From registration to ownership in four simple steps.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative flex flex-col items-start">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-heading text-lg font-extrabold text-primary-foreground shadow">
                  {s.step}
                </div>
                <h3 className="font-heading text-base font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Your Safety is Our Priority
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              'Escrow-Protected Payments',
              'KYC-Verified Sellers',
              'Admin Dispute Resolution',
            ].map((b) => (
              <div
                key={b}
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="to-primary/80 mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-primary px-8 py-14 text-center shadow-2xl">
          <h2 className="font-heading text-3xl font-extrabold text-primary-foreground md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 mt-4">
            Join thousands of buyers and sellers on the most trusted remote work
            account marketplace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-primary shadow transition-all hover:bg-white/90"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              View Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
