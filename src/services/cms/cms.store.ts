import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AboutPageContent {
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    videoUrl: string
  }
  story: {
    heading: string
    content: string
  }
  missionVision: {
    mission: string
    vision: string
    whyWeExist: string
  }
  founderMessage: {
    name: string
    role: string
    message: string
    image: string
    signature?: string
    linkedin?: string
    twitter?: string
    website?: string
    videoMessage?: string
  }
  coreValues: {
    id: string
    title: string
    description: string
    icon: string
    highlightColor: string
  }[]
  timeline: {
    id: string
    year: string
    title: string
    description: string
    image?: string
    order: number
  }[]
  images: string[]
  ctaSection: {
    headline: string
    subheadline: string
    buttonText: string
  }
}

export interface CommunityPageContent {
  hero: {
    headline: string
    description: string
  }
  socials: {
    discord: string
    telegram: string
    whatsapp: string
  }
  events: {
    id: string
    banner?: string
    title: string
    description: string
    date: string
    time: string
    location: string
    link: string
    status: 'upcoming' | 'past'
    pinned: boolean
    featured: boolean
  }[]
  upcomingMeetups: {
    id: string
    city: string
    date: string
    description: string
  }[]
  successStories: {
    id: string
    name: string
    story: string
    videoUrl?: string
  }[]
  videoTestimonials: {
    id: string
    thumbnail: string
    videoUrl: string
    name: string
  }[]
  gallery: string[]
  joinCta: {
    headline: string
    buttonText: string
    url: string
  }
  pinnedAnnouncement: string
}

export interface ContactPageContent {
  emails: {
    business: string
    support: string
  }
  phones: {
    primary: string
    whatsapp: string
    emergency: string
  }
  office: {
    address: string
    googleMapUrl: string
    businessHours: string
  }
  supportLinks: {
    label: string
    url: string
  }[]
  socialLinks: {
    platform: string
    url: string
  }[]
  responseTime: string
  supportCategories: string[]
  quickQuestions: { id: string; question: string; answer: string }[]
  priorityLevels: { id: string; label: string; sla: string }[]
  officeDepartments: { id: string; name: string; email: string; phone: string }[]
  emergencyContacts: { id: string; role: string; phone: string; email: string }[]
  holidayNotices: { id: string; date: string; notice: string }[]
  videoTutorials: VideoTutorial[]
}

export interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  videoUrl: string
  category: string
  order: number
  status: 'published' | 'draft'
}

export interface GlobalStats {
  users: string
  transactions: string
  escrowVolume: string
  activeEscrow: string
  countries: string
  responseTime: string
  communityMembers: string
  dailyDiscussions: string
  escrowSuccess: string
  eventsHosted: string
  onlineNow: string
}

export interface CMSMediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'icon'
  folder: string
  size: number
  usageIndicator: string[]
}

export interface CMSActivityLog {
  id: string
  user: string
  action: string
  timestamp: string
  module: string
  status: string
}

export interface HomepageContent {
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    trustBadgesEnabled: boolean
  }
  layout: {
    id: string
    enabled: boolean
    order: number
  }[]
  videos: {
    hero: { url: string; thumbnail: string; autoplay: boolean; loop: boolean; mute: boolean; fallbackImage: string }
    marketplace: { url: string; thumbnail: string; autoplay: boolean; loop: boolean; mute: boolean; fallbackImage: string }
    trust: { url: string; thumbnail: string; autoplay: boolean; loop: boolean; mute: boolean; fallbackImage: string }
    community: { url: string; thumbnail: string; autoplay: boolean; loop: boolean; mute: boolean; fallbackImage: string }
    about: { url: string; thumbnail: string; autoplay: boolean; loop: boolean; mute: boolean; fallbackImage: string }
  }
  ctaSection: {
    headline: string
    subheadline: string
    buttonText: string
  }
  featuredSellersMode: 'auto' | 'manual'
  featuredListingsMode: 'auto' | 'manual'
}

export interface WrittenReview {
  id: string
  customerName: string
  country: string
  platformPurchased: string
  rating: number
  title: string
  body: string
  avatar: string
  verified: boolean
  isFeatured: boolean
  showOnHomepage: boolean
  showOnMarketplace: boolean
  showOnCommunity: boolean
  showOnAbout: boolean
  showOnSellerProfile: boolean
}

export interface VideoTestimonial {
  id: string
  videoUrl: string
  thumbnail: string
  customerName: string
  country: string
  rating: number
  summary: string
  duration: '30s' | '45s' | '1m' | '2m'
  order: number
  isFeatured: boolean
  showOnHomepage: boolean
  showOnMarketplace: boolean
  showOnCommunity: boolean
  showOnAbout: boolean
  showOnSellerProfile: boolean
}

