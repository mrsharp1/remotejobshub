import React from 'react'
import { useHomepageContent, useCMSStore } from '@/services/cms/cms.store'

export const HomepageVideoManager: React.FC = () => {
  const content = useHomepageContent()
  const { updateHomepageDraft } = useCMSStore()

  const handleUpdate = (videoKey: keyof typeof content.videos, field: string, value: any) => {
    updateHomepageDraft({
      ...content,
      videos: {
        ...content.videos,
        [videoKey]: {
          ...content.videos[videoKey],
          [field]: value
        }
      }
    })
  }

  const videos = [
    { key: 'hero', label: 'Background Hero Video' },
    { key: 'marketplace', label: 'Marketplace Promo Video' },
    { key: 'trust', label: 'Trust Video' },
    { key: 'community', label: 'Community Video' },
    { key: 'about', label: 'About Video' }
  ] as const

  return (
    <div className="space-y-8">
      <h3 className="font-heading text-lg font-bold">Homepage Videos</h3>
      
      {videos.map(({ key, label }) => {
        const video = content.videos[key]
        return (
          <div key={key} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h4 className="font-semibold text-md">{label}</h4>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Video URL (MP4 or WebM)</label>
                <input 
                  type="text" 
                  value={video.url}
                  onChange={e => handleUpdate(key, 'url', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Fallback Image / Thumbnail URL</label>
                <input 
                  type="text" 
                  value={video.thumbnail}
                  onChange={e => handleUpdate(key, 'thumbnail', e.target.value)}
                  placeholder="https://example.com/thumb.jpg"
                  className="w-full rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={video.autoplay}
                  onChange={e => handleUpdate(key, 'autoplay', e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary"
                />
                <span className="text-sm font-medium">Autoplay</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={video.loop}
                  onChange={e => handleUpdate(key, 'loop', e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary"
                />
                <span className="text-sm font-medium">Loop</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={video.mute}
                  onChange={e => handleUpdate(key, 'mute', e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary"
                />
                <span className="text-sm font-medium">Muted</span>
              </label>
            </div>
          </div>
        )
      })}
    </div>
  )
}
