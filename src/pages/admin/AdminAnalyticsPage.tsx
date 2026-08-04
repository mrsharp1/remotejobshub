import React from 'react'
import { AdminAnalytics } from '@/components/analytics/AdminAnalytics'
import { RealtimeMetrics } from '@/components/analytics/RealtimeMetrics'

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <>
      <RealtimeMetrics />
      <AdminAnalytics />
    </>
  )
}