export interface ReviewsContent {
  writtenReviews: WrittenReview[]
  videoTestimonials: VideoTestimonial[]
}

interface CMSState {
  storeId: string;
  homepageContent: HomepageContent
  reviewsContent: ReviewsContent
  aboutContent: AboutPageContent
  communityContent: CommunityPageContent
  contactContent: ContactPageContent
  globalStats: GlobalStats
  mediaLibrary: CMSMediaItem[]
  activityLog: CMSActivityLog[]
  
  homepageDraft: HomepageContent | null
  reviewsDraft: ReviewsContent | null
  aboutDraft: AboutPageContent | null
  communityDraft: CommunityPageContent | null
  contactDraft: ContactPageContent | null
  globalStatsDraft: GlobalStats | null
  
  lastSavedDraft: number | null
  hasUnpublishedChanges: boolean
  
  updateHomepageDraft: (content: HomepageContent) => void
  publishHomepage: () => void
  discardHomepageDraft: () => void

  updateReviewsDraft: (content: ReviewsContent) => void
  publishReviews: () => void
  discardReviewsDraft: () => void

  updateAboutDraft: (content: AboutPageContent) => void
  publishAbout: () => void
  discardAboutDraft: () => void

  updateCommunityDraft: (content: CommunityPageContent) => void
  publishCommunity: () => void
  discardCommunityDraft: () => void

  updateContactDraft: (content: ContactPageContent) => void
  publishContact: () => void
  discardContactDraft: () => void

  updateGlobalStatsDraft: (content: GlobalStats) => void
  publishGlobalStats: () => void
  discardGlobalStatsDraft: () => void

  publishAll: () => void
  discardAll: () => void
  
  logActivity: (user: string, action: string, module: string, status: string) => void

  addMedia: (media: CMSMediaItem) => void
  deleteMedia: (id: string) => void
}

const DEFAULT_ABOUT: AboutPageContent = {
  hero: {
    headline: 'Building the Future of Remote Work',
    subheadline: 'We are on a mission to democratize access to global opportunities through secure, verified credential transfers.',
    ctaText: 'View Open Positions',
    videoUrl: ''
  },
  story: {
    heading: 'Our Story',
    content: 'Founded in 2024, Remote Jobs Hub began as a small community of digital nomads...'
  },
  missionVision: {
    mission: 'To create a borderless workforce.',
    vision: 'A world where talent is recognized regardless of geography.',
    whyWeExist: 'To bridge the trust gap in digital credential transfers.'
  },
  founderMessage: {
    name: 'Sarah Chen',
    role: 'CEO & Founder',
    message: 'Trust is the foundation of all remote work. We built this platform to secure it.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
    signature: 'S. Chen',
    linkedin: 'https://linkedin.com/in/sarahchen',
    twitter: 'https://twitter.com/sarahchen'
  },
  coreValues: [
    { id: '1', title: 'Transparency', description: 'Clear processes and open communication.', icon: 'Eye', highlightColor: 'blue' },
    { id: '2', title: 'Security', description: 'Enterprise-grade protection for all assets.', icon: 'Lock', highlightColor: 'indigo' },
    { id: '3', title: 'Community', description: 'Building together with our users.', icon: 'Users', highlightColor: 'violet' }
  ],
  timeline: [
    { id: '1', year: '2024', title: 'The Beginning', description: 'Remote Jobs Hub is founded.', order: 0 },
    { id: '2', year: '2025', title: 'Global Expansion', description: 'Reached 100+ countries.', order: 1 }
  ],
  images: [],
  ctaSection: {
    headline: 'Ready to join us?',
    subheadline: 'Start your secure journey today.',
    buttonText: 'Get Started'
  }
}

const DEFAULT_COMMUNITY: CommunityPageContent = {
  hero: {
    headline: 'Join the Global Network',
    description: 'Connect with thousands of verified professionals.'
  },
  socials: {
    discord: 'https://discord.gg/example',
    telegram: 'https://t.me/example',
    whatsapp: 'https://wa.me/1234567890'
  },
  events: [
    {
      id: 'evt1',
      title: 'Global Remote Summit',
      description: 'Annual gathering of remote professionals.',
      date: '2025-08-15',
      time: '10:00 AM UTC',
      location: 'Virtual',
      link: 'https://summit.example.com',
      status: 'upcoming',
      pinned: true,
      featured: true
    }
  ],
  upcomingMeetups: [],
  successStories: [],
  videoTestimonials: [],
  gallery: [],
  joinCta: {
    headline: 'Become a Member',
    buttonText: 'Join Discord',
    url: 'https://discord.gg/example'
  },
  pinnedAnnouncement: '🚀 New Escrow features rolling out this week!'
}

