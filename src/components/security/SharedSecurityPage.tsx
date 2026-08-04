import React from 'react'
import { SecurityDashboard } from './SecurityDashboard'
import { SecurityScore } from './SecurityScore'
import { DeviceManagement } from './DeviceManagement'
import { TwoFactorCard } from './TwoFactorCard'
import { PasswordSecurity } from './PasswordSecurity'
import { LoginHistory, LoginEvent } from './LoginHistory'
import { DangerZone } from './DangerZone'

export const SharedSecurityPage: React.FC = () => {
  // Mock history events
  const mockEvents: LoginEvent[] = [
    {
      id: '1',
      date: 'Oct 12, 2025',
      time: '14:32',
      ip: '192.168.1.1',
      browser: 'Chrome',
      os: 'macOS',
      location: 'London, UK',
      status: 'success',
      isCurrent: true
    },
    {
      id: '2',
      date: 'Oct 11, 2025',
      time: '09:15',
      ip: '10.0.0.45',
      browser: 'Safari',
      os: 'iOS',
      location: 'London, UK',
      status: 'success'
    },
    {
      id: '3',
      date: 'Oct 10, 2025',
      time: '03:45',
      ip: '45.22.11.2',
      browser: 'Unknown',
      os: 'Unknown',
      location: 'Moscow, RU',
      status: 'blocked'
    }
  ]

  const overview = (
    <div className="space-y-6">
      <SecurityScore 
        score={85} 
        factors={{
          twoFactorEnabled: false,
          passwordStrength: 'strong',
          emailVerified: true,
          identityVerified: true
        }} 
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TwoFactorCard />
        <PasswordSecurity />
      </div>
    </div>
  )

  const auth = (
    <div className="space-y-6">
      <TwoFactorCard />
      <PasswordSecurity />
    </div>
  )

  const history = <LoginHistory events={mockEvents} />

  const danger = (
    <div className="space-y-6">
      <DangerZone />
    </div>
  )

  return (
    <SecurityDashboard 
      overviewComponent={overview}
      devicesComponent={<DeviceManagement />}
      authComponent={auth}
      historyComponent={history}
      dangerComponent={danger}
    />
  )
}
