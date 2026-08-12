import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Image as ImageIcon,
  Globe,
  BarChart,
  Link as LinkIcon,
  FileText,
  Search,
  Save,
  Clock,
  User,
  Users,
  Star,
  Calendar,
  HelpCircle,
  Video
} from 'lucide-react'

import { PolicyManager } from '@/components/admin/cms/PolicyManager'
import { ReviewManager } from '@/components/admin/cms/ReviewManager'
import { HomepageManager } from '@/components/admin/cms/HomepageManager'
import { MediaLibraryPro } from '@/components/admin/cms/MediaLibraryPro'
import { NavigationBuilderPro } from '@/components/admin/cms/NavigationBuilderPro'
import { FooterBuilderPro } from '@/components/admin/cms/FooterBuilderPro'
import { AboutManager } from '@/components/admin/cms/AboutManager'
import { CommunityManager } from '@/components/admin/cms/CommunityManager'
import { ContactManager } from '@/components/admin/cms/ContactManager'
import { PublishCenter } from '@/components/admin/cms/PublishCenter'
import { TimelineManager } from '@/components/admin/cms/TimelineManager'
import { FounderManager } from '@/components/admin/cms/FounderManager'
import { CoreValuesManager } from '@/components/admin/cms/CoreValuesManager'
import { CommunityEventsManager } from '@/components/admin/cms/CommunityEventsManager'
import { GlobalStatisticsManager } from '@/components/admin/cms/GlobalStatisticsManager'
import { VideoGuideManager } from '@/components/admin/cms/VideoGuideManager'
import { useCMSStore } from '@/services/cms/cms.store'

type CMSSection =
  | 'publish_center'
  | 'homepage'
  | 'global_stats'
  | 'about'
  | 'founder'
  | 'timeline'
  | 'core_values'
  | 'community'
  | 'community_events'
  | 'contact'
  | 'media'
  | 'navigation'
  | 'footer'
  | 'seo'
  | 'policies'
  | 'reviews'
  | 'video_guide'