const DEFAULT_CONTACT: ContactPageContent = {
  emails: {
    business: 'business@remotejobshub.com',
    support: 'support@remotejobshub.com'
  },
  phones: {
    primary: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 987-6543',
    emergency: '+1 (555) 911-0000'
  },
  office: {
    address: '123 Innovation Drive, Tech City, TC 90210',
    googleMapUrl: '',
    businessHours: 'Mon-Fri, 9am - 5pm EST'
  },
  supportLinks: [
    { label: 'Help Center', url: '/help' },
    { label: 'Submit a Ticket', url: '/ticket' }
  ],
  socialLinks: [
    { platform: 'Twitter', url: 'https://twitter.com/remotejobshub' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/remotejobshub' }
  ],
  responseTime: '< 2 hours',
  supportCategories: ['Billing', 'Escrow Dispute', 'Account Access', 'General Inquiry'],
  quickQuestions: [
    { id: '1', question: 'How do I start an escrow?', answer: 'Navigate to the dashboard and click Create Transaction.' }
  ],
  priorityLevels: [
    { id: '1', label: 'High Priority (Enterprise)', sla: '< 1 hour' }
  ],
  officeDepartments: [
    { id: '1', name: 'Legal & Compliance', email: 'legal@remotejobshub.com', phone: '+1 555 123 0001' }
  ],
  emergencyContacts: [
    { id: '1', role: 'Security Ops', phone: '+1 555 911 0001', email: 'secops@remotejobshub.com' }
  ],
  holidayNotices: [],
  videoTutorials: [
    {
      id: '1',
      title: 'Visual Escrow Guide',
      description: 'See how our vault system secures buyer funds and seller credentials.',
      duration: '2:15',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Buying',
      order: 0,
      status: 'published'
    },
    {
      id: '2',
      title: 'Completing Verification',
      description: 'A step-by-step walkthrough of the selfie and ID KYC check.',
      duration: '1:45',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Getting Started',
      order: 1,
      status: 'published'
    }
  ]
}

const DEFAULT_GLOBAL_STATS: GlobalStats = {
  users: '45,000+',
  transactions: '120,000+',
  escrowVolume: '₦120M+',
  activeEscrow: '₦2.4M',
  countries: '80+',
  responseTime: '< 12 hours',
  communityMembers: '45,000+',
  dailyDiscussions: '1,200+',
  escrowSuccess: '99.9%',
  eventsHosted: '150+',
  onlineNow: '2,400'
}

const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: {
    headline: 'Trade Verified Digital Assets Instantly',
    subheadline: 'The enterprise escrow standard for secure credential delivery.',
    ctaText: 'Browse Marketplace',
    trustBadgesEnabled: true
  },
  layout: [
    { id: 'hero', enabled: true, order: 0 },
    { id: 'stats', enabled: true, order: 1 },
    { id: 'trust', enabled: true, order: 2 },
    { id: 'featured_listings', enabled: true, order: 3 },
    { id: 'categories', enabled: true, order: 4 },
    { id: 'buyer_journey', enabled: true, order: 5 },
    { id: 'success_wall', enabled: true, order: 6 },
    { id: 'reviews', enabled: true, order: 7 },
    { id: 'video_testimonials', enabled: true, order: 8 },
    { id: 'featured_sellers', enabled: true, order: 9 },
    { id: 'faq', enabled: true, order: 10 },
    { id: 'community_cta', enabled: true, order: 11 },
    { id: 'final_cta', enabled: true, order: 12 }
  ],
  videos: {
    hero: { url: '', thumbnail: '', autoplay: true, loop: true, mute: true, fallbackImage: '' },
    marketplace: { url: '', thumbnail: '', autoplay: true, loop: true, mute: true, fallbackImage: '' },
    trust: { url: '', thumbnail: '', autoplay: true, loop: true, mute: true, fallbackImage: '' },
    community: { url: '', thumbnail: '', autoplay: true, loop: true, mute: true, fallbackImage: '' },
    about: { url: '', thumbnail: '', autoplay: true, loop: true, mute: true, fallbackImage: '' }
  },
  ctaSection: {
    headline: 'Ready to securely trade assets?',
    subheadline: 'Join thousands of verified professionals today.',
    buttonText: 'Get Started Now'
  },
  featuredSellersMode: 'auto',
  featuredListingsMode: 'auto'
}

