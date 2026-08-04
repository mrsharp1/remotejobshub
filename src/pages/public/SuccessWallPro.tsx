import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Share2 } from 'lucide-react'

export const SuccessWallPro: React.FC = () => {
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [filterCountry, setFilterCountry] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const successes = [
    {
      id: 1,
      name: 'Alex D.',
      country: 'US',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      milestone: 'Income Milestone Reached',
      platform: 'Upwork',
      purchased: 'Verified US Business Account',
      deliveryDate: '2026-05-12',
      firstPayment: '₦4,800,000',
      currentMonthly: '₦12,500,000',
      reactions: 42,
    },
    {
      id: 2,
      name: 'Maria K.',
      country: 'UA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      milestone: 'First Payment Received',
      platform: 'Fiverr',
      purchased: 'TRS Fiverr Seller Account',
      deliveryDate: '2026-06-01',
      firstPayment: '₦2,700,000',
      currentMonthly: '₦7,800,000',
      reactions: 19,
    }
  ]

  const filteredSuccesses = successes.filter(s => {
    if (filterPlatform !== 'all' && s.platform.toLowerCase() !== filterPlatform.toLowerCase()) return false
    if (filterCountry !== 'all' && s.country.toLowerCase() !== filterCountry.toLowerCase()) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'highest') {
      const aVal = parseInt(a.currentMonthly.replace('₦', '').replace(/,/g, ''))
      const bVal = parseInt(b.currentMonthly.replace('₦', '').replace(/,/g, ''))
      return bVal - aVal
    }
    return b.deliveryDate.localeCompare(a.deliveryDate)
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4">
            Remote Jobs Hub <span className="text-primary">Success Wall</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time verified milestones, payouts, and monthly earnings from remote job buyers globally.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Platform</label>
              <select 
                value={filterPlatform} 
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-muted text-foreground rounded-lg px-3 py-2 border border-border focus:outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="upwork">Upwork</option>
                <option value="fiverr">Fiverr</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Country</label>
              <select 
                value={filterCountry} 
                onChange={(e) => setFilterCountry(e.target.value)}
                className="bg-muted text-foreground rounded-lg px-3 py-2 border border-border focus:outline-none"
              >
                <option value="all">All Countries</option>
                <option value="us">United States</option>
                <option value="ua">Ukraine</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-muted text-foreground rounded-lg px-3 py-2 border border-border focus:outline-none"
            >
              <option value="newest">Newest Deliveries</option>
              <option value="highest">Highest Monthly Income</option>
            </select>
          </div>
        </div>

        {/* Success Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredSuccesses.map(s => (
            <motion.div 
              key={s.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm flex gap-4"
            >
              <img src={s.avatar} alt={s.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold font-heading text-lg">{s.name} <span className="text-xs font-normal text-muted-foreground">({s.country})</span></h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider">{s.milestone}</p>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    {s.platform}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-xl text-sm border border-border/50">
                  <div>
                    <div className="text-muted-foreground text-xs">Purchased</div>
                    <div className="font-bold truncate">{s.purchased}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Delivery Date</div>
                    <div className="font-bold">{s.deliveryDate}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">First Payment</div>
                    <div className="font-bold text-emerald-500">{s.firstPayment}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Current Monthly</div>
                    <div className="font-bold text-emerald-500">{s.currentMonthly}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-muted-foreground text-sm pt-2">
                  <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                    <Heart className="w-4 h-4" /> {s.reactions} Reactions
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
