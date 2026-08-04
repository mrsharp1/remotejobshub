import React, { useState } from 'react'
import { Shield, MonitorSmartphone, KeyRound, History, AlertTriangle } from 'lucide-react'

// Layout Sidebar Component
interface SecuritySidebarProps {
  activeTab: string
  onChange: (tab: string) => void
}

const SecuritySidebar: React.FC<SecuritySidebarProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: <Shield className="h-4 w-4" /> },
    { id: 'devices', label: 'Device Management', icon: <MonitorSmartphone className="h-4 w-4" /> },
    { id: 'auth', label: 'Authentication & 2FA', icon: <KeyRound className="h-4 w-4" /> },
    { id: 'history', label: 'Login History', icon: <History className="h-4 w-4" /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="h-4 w-4" /> },
  ]

  return (
    <div className="w-full flex-shrink-0 md:w-64">
      <div className="sticky top-24 flex flex-row overflow-x-auto border-b border-border bg-background pb-2 md:flex-col md:overflow-visible md:border-none md:pb-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface SecurityDashboardProps {
  overviewComponent: React.ReactNode
  devicesComponent: React.ReactNode
  authComponent: React.ReactNode
  historyComponent: React.ReactNode
  dangerComponent: React.ReactNode
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  overviewComponent,
  devicesComponent,
  authComponent,
  historyComponent,
  dangerComponent
}) => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          Security Center
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Manage your account security, trusted devices, and authentication methods.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <SecuritySidebar activeTab={activeTab} onChange={setActiveTab} />
        
        <div className="flex-1 min-w-0">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'overview' && overviewComponent}
            {activeTab === 'devices' && devicesComponent}
            {activeTab === 'auth' && authComponent}
            {activeTab === 'history' && historyComponent}
            {activeTab === 'danger' && dangerComponent}
          </div>
        </div>
      </div>
    </div>
  )
}
