import React from 'react'
import { PricingHero } from '@/components/pricing/PricingHero'
import { PricingCards } from '@/components/pricing/PricingCards'
import { PricingTrust } from '@/components/pricing/PricingTrust'
import { FeatureComparison } from '@/components/pricing/FeatureComparison'
import { SavingsCalculator } from '@/components/pricing/SavingsCalculator'
import { CustomerTestimonials } from '@/components/pricing/CustomerTestimonials'
import { VideoTestimonials } from '@/components/home/VideoTestimonials'
import { PricingFAQ } from '@/components/pricing/PricingFAQ'
import { PricingCommunity } from '@/components/pricing/PricingCommunity'
import { PricingCTA } from '@/components/pricing/PricingCTA'

export const PricingPage: React.FC = () => {
  return (
    <div className="flex flex-col bg-background">
      <PricingHero />
      <PricingCards />
      <PricingTrust />
      <FeatureComparison />
      <SavingsCalculator />
      <CustomerTestimonials />
      <div className="bg-slate-50 dark:bg-slate-900 pb-16">
        <VideoTestimonials location="homepage" />
      </div>
      <PricingFAQ />
      <PricingCommunity />
      <PricingCTA />
    </div>
  )
}

