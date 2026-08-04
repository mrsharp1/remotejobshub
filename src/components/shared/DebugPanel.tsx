import React from 'react'
import { useCMSStore } from '@/services/cms/cms.store'

export const DebugPanel: React.FC = () => {
  const { reviewsContent: storeContent, reviewsDraft: storeDraft, storeId } = useCMSStore()
  
  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black text-white p-4 font-mono text-xs max-h-[80vh] overflow-y-auto opacity-90 border border-green-500 rounded">
      <h3 className="font-bold text-green-400 mb-2">CMS DEBUG PANEL - Store ID: {storeId}</h3>
      
      <div className="mb-4">
        <h4 className="text-yellow-400">Store reviewsDraft</h4>
        <div>Written Length: {storeDraft?.writtenReviews?.length ?? 'null'}</div>
        <div>Video Length: {storeDraft?.videoTestimonials?.length ?? 'null'}</div>
        {storeDraft?.writtenReviews?.map(r => (
          <div key={r.id} className="ml-2 text-gray-400">- {r.id}: {r.title} (Home: {String(r.showOnHomepage)})</div>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="text-blue-400">Store reviewsContent</h4>
        <div>Written Length: {storeContent?.writtenReviews?.length ?? 'null'}</div>
        <div>Video Length: {storeContent?.videoTestimonials?.length ?? 'null'}</div>
        {storeContent?.writtenReviews?.map(r => (
          <div key={r.id} className="ml-2 text-gray-400">- {r.id}: {r.title} (Home: {String(r.showOnHomepage)})</div>
        ))}
      </div>
      
    </div>
  )
}
