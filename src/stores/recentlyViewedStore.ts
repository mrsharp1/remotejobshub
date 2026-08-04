import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Listing } from '@/types'

interface RecentlyViewedState {
  viewedListings: Listing[]
  addListing: (listing: Listing) => void
  clearHistory: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      viewedListings: [],
      addListing: (listing) => {
        const { viewedListings } = get()
        // Remove if it already exists to move it to the front
        const filtered = viewedListings.filter((l) => l.id !== listing.id)

        // Add to front, keep max 10
        set({ viewedListings: [listing, ...filtered].slice(0, 10) })
      },
      clearHistory: () => set({ viewedListings: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
)
