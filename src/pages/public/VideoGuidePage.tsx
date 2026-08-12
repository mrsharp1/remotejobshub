import React, { useEffect, useState } from 'react'
import { Video, HelpCircle } from 'lucide-react'
import { videoGuideService, VideoGuide } from '@/services/cms/videoGuide.service'

export const VideoGuidePage: React.FC = () => {
  const [guide, setGuide] = useState<VideoGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGuide = async () => {
      try {
        const data = await videoGuideService.getPublishedGuide()
        setGuide(data)
      } catch (err) {
        console.error('Failed to load video guide', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadGuide()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-muted-foreground">
        <Video className="mb-4 h-12 w-12 animate-pulse opacity-50" />
        <p className="text-lg font-medium">Loading Video Guide...</p>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 border shadow-sm">
          <HelpCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Video Guide
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Video Guide currently unavailable. We are working on updating our instructional materials. Check back soon!
        </p>
      </div>
    )
  }

  const videoUrl = videoGuideService.getPublicUrl(guide.storage_path)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
            {guide.title}
          </h1>
          {guide.description && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {guide.description}
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border bg-black shadow-xl ring-1 ring-border/50">
          <div className="aspect-video w-full relative bg-black flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              controlsList="nodownload"
              className="h-full w-full object-contain"
              poster=""
            />
          </div>
        </div>
      </div>
    </div>
  )
}
