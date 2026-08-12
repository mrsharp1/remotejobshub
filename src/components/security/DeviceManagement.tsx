import React from 'react'
import { ActiveSessions, Session } from './ActiveSessions'
import { TrustedDevices, TrustedDevice } from './TrustedDevices'

export const DeviceManagement: React.FC = () => {
  // Mock Data
  const mockSessions: Session[] = [
    {
      id: '1',
      device: 'MacBook Pro 16"',
      os: 'macOS Sonoma',
      browser: 'Chrome',
      location: 'London, UK',
      ip: '192.168.1.1',
      lastActive: 'Active now',
      isCurrent: true,
      icon: 'laptop'
    },
    {
      id: '2',
      device: 'iPhone 15 Pro',
      os: 'iOS 17',
      browser: 'Safari',
      location: 'London, UK',
      ip: '192.168.1.2',
      lastActive: '2 hours ago',
      isCurrent: false,
      icon: 'mobile'
    }
  ]

  const mockTrusted: TrustedDevice[] = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      addedOn: 'Oct 12, 2025',
      icon: 'laptop'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-bold">Device & Session Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the devices that have access to your account and manage active sessions.
        </p>
      </div>

      <ActiveSessions 
        sessions={mockSessions} 
        onRevoke={(id) => {
          if (import.meta.env.DEV) console.log('Revoke', id)
        }} 
        onRevokeAll={() => {
          if (import.meta.env.DEV) console.log('Revoke All')
        }} 
      />
      
      <TrustedDevices 
        devices={mockTrusted} 
        onRemove={(id) => {
          if (import.meta.env.DEV) console.log('Remove', id)
        }} 
      />
    </div>
  )
}
