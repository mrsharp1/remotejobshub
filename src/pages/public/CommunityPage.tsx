import React from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare,
  Users,
  BookOpen,
  Star,
  ArrowRight,
  Heart,
} from 'lucide-react'

const guidelines = [
  {
    title: 'Be Honest',
    desc: 'All listings must accurately represent the account. Misleading details result in immediate removal and account suspension.',
  },
  {
    title: 'Respect Others',
    desc: 'Treat every buyer, seller, and admin with professionalism. Harassment or abusive language is never tolerated.',
  },
  {
    title: 'Report Fraud',
    desc: 'Spotted a suspicious listing or user? Use the report button or contact support. Help keep our community safe.',
  },
  {
    title: 'Follow the Rules',
    desc: 'All transactions must go through our escrow system. Off-platform deals are prohibited and unprotected.',
  },
]

const highlights = [
  {
    icon: Users,
    label: '35,000+',
    sub: 'Active Community Members',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Star,
    label: '4.9/5',
    sub: 'Average Seller Rating',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: MessageSquare,
    label: '120k+',
    sub: 'Messages Exchanged',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Heart,
    label: '98%',
    sub: 'Satisfaction Rate',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

export const CommunityPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="to-secondary/10 bg-gradient-to-br from-violet-500/5 via-background px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            A Community Built on Trust
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Remote Jobs Hub is more than a marketplace — it's a growing
            community of remote workers, entrepreneurs, and account traders
            united by integrity and shared success.
          </p>
          <Link
            to="/register"
            className="hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow"
          >
            Join the Community
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-muted/30 border-y px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {highlights.map((h) => {
            const Icon = h.icon
            return (
              <div key={h.label} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${h.bg}`}
                >
                  <Icon className={`h-6 w-6 ${h.color}`} />
                </div>
                <p className="font-heading text-2xl font-extrabold">
                  {h.label}
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  {h.sub}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-3xl font-bold">
              Community Guidelines
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {guidelines.map((g) => (
              <div
                key={g.title}
                className="rounded-2xl border bg-card p-5 shadow-sm"
              >
                <h3 className="font-semibold text-foreground">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discussion CTA */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-primary px-8 py-12 text-center shadow-2xl">
          <h2 className="font-heading text-2xl font-bold text-primary-foreground">
            Have Questions? We're Here.
          </h2>
          <p className="text-primary-foreground/80 mt-3 text-sm">
            Join thousands of community members sharing insights, strategies,
            and success stories on Remote Jobs Hub.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow hover:bg-white/90"
            >
              Join Free Today
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
