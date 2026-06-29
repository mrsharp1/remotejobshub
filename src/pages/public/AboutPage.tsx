import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Target, Users, Globe, ArrowRight } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Trust First',
    desc: 'Every seller is verified. Every payment is secured through escrow. No shortcuts.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Target,
    title: 'Radical Transparency',
    desc: 'Clear pricing, honest listings, and full audit trails — no hidden fees ever.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Users,
    title: 'Community Driven',
    desc: 'Our platform grows because our users trust us. Their success is our success.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Globe,
    title: 'Globally Accessible',
    desc: 'Connecting buyers and sellers across 80+ countries, 24 hours a day.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
]

export const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="from-primary/5 to-secondary/10 bg-gradient-to-br via-background px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="border-primary/20 bg-primary/5 mb-4 inline-block rounded-full border px-4 py-1 text-sm font-medium text-primary">
            Our Story
          </span>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            Redefining How Remote Work Accounts Change Hands
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Remote Jobs Hub was founded to solve a critical gap: there was no
            trusted, secure, and transparent marketplace for buying and selling
            established remote work accounts. We built the platform we wished
            existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                To create the world's most trusted marketplace for remote work
                accounts — where every transaction is protected, every seller is
                verified, and every buyer has confidence in what they're
                purchasing.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We combine AI-powered fraud detection, manual KYC review, and
                escrow-protected payments to ensure every deal on our platform
                is fair, fast, and secure.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Listed Accounts', value: '12,000+' },
                { label: 'Verified Sellers', value: '4,200+' },
                { label: 'Countries', value: '80+' },
                { label: 'Successful Trades', value: '98%' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border bg-card p-5 text-center shadow-sm"
                >
                  <p className="font-heading text-2xl font-extrabold text-primary">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-heading text-3xl font-bold">
            Our Core Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.title}
                  className="flex gap-4 rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${v.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${v.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{v.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {v.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl bg-primary px-8 py-12 text-center shadow-2xl">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground">
            Ready to Join the Community?
          </h2>
          <p className="text-primary-foreground/80 mt-3 text-sm">
            Create your free account and start trading with confidence today.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow transition hover:bg-white/90"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
