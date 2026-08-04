import { create } from 'zustand'
import { Listing } from '@/types'

interface ComparisonStore {
  compareList: Listing[]
  isModalOpen: boolean
  addToCompare: (listing: Listing) => void
  removeFromCompare: (listingId: string) => void
  clearCompare: () => void
  toggleModal: () => void
  openModal: () => void
  closeModal: () => void
  isInCompare: (listingId: string) => boolean
}

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
  compareList: [],
  isModalOpen: false,

  addToCompare: (listing) => {
    const { compareList } = get()
    if (compareList.length >= 3) return // max 3 comparisons
    if (compareList.some((l) => l.id === listing.id)) return
    set({ compareList: [...compareList, listing] })
  },

  removeFromCompare: (listingId) => {
    set({ compareList: get().compareList.filter((l) => l.id !== listingId) })
  },

  clearCompare: () => set({ compareList: [], isModalOpen: false }),

  toggleModal: () => set({ isModalOpen: !get().isModalOpen }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  isInCompare: (listingId) => get().compareList.some((l) => l.id === listingId),
}))
