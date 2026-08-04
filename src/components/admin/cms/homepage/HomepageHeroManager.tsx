import React from 'react'
import { useHomepageContent, useCMSStore } from '@/services/cms/cms.store'

export const HomepageHeroManager: React.FC = () => {
  const content = useHomepageContent()
  const { updateHomepageDraft } = useCMSStore()

  const handleUpdate = (field: keyof typeof content.hero, value: any) => {
    updateHomepageDraft({
      ...content,
      hero: {
        ...content.hero,
        [field]: value
      }
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="font-heading text-lg font-bold">Hero Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">Headline</label>
          <input 
            type="text" 
            value={content.hero.headline}
            onChange={e => handleUpdate('headline', e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Subheadline</label>
          <textarea 
            value={content.hero.subheadline}
            onChange={e => handleUpdate('subheadline', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Primary CTA Button</label>
          <input 
            type="text" 
            value={content.hero.ctaText}
            onChange={e => handleUpdate('ctaText', e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <input 
            type="checkbox" 
            checked={content.hero.trustBadgesEnabled}
            onChange={e => handleUpdate('trustBadgesEnabled', e.target.checked)}
            className="h-5 w-5 rounded border-border text-primary"
          />
          <div>
            <p className="font-semibold">Display Trust Badges</p>
            <p className="text-xs text-muted-foreground">Show security and escrow badges under CTA</p>
          </div>
        </div>
      </div>
    </div>
  )
}
