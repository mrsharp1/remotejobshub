import React from 'react'
import { useHomepageContent, useCMSStore } from '@/services/cms/cms.store'

export const HomepageFeaturedListingsManager: React.FC = () => {
  const content = useHomepageContent()
  const { updateHomepageDraft } = useCMSStore()

  const handleUpdateMode = (mode: 'auto' | 'manual', key: 'featuredSellersMode' | 'featuredListingsMode') => {
    updateHomepageDraft({
      ...content,
      [key]: mode
    })
  }

  return (
    <div className="space-y-12">
      <div className="max-w-2xl space-y-6">
        <h3 className="font-heading text-lg font-bold">Featured Sellers</h3>
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => handleUpdateMode('auto', 'featuredSellersMode')} 
            className={`flex-1 rounded-xl border p-4 text-center transition-colors ${content.featuredSellersMode === 'auto' ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <p className="font-bold">Auto-Feature</p>
            <p className="text-xs text-muted-foreground mt-1">Highest rated KYC sellers</p>
          </button>
          <button 
            onClick={() => handleUpdateMode('manual', 'featuredSellersMode')} 
            className={`flex-1 rounded-xl border p-4 text-center transition-colors ${content.featuredSellersMode === 'manual' ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <p className="font-bold">Manual Selection</p>
            <p className="text-xs text-muted-foreground mt-1">Hand-pick sellers to feature</p>
          </button>
        </div>
        {content.featuredSellersMode === 'manual' && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Search and add sellers to feature them on the homepage. (Search capability upcoming)
          </div>
        )}
      </div>

      <div className="max-w-2xl space-y-6">
        <h3 className="font-heading text-lg font-bold">Featured Listings</h3>
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => handleUpdateMode('auto', 'featuredListingsMode')} 
            className={`flex-1 rounded-xl border p-4 text-center transition-colors ${content.featuredListingsMode === 'auto' ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <p className="font-bold">Auto-Trending</p>
            <p className="text-xs text-muted-foreground mt-1">Most viewed & purchased</p>
          </button>
          <button 
            onClick={() => handleUpdateMode('manual', 'featuredListingsMode')} 
            className={`flex-1 rounded-xl border p-4 text-center transition-colors ${content.featuredListingsMode === 'manual' ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <p className="font-bold">Manual Curation</p>
            <p className="text-xs text-muted-foreground mt-1">Pin specific listings</p>
          </button>
        </div>
        {content.featuredListingsMode === 'manual' && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Search and pin listings to the homepage. (Search capability upcoming)
          </div>
        )}
      </div>
    </div>
  )
}
