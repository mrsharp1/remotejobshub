import React from 'react'
import { SellerAnalytics } from '@/components/analytics/SellerAnalytics'
import { RealtimeMetrics } from '@/components/analytics/RealtimeMetrics'

export const SellerAnalyticsPage: React.FC = () => {
  return (
    <>
      <RealtimeMetrics />
      <SellerAnalytics />
    </>
  )
}
