import React from 'react'
import { AboutHero } from '@/components/about/AboutHero'
import { CompanyPhilosophy } from '@/components/about/CompanyPhilosophy'
import { MissionVision } from '@/components/about/MissionVision'
import { CoreValues } from '@/components/about/CoreValues'
import { TrustMetrics } from '@/components/about/TrustMetrics'
import { WhyTrustUs } from '@/components/about/WhyTrustUs'
import { InteractiveTimeline } from '@/components/about/InteractiveTimeline'
import { GlobalPresence } from '@/components/about/GlobalPresence'
import { LeadershipTeam } from '@/components/about/LeadershipTeam'
import { AwardsRecognition } from '@/components/about/AwardsRecognition'
import { CommunityTelegram } from '@/components/about/CommunityTelegram'
import { OfficialPartnership } from '@/components/about/OfficialPartnership'
import { TrustedPartners } from '@/components/about/TrustedPartners'
import { WrittenReviews } from '@/components/home/WrittenReviews'
import { VideoTestimonials } from '@/components/home/VideoTestimonials'
import { FinalCallToAction } from '@/components/about/FinalCallToAction'

export const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-slate-950 min-h-screen">
      <AboutHero />
      <CompanyPhilosophy />
      <MissionVision />
      <CoreValues />
      <TrustMetrics />
      <OfficialPartnership />
      <TrustedPartners />
      <WhyTrustUs />
      <InteractiveTimeline />
      
      {/* Retained components woven elegantly into the narrative */}
      <GlobalPresence />
      <LeadershipTeam />
      <AwardsRecognition />
      <CommunityTelegram />
      
      <div className="bg-slate-950 py-12">
        <WrittenReviews location="about" />
        <VideoTestimonials location="about" />
      </div>
      
      <FinalCallToAction />
    </div>
  )
}
