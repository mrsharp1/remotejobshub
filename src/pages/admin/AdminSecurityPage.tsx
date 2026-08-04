import React, { useState } from 'react'
import { AdminSecurityConsole } from '@/components/security/AdminSecurityConsole'
import { SharedSecurityPage } from '@/components/security/SharedSecurityPage'
import { Server, Shield } from 'lucide-react'

export const AdminSecurityPage: React.FC = () => {
  const [view, setView] = useState<'console' | 'personal'>('console')

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 pt-4 md:px-8">
        <button 
          onClick={() => setView('console')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            view === 'console' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Server className="h-4 w-4" /> Platform Console
        </button>
        <button 
          onClick={() => setView('personal')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            view === 'personal' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Shield className="h-4 w-4" /> Personal Security
        </button>
      </div>

      {view === 'console' ? <AdminSecurityConsole /> : <SharedSecurityPage />}
    </div>
  )
}