export const AdminCMSPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<CMSSection>('publish_center')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { hasUnpublishedChanges, aboutDraft, updateAboutDraft, communityDraft, updateCommunityDraft, contactDraft, updateContactDraft, globalStatsDraft, updateGlobalStatsDraft } = useCMSStore()

  // Unsaved Changes Protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnpublishedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnpublishedChanges])

  // Autosave Engine - 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnpublishedChanges) {
        // Trigger zustand to rewrite lastSaved timestamp, silently saving
        if (aboutDraft) updateAboutDraft(aboutDraft)
        if (communityDraft) updateCommunityDraft(communityDraft)
        if (contactDraft) updateContactDraft(contactDraft)
        if (globalStatsDraft) updateGlobalStatsDraft(globalStatsDraft)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [hasUnpublishedChanges, aboutDraft, communityDraft, contactDraft, globalStatsDraft, updateAboutDraft, updateCommunityDraft, updateContactDraft, updateGlobalStatsDraft])

  const navGroups = [
    {
      group: 'Workflow',
      items: [
        { id: 'publish_center', label: 'Publish Center', icon: Save, tags: 'publish master live discard' },
        { id: 'global_stats', label: 'Global Statistics', icon: BarChart, tags: 'numbers metrics data' },
      ]
    },
    {
      group: 'Pages',
      items: [
        { id: 'homepage', label: 'Homepage Builder', icon: LayoutDashboard, tags: 'home landing hero' },
        { id: 'about', label: 'About Page', icon: FileText, tags: 'about story mission vision' },
        { id: 'community', label: 'Community Page', icon: Users, tags: 'members discord telegram' },
        { id: 'contact', label: 'Knowledge Center', icon: HelpCircle, tags: 'contact support faq sla emergency' },
      ]
    },
    {
      group: 'Data Managers',
      items: [
        { id: 'founder', label: 'Founder Profile', icon: User, tags: 'ceo founder message' },
        { id: 'timeline', label: 'Company Timeline', icon: Clock, tags: 'history milestones timeline year' },
        { id: 'core_values', label: 'Core Values', icon: Star, tags: 'values principles icons' },
        { id: 'community_events', label: 'Community Events', icon: Calendar, tags: 'events meetups webinars dates' },
      ]
    },
    {
      group: 'Site Configuration',
      items: [
        { id: 'media', label: 'Media Library', icon: ImageIcon, tags: 'images videos uploads pictures' },
        { id: 'navigation', label: 'Navigation Menu', icon: LinkIcon, tags: 'links menu header' },
        { id: 'footer', label: 'Footer Settings', icon: LayoutDashboard, tags: 'footer bottom links' },
        { id: 'seo', label: 'SEO Manager', icon: Globe, tags: 'google search meta tags' },
        { id: 'policies', label: 'Policy Manager', icon: FileText, tags: 'terms privacy legal' },
        { id: 'reviews', label: 'Review Center', icon: Star, tags: 'reviews testimonials feedback' },
        { id: 'video_guide', label: 'Video Guide', icon: Video, tags: 'video guide instructions help tutorial' },
      ]
    }
  ]

  const flatNavItems = navGroups.flatMap(g => g.items)

  const filteredGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.tags.includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0)

  const renderSection = () => {
    switch (activeSection) {
      case 'publish_center': return <PublishCenter />
      case 'homepage': return <HomepageManager />
      case 'global_stats': return <GlobalStatisticsManager />
      case 'about': return <AboutManager />
      case 'founder': return <div className="p-6"><FounderManager /></div>
      case 'timeline': return <div className="p-6"><TimelineManager /></div>
      case 'core_values': return <div className="p-6"><CoreValuesManager /></div>
      case 'community': return <CommunityManager />
      case 'community_events': return <div className="p-6"><CommunityEventsManager /></div>
      case 'contact': return <ContactManager />
      case 'media': return <MediaLibraryPro />
      case 'navigation': return <NavigationBuilderPro />
      case 'footer': return <FooterBuilderPro />
      case 'seo': return <div className="p-6 text-slate-500">SEO Manager Placeholder</div>
      case 'policies': return <PolicyManager />
      case 'reviews': return <ReviewManager />
      case 'video_guide': return <VideoGuideManager />
      default: return <PublishCenter />
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row bg-slate-50 dark:bg-background overflow-hidden relative">
      
      {/* Unsaved Changes Warning Banner */}
      <AnimatePresence>
        {hasUnpublishedChanges && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 bg-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center"
          >
            You have unpublished changes. Auto-saving every 30 seconds. Don't forget to visit Publish Center.
          </motion.div>
        )}
      </AnimatePresence>

      {/* CMS Navigation Sidebar */}
      <div className={`w-full overflow-y-auto border-r border-border bg-card lg:w-72 flex flex-col ${hasUnpublishedChanges ? 'pt-8' : ''}`}>
        <div className="border-b border-border p-4 sticky top-0 bg-card z-10 space-y-4">
          <div>
            <h2 className="font-heading text-lg font-bold">Content Manager</h2>
            <p className="mt-1 text-xs text-muted-foreground">Manage public site content</p>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search CMS modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none dark:bg-slate-900"
            />
          </div>
        </div>
        <div className="flex-1 p-3 space-y-6">
          {filteredGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {group.group}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id as CMSSection)
                        if(window.innerWidth < 1024) window.scrollTo(0,0) // Mobile scroll
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 font-medium text-primary shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <div className="px-3 text-center text-sm text-slate-500 py-8">
              No modules found.
            </div>
          )}
        </div>
      </div>

      {/* Main CMS Content Area */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 ${hasUnpublishedChanges ? 'pt-12' : ''}`}>
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h1 className="font-heading text-2xl font-extrabold text-foreground">
              {flatNavItems.find((i) => i.id === activeSection)?.label || 'Module'}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[500px] rounded-xl border border-border bg-card shadow-sm overflow-hidden"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
export default AdminCMSPage
