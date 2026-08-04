import React from 'react'
import { BuyerAnalytics } from '@/components/analytics/BuyerAnalytics'
import { RealtimeMetrics } from '@/components/analytics/RealtimeMetrics'

export const BuyerAnalyticsPage: React.FC = () => {
  return (
    <>
      <RealtimeMetrics />
      <BuyerAnalytics />
    </>
  )
}
