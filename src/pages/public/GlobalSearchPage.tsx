import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight, User, ShoppingCart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export interface SearchResult {
  type: string
  title: string
  match: string
  link: string
  icon: React.ComponentType<{ className?: string }>
}

export const GlobalSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (searchQuery.length <= 2) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const [listingsRes, profilesRes] = await Promise.all([
          supabase.from('listings').select('id, title, description').ilike('title', `%${searchQuery}%`).limit(5),
          supabase.from('profiles').select('id, username').ilike('username', `%${searchQuery}%`).limit(5)
        ])

        const matchedListings: SearchResult[] = (listingsRes.data || []).map(item => ({
          type: 'listing',
          title: item.title,
          match: item.description ? item.description.substring(0, 60) + '...' : 'Marketplace Listing',
          link: `/listing/${item.id}`,
          icon: ShoppingCart
        }))

        const matchedSellers: SearchResult[] = (profilesRes.data || []).map(item => ({
          type: 'seller',
          title: item.username || 'Anonymous Seller',
          match: 'Verified Profile',
          link: `/seller/${item.id}`,
          icon: User
        }))

        setResults([...matchedListings, ...matchedSellers])
      } catch (err) {
        console.error('Failed to search:', err)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <h1 className="text-3xl font-bold font-heading mb-8">Global Search</h1>
        
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search across listings, sellers, guides, and FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-card border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-lg"
            autoFocus
          />
        </div>

        {searchQuery.length > 2 && (
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-muted/50 border-b font-medium text-sm text-muted-foreground">
              Top Results for "{searchQuery}"
            </div>
            <div className="divide-y divide-border">
              {results.map((result, idx) => (
                <Link key={idx} to={result.link} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <result.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold mb-1 text-foreground group-hover:text-primary transition-colors">{result.title}</div>
                      <div className="text-sm text-muted-foreground">{result.match}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {searchQuery.length > 0 && searchQuery.length <= 2 && (
          <div className="text-center py-12 text-muted-foreground">
            Keep typing to search...
          </div>
        )}
      </div>
    </div>
  )
}
