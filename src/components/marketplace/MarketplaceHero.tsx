import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

interface MarketplaceHeroProps {
  onBrowseClick: () => void
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  onBrowseClick,
}) => {
  return (
    <div className="border-border/40 relative overflow-hidden border-b bg-background py-20">
      {/* Decorative Glow Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="bg-primary/30 absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full blur-[120px]" />
        <div className="bg-secondary/20 absolute right-0 top-1/2 h-[500px] w-[500px] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold text-primary"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          100% Escrow Protected Transfers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-3xl font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Find Verified{' '}
          <span className="bg-clip-text text-primary">Remote Work</span>{' '}
          Accounts
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base"
        >
          Discover premium, fully-vetted profiles across Outlier, Scale AI, and
          DataAnnotation. Secure transfer handling using safe smart escrow
          checks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-4"
        >
          <button
            onClick={onBrowseClick}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
          >
            Browse Listings
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            to="/login?redirect=/seller"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Become a Seller
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
