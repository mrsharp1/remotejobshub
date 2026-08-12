import React from 'react'
import { useHomepageContent } from '@/services/cms/cms.store'

import { HeroSection } from '@/components/home/HeroSection'
import { LivePlatformNumbers } from '@/components/home/LivePlatformNumbers'
import { MarketplaceShowcase } from '@/components/home/MarketplaceShowcase'
import { WhyRemoteJobs } from '@/components/home/WhyRemoteJobs'
import { BuyerJourneyTimeline } from '@/components/home/BuyerJourneyTimeline'
import { SuccessWallPreview } from '@/components/home/SuccessWallPreview'
import { VideoTestimonials } from '@/components/home/VideoTestimonials'
import { WrittenReviews } from '@/components/home/WrittenReviews'
import { FeaturedSellers } from '@/components/home/FeaturedSellers'
import { SecuritySection } from '@/components/home/SecuritySection'
import { CommunitySection } from '@/components/home/CommunitySection'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { FinalCtaSection } from '@/components/home/FinalCtaSection'
import { OutlierHowItWorksPreview } from '@/components/home/OutlierHowItWorksPreview'

const SECTION_MAP: Record<string, React.FC> = {
  'hero': HeroSection,
  'stats': LivePlatformNumbers,
  'trust': SecuritySection,
  'featured_listings': MarketplaceShowcase,
  'categories': WhyRemoteJobs,
  'buyer_journey': BuyerJourneyTimeline,
  'success_wall': SuccessWallPreview,
  'featured_sellers': FeaturedSellers,
  'reviews': WrittenReviews,
  'video_testimonials': VideoTestimonials,
  'faq': FaqAccordion,
  'how_it_works': OutlierHowItWorksPreview,
  'community_cta': CommunitySection,
  'final_cta': FinalCtaSection
}

export const HomePage: React.FC = () => {
  const { layout } = useHomepageContent()
  
  // Sort layout items by order
  const sortedLayout = [...layout].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col bg-slate-950">
      {sortedLayout.map(section => {
        if (!section.enabled) return null
        
        const Component = SECTION_MAP[section.id]
        if (!Component) return null
        
        return <Component key={section.id} />
      })}
    </div>
  )
}
