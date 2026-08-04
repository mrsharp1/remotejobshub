import React, { useEffect, useState } from 'react'
import { Search, Book, CreditCard, Shield, Truck, Users, Globe, Settings, FileText, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const categories = [
    { icon: Book, name: 'Getting Started', desc: 'Basics and onboarding' },
    { icon: CreditCard, name: 'Payments', desc: 'Deposits, withdrawals, fees' },
    { icon: Shield, name: 'Security & Escrow', desc: 'Protection and safety' },
    { icon: Truck, name: 'Account Delivery', desc: 'Handover process' },
    { icon: Users, name: 'Community', desc: 'Rules and guidelines' },
    { icon: Globe, name: 'VPN & Proxies', desc: 'Technical setup' },
    { icon: FileText, name: 'Policies', desc: 'Terms and refunds' },
    { icon: Settings, name: 'Technical Issues', desc: 'Bug reports and fixes' },
  ]

  const popularArticles = [
    'How does Escrow protection work?',
    'Step-by-step guide to securing a purchased account',
    'Which VPN should I use for a US Upwork account?',
    'What happens if the original owner tries to recover the account?',
    'How to verify your identity as a seller'
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Search */}
      <section className="bg-slate-900 text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input 
              type="text"
              placeholder="Search for articles, guides, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md text-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Categories */}
            <div className="md:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold font-heading">Browse Categories</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {categories.map((cat, i) => (
                  <Link key={i} to="/knowledge" className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-12">
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
                <h3 className="text-xl font-bold font-heading mb-6">Popular Articles</h3>
                <ul className="space-y-4">
                  {popularArticles.map((article, i) => (
                    <li key={i}>
                      <Link to="/knowledge" className="flex items-start gap-3 group">
                        <ChevronRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {article}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-primary text-white text-center">
                <h3 className="text-xl font-bold font-heading mb-4">Still need help?</h3>
                <p className="text-primary-foreground/80 text-sm mb-6">Our support team is available 24/7 to assist you with any complex issues.</p>
                <Link to="/contact" className="inline-block w-full py-3 bg-white text-primary rounded-xl font-bold hover:bg-slate-100 transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
