import React from 'react'
import { CommunityHero } from '@/components/community/CommunityHero'
import { TelegramPromo } from '@/components/community/TelegramPromo'
import { CommunityBenefits } from '@/components/community/CommunityBenefits'
import { CommunityStats } from '@/components/community/CommunityStats'
import { SuccessStories } from '@/components/community/SuccessStories'
import { VideoTestimonials } from '@/components/home/VideoTestimonials'
import { CommunityTimeline } from '@/components/community/CommunityTimeline'
import { UpcomingEvents } from '@/components/community/UpcomingEvents'
import { CommunityGuidelines } from '@/components/community/CommunityGuidelines'

export const CommunityPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-background">
      <CommunityHero />
      <TelegramPromo />
      <CommunityStats />
      <CommunityBenefits />
      <CommunityTimeline />
      <SuccessStories />
      <div className="bg-slate-50 dark:bg-slate-900 pb-16">
        <VideoTestimonials location="community" />
      </div>
      <UpcomingEvents />
      <CommunityGuidelines />
    </div>
  )
}