const DEFAULT_REVIEWS: ReviewsContent = {
  writtenReviews: [],
  videoTestimonials: []
}

export const useCMSStore = create<CMSState>()(
  persist(
    (set) => ({
      storeId: Math.random().toString(36).substr(2, 5),
      homepageContent: DEFAULT_HOMEPAGE,
      reviewsContent: DEFAULT_REVIEWS,
      aboutContent: DEFAULT_ABOUT,
      communityContent: DEFAULT_COMMUNITY,
      contactContent: DEFAULT_CONTACT,
      globalStats: DEFAULT_GLOBAL_STATS,
      mediaLibrary: [],
      activityLog: [],
      
      homepageDraft: null,
      reviewsDraft: null,
      aboutDraft: null,
      communityDraft: null,
      contactDraft: null,
      globalStatsDraft: null,
      
      lastSavedDraft: null,
      hasUnpublishedChanges: false,

      logActivity: (user, action, module, status) => set((state) => ({
        activityLog: [
          { id: crypto.randomUUID(), user, action, module, status, timestamp: new Date().toISOString() },
          ...state.activityLog
        ].slice(0, 50)
      })),

      updateHomepageDraft: (content) => set({ homepageDraft: content, lastSavedDraft: Date.now(), hasUnpublishedChanges: true }),
      publishHomepage: () => set((state) => {
        state.logActivity('System', 'Published Homepage', 'Homepage', 'Published')
        return { 
          homepageContent: state.homepageDraft || state.homepageContent, 
          homepageDraft: null,
          hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.contactDraft || state.globalStatsDraft || state.reviewsDraft)
        }
      }),
      discardHomepageDraft: () => set((state) => ({ 
        homepageDraft: null,
        hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.contactDraft || state.globalStatsDraft || state.reviewsDraft)
      })),

      updateReviewsDraft: (content) => set((state) => {
        return { 
          reviewsContent: content, 
          lastSavedDraft: Date.now(),
          hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.contactDraft || state.globalStatsDraft || state.homepageDraft)
        }
      }),
      publishReviews: () => set((state) => {
        return state
      }),
      discardReviewsDraft: () => set((state) => ({ 
        reviewsDraft: null,
        hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.contactDraft || state.globalStatsDraft || state.homepageDraft)
      })),

      updateAboutDraft: (content) => set({ aboutDraft: content, lastSavedDraft: Date.now(), hasUnpublishedChanges: true }),
      publishAbout: () => set((state) => {
        state.logActivity('System', 'Published About Page', 'About', 'Published')
        return { 
          aboutContent: state.aboutDraft || state.aboutContent, 
          aboutDraft: null,
          hasUnpublishedChanges: !!(state.communityDraft || state.contactDraft || state.globalStatsDraft || state.homepageDraft || state.reviewsDraft)
        }
      }),
      discardAboutDraft: () => set((state) => ({ 
        aboutDraft: null,
        hasUnpublishedChanges: !!(state.communityDraft || state.contactDraft || state.globalStatsDraft || state.homepageDraft || state.reviewsDraft)
      })),

      updateCommunityDraft: (content) => set({ communityDraft: content, lastSavedDraft: Date.now(), hasUnpublishedChanges: true }),
      publishCommunity: () => set((state) => {
        state.logActivity('System', 'Published Community Page', 'Community', 'Published')
        return { 
          communityContent: state.communityDraft || state.communityContent, 
          communityDraft: null,
          hasUnpublishedChanges: !!(state.aboutDraft || state.contactDraft || state.globalStatsDraft || state.homepageDraft || state.reviewsDraft)
        }
      }),
      discardCommunityDraft: () => set((state) => ({ 
        communityDraft: null,
        hasUnpublishedChanges: !!(state.aboutDraft || state.contactDraft || state.globalStatsDraft || state.homepageDraft || state.reviewsDraft)
      })),

      updateContactDraft: (content) => set({ contactDraft: content, lastSavedDraft: Date.now(), hasUnpublishedChanges: true }),
      publishContact: () => set((state) => {
        state.logActivity('System', 'Published Contact Page', 'Contact', 'Published')
        return { 
          contactContent: state.contactDraft || state.contactContent, 
          contactDraft: null,
          hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.globalStatsDraft || state.homepageDraft || state.reviewsDraft)
        }
      }),
      discardContactDraft: () => set((state) => ({ 
        contactDraft: null,
        hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.globalStatsDraft || state.homepageDraft || state.reviewsDraft)
      })),

      updateGlobalStatsDraft: (content) => set({ globalStatsDraft: content, lastSavedDraft: Date.now(), hasUnpublishedChanges: true }),
      publishGlobalStats: () => set((state) => {
        state.logActivity('System', 'Published Global Statistics', 'Stats', 'Published')
        return { 
          globalStats: state.globalStatsDraft || state.globalStats, 
          globalStatsDraft: null,
          hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.contactDraft || state.homepageDraft || state.reviewsDraft)
        }
      }),
      discardGlobalStatsDraft: () => set((state) => ({ 
        globalStatsDraft: null,
        hasUnpublishedChanges: !!(state.aboutDraft || state.communityDraft || state.contactDraft || state.homepageDraft || state.reviewsDraft)
      })),
      
      publishAll: () => set((state) => {
        state.logActivity('System', 'Published Entire Website', 'Global', 'Published')
        return {
          homepageContent: state.homepageDraft || state.homepageContent,
          reviewsContent: state.reviewsDraft || state.reviewsContent,
          aboutContent: state.aboutDraft || state.aboutContent,
          communityContent: state.communityDraft || state.communityContent,
          contactContent: state.contactDraft || state.contactContent,
          globalStats: state.globalStatsDraft || state.globalStats,
          homepageDraft: null,
          reviewsDraft: null,
          aboutDraft: null,
          communityDraft: null,
          contactDraft: null,
          globalStatsDraft: null,
          hasUnpublishedChanges: false
        }
      }),
      
      discardAll: () => set({
        homepageDraft: null,
        reviewsDraft: null,
        aboutDraft: null,
        communityDraft: null,
        contactDraft: null,
        globalStatsDraft: null,
        hasUnpublishedChanges: false
      }),

      addMedia: (media) => set((state) => {
        state.logActivity('System', `Uploaded media: ${media.name}`, 'Media', 'Uploaded')
        return { mediaLibrary: [...state.mediaLibrary, media] }
      }),
      deleteMedia: (id) => set((state) => {
        state.logActivity('System', `Deleted media ID: ${id}`, 'Media', 'Deleted')
        return { mediaLibrary: state.mediaLibrary.filter(m => m.id !== id) }
      })
    }),
    {
      name: 'cms-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 (or undefined) to 1
          // Rename showOnHome to showOnHomepage and set missing flags to true
          const upgradeReviews = (reviews: any[]) => {
            if (!Array.isArray(reviews)) return []
            return reviews.map(r => {
              const upgraded = { ...r }
              if (upgraded.showOnHome !== undefined) {
                upgraded.showOnHomepage = upgraded.showOnHome
                delete upgraded.showOnHome
              }
              if (upgraded.showOnHomepage === undefined) upgraded.showOnHomepage = true
              if (upgraded.showOnMarketplace === undefined) upgraded.showOnMarketplace = true
              if (upgraded.showOnCommunity === undefined) upgraded.showOnCommunity = true
              if (upgraded.showOnAbout === undefined) upgraded.showOnAbout = true
              if (upgraded.showOnSellerProfile === undefined) upgraded.showOnSellerProfile = true
              return upgraded
            })
          }

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
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("HYDRATED STORE", state.reviewsContent)
        }
      }
    }
  )
)

export const useHomepageContent = () => {
  const isPreview = window.location.pathname.includes('/admin')
  const { homepageContent, homepageDraft } = useCMSStore()
  return isPreview && homepageDraft ? homepageDraft : homepageContent
}

export const useReviewsContent = () => {
  return useCMSStore(state => state.reviewsContent)
}

export const useAboutContent = () => {
  const isPreview = window.location.pathname.includes('/admin')
  const { aboutContent, aboutDraft } = useCMSStore()
  return isPreview && aboutDraft ? aboutDraft : aboutContent
}

export const useCommunityContent = () => {
  const isPreview = window.location.pathname.includes('/admin')
  const { communityContent, communityDraft } = useCMSStore()
  return isPreview && communityDraft ? communityDraft : communityContent
}

export const useContactContent = () => {
  const isPreview = window.location.pathname.includes('/admin')
  const { contactContent, contactDraft } = useCMSStore()
  return isPreview && contactDraft ? contactDraft : contactContent
}

export const useGlobalStats = () => {
  const isPreview = window.location.pathname.includes('/admin')
  const { globalStats, globalStatsDraft } = useCMSStore()
  return isPreview && globalStatsDraft ? globalStatsDraft : globalStats
}
