import React, { useState } from 'react'
import { Type, BarChart, Users, Briefcase, Video, Save, Layout } from 'lucide-react'
import { toast } from 'sonner'
import { useCMSStore } from '@/services/cms/cms.store'

import { HomepageHeroManager } from './homepage/HomepageHeroManager'
import { HomepageStatisticsManager } from './homepage/HomepageStatisticsManager'
import { HomepageCTAManager } from './homepage/HomepageCTAManager'
import { HomepageVideoManager } from './homepage/HomepageVideoManager'
import { HomepageLayoutManager } from './homepage/HomepageLayoutManager'
import { HomepageFeaturedListingsManager } from './homepage/HomepageFeaturedListingsManager'
import { HomepageTrustSectionManager } from './homepage/HomepageTrustSectionManager'

export const HomepageManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layout' | 'hero' | 'stats' | 'videos' | 'featured' | 'trust' | 'cta'>('layout')
  
  const { hasUnpublishedChanges, publishHomepage, publishGlobalStats } = useCMSStore()

  const handleSave = () => {
    // In our architecture, edits write directly to the Draft state.
    // The explicit "Save" button here acts as a "Publish" for convenience,
    // though the main Publish Center is the preferred route.
    publishHomepage()
    // Global stats are edited in stats manager
    if (activeTab === 'stats') {
      publishGlobalStats()
    }
    toast.success('Homepage settings synchronized', {
      description: 'Changes are now live on the public website.'
    })
  }

  const tabs = [
    { id: 'layout', icon: Layout, label: 'Layout Ordering' },
    { id: 'hero', icon: Type, label: 'Hero Config' },
    { id: 'videos', icon: Video, label: 'Hero & Page Videos' },
    { id: 'stats', icon: BarChart, label: 'Statistics' },
    { id: 'featured', icon: Briefcase, label: 'Featured Sellers & Listings' },
    { id: 'trust', icon: Users, label: 'Trust Section' },
    { id: 'cta', icon: Type, label: 'Bottom CTA' },
  ] as const

  return (
    <div className="flex h-full flex-col">
      <div className="flex overflow-x-auto border-b border-border bg-card">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-background">
        {activeTab === 'layout' && <HomepageLayoutManager />}
        {activeTab === 'hero' && <HomepageHeroManager />}
        {activeTab === 'videos' && <HomepageVideoManager />}
        {activeTab === 'stats' && <HomepageStatisticsManager />}
        {activeTab === 'featured' && <HomepageFeaturedListingsManager />}
        {activeTab === 'trust' && <HomepageTrustSectionManager />}
        {activeTab === 'cta' && <HomepageCTAManager />}
      </div>

      <div className="border-t border-border bg-card p-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {hasUnpublishedChanges ? 'You have unsaved changes in drafts.' : 'All changes are published.'}
        </p>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          Publish Homepage Changes
        </button>
      </div>
    </div>
  )
}
