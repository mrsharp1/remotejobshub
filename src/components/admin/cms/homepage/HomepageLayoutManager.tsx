import React from 'react'
import { Reorder } from 'framer-motion'
import { GripVertical, Eye, EyeOff } from 'lucide-react'
import { useHomepageContent, useCMSStore } from '@/services/cms/cms.store'

export const HomepageLayoutManager: React.FC = () => {
  const content = useHomepageContent()
  const { updateHomepageDraft } = useCMSStore()

  const handleReorder = (newLayout: typeof content.layout) => {
    updateHomepageDraft({
      ...content,
      layout: newLayout.map((item, index) => ({ ...item, order: index }))
    })
  }

  const toggleVisibility = (id: string) => {
    updateHomepageDraft({
      ...content,
      layout: content.layout.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    })
  }

  const sectionLabels: Record<string, string> = {
    hero: 'Hero Section',
    stats: 'Statistics Bar',
    trust: 'Trust Badges & Security',
    featured_listings: 'Featured Listings',
    categories: 'Browse Categories',
    buyer_journey: 'Buyer Journey Timeline',
    success_wall: 'Success Stories Wall',
    featured_sellers: 'Featured Sellers',
    reviews: 'Written Reviews',
    video_testimonials: 'Video Testimonials',
    faq: 'Frequently Asked Questions',
    community_cta: 'Community CTA Banner',
    final_cta: 'Bottom Final CTA'
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="font-heading text-lg font-bold">Homepage Layout Ordering</h3>
      <p className="text-sm text-muted-foreground">Drag and drop sections to reorder how they appear on the homepage. Toggle the eye icon to show or hide a section entirely.</p>
      
      <Reorder.Group 
        axis="y" 
        values={content.layout} 
        onReorder={handleReorder}
        className="space-y-3"
      >
        {content.layout.map((item) => (
          <Reorder.Item 
            key={item.id} 
            value={item}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-colors bg-card ${
              item.enabled ? 'border-border' : 'border-dashed border-border bg-muted/50 opacity-60'
            }`}
          >
            <GripVertical className="h-5 w-5 cursor-grab text-slate-400 active:cursor-grabbing" />
            <div className="flex-1 font-semibold">
              {sectionLabels[item.id] || item.id}
            </div>
            <button 
              onClick={() => toggleVisibility(item.id)}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              title={item.enabled ? 'Hide Section' : 'Show Section'}
            >
              {item.enabled ? (
                <Eye className="h-5 w-5 text-primary" />
              ) : (
                <EyeOff className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}
