import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const MOCK_LOCAL_STORAGE: Record<string, string> = {}
const mockStorage = {
  getItem: (name: string) => {
    return MOCK_LOCAL_STORAGE[name] || null
  },
  setItem: (name: string, value: string) => {
    MOCK_LOCAL_STORAGE[name] = value
  },
  removeItem: (name: string) => {
    delete MOCK_LOCAL_STORAGE[name]
  }
}

interface ReviewsContent {
  writtenReviews: any[]
  videoTestimonials: any[]
}

interface CMSState {
  reviewsContent: ReviewsContent
  reviewsDraft: ReviewsContent | null
  updateReviewsDraft: (content: ReviewsContent) => void
  publishReviews: () => void
}

const DEFAULT_REVIEWS: ReviewsContent = {
  writtenReviews: [],
  videoTestimonials: []
}

const upgradeReviews = (reviews: any[]) => {
  if (!Array.isArray(reviews)) return []
  return reviews.map(r => {
    const upgraded = { ...r }
    if (upgraded.showOnHome !== undefined) {
      upgraded.showOnHomepage = upgraded.showOnHome
      delete upgraded.showOnHome
    }
    if (upgraded.showOnHomepage === undefined) upgraded.showOnHomepage = true
    return upgraded
  })
}

export const createTestStore = () => create<CMSState>()(
  persist(
    (set) => ({
      reviewsContent: DEFAULT_REVIEWS,
      reviewsDraft: null,
      updateReviewsDraft: (content) => set({ reviewsDraft: content }),
      publishReviews: () => set((state) => ({ 
        reviewsContent: state.reviewsDraft || state.reviewsContent, 
        reviewsDraft: null
      })),
    }),
    {
      name: 'cms-storage',
      version: 1,
      storage: createJSONStorage(() => mockStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          if (persistedState.reviewsContent) {
            persistedState.reviewsContent = {
              ...persistedState.reviewsContent,
              writtenReviews: upgradeReviews(persistedState.reviewsContent.writtenReviews),
              videoTestimonials: upgradeReviews(persistedState.reviewsContent.videoTestimonials)
            }
          }
          if (persistedState.reviewsDraft) {
            persistedState.reviewsDraft = {
              ...persistedState.reviewsDraft,
              writtenReviews: upgradeReviews(persistedState.reviewsDraft.writtenReviews),
              videoTestimonials: upgradeReviews(persistedState.reviewsDraft.videoTestimonials)
            }
          }
        }
        return persistedState
      }
    }
  )
)

async function runTest() {
  console.log("=== INITIALIZING STORE ===")
  const useStore = createTestStore()
  
  console.log("Adding 1 Written Review and 1 Video Testimonial...")
  useStore.getState().updateReviewsDraft({
    writtenReviews: [{ id: 'w1', customerName: 'John', showOnHomepage: true }],
    videoTestimonials: [{ id: 'v1', customerName: 'Jane', showOnHomepage: true }]
  })
  
  console.log("Draft state set. Now publishing...")
  useStore.getState().publishReviews()
  
  console.log("=== PHASE 1: LOCAL STORAGE AFTER PUBLISH ===")
  const rawStorage = MOCK_LOCAL_STORAGE['cms-storage']
  console.log(rawStorage)
  
  console.log("\n=== PHASE 2: STATE AFTER PUBLISH ===")
  console.log("reviewsDraft:", useStore.getState().reviewsDraft)
  console.log("reviewsContent:", useStore.getState().reviewsContent)
  
  console.log("\n=== PHASE 3: SIMULATING BROWSER REFRESH ===")
  const useStoreAfterRefresh = createTestStore()
  console.log("Store re-initialized.")
  
  const rawStorageAfterRefresh = MOCK_LOCAL_STORAGE['cms-storage']
  console.log("LOCAL STORAGE AFTER REFRESH:", rawStorageAfterRefresh)
  
  console.log("reviewsContent AFTER REFRESH:", useStoreAfterRefresh.getState().reviewsContent)
}

runTest()
