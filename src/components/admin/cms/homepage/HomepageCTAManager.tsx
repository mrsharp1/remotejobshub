import React from 'react'
import { useHomepageContent, useCMSStore } from '@/services/cms/cms.store'

export const HomepageCTAManager: React.FC = () => {
  const content = useHomepageContent()
  const { updateHomepageDraft } = useCMSStore()

  const handleUpdate = (field: keyof typeof content.ctaSection, value: string) => {
    updateHomepageDraft({
      ...content,
      ctaSection: {
        ...content.ctaSection,
        [field]: value
      }
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="font-heading text-lg font-bold">Bottom CTA Banner</h3>
      <p className="text-sm text-muted-foreground">This section appears just above the footer.</p>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">Headline</label>
          <input 
            type="text" 
            value={content.ctaSection.headline}
            onChange={e => handleUpdate('headline', e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Subheadline</label>
          <textarea 
            value={content.ctaSection.subheadline}
            onChange={e => handleUpdate('subheadline', e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Button Text</label>
          <input 
            type="text" 
            value={content.ctaSection.buttonText}
            onChange={e => handleUpdate('buttonText', e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  )
}
