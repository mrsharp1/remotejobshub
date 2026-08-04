import React, { useEffect, useState } from 'react'
import { Clock, Trash2 } from 'lucide-react'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

export const RecentlyViewedSection: React.FC = () => {
  const { viewedListings, clearHistory } = useRecentlyViewedStore()
  const { user } = useAuthStore()
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (!user?.id) return
    const getFavorites = async () => {
      try {
        const { data } = await supabase
          .from('favorites')
          .select('listing_id')
          .eq('user_id', user.id)
        if (data) {
          setFavorites(data.map((f) => f.listing_id))
        }
      } catch (err) {
        console.error('Failed to load favorites:', err)
      }
    }
    getFavorites()
  }, [user?.id])

  const handleToggleFavorite = async (listingId: string) => {
    if (!user) {
      alert('Please log in to save listings')
      return
    }

    try {
      if (favorites.includes(listingId)) {
        setFavorites((prev) => prev.filter((id) => id !== listingId))
        await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, listing_id: listingId })
      } else {
        setFavorites((prev) => [...prev, listingId])
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (viewedListings.length === 0) return null

  return (
    <div className="mt-16 space-y-8 border-t border-white/5 pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-indigo-400" />
          <h2 className="font-heading text-2xl font-black text-white">
            Recently Viewed
          </h2>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 rounded-full bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {viewedListings.slice(0, 4).map((listing) => (
          <MarketplaceListingCard
            key={listing.id}
            listing={listing}
            isFavorited={favorites.includes(listing.id)}
            onToggleFavorite={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleFavorite(listing.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
