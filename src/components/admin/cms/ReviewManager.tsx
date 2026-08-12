import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, CheckCircle, Search, Star, Video, MessageSquare, Eye, EyeOff, UploadCloud, Image as ImageIcon } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'
import { storageService } from '@/services/marketplace/storage.service'
import { cmsReviewsService, CMSWrittenReview, CMSVideoTestimonial } from '@/services/cms/cms-reviews.service'
import { useAuth } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabase'

export const ReviewManager: React.FC = () => {
  const { addMedia } = useCMSStore()
  const { profile, isAuthenticated } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'written' | 'video'>('written')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Data state from Supabase
  const [writtenReviews, setWrittenReviews] = useState<CMSWrittenReview[]>([])
  const [videoTestimonials, setVideoTestimonials] = useState<CMSVideoTestimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingWritten, setEditingWritten] = useState<Partial<CMSWrittenReview> | null>(null)
  const [editingVideo, setEditingVideo] = useState<Partial<CMSVideoTestimonial> | null>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFilename, setUploadFilename] = useState('')

  // Diagnostic logging
  useEffect(() => {
    const runDiagnostic = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('CMS REVIEW AUTH CHECK')
      console.log(`authenticated: ${session ? 'YES' : 'NO'}`)
      console.log(`user id: ${session?.user?.id || 'NONE'}`)
      console.log(`profile_role: ${profile?.role || 'NONE'}`)
    }
    runDiagnostic()
  }, [profile])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [written, videos] = await Promise.all([
        cmsReviewsService.getWrittenReviews(),
        cmsReviewsService.getVideoTestimonials()
      ])
      setWrittenReviews(written)
      setVideoTestimonials(videos)
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err)
      setError(err.message || 'Failed to fetch reviews')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const finishVideoUpload = async (file: File) => {
    try {
      const ext = file.name.split('.').pop() || 'mp4'
      const generatedPath = `videos/${crypto.randomUUID()}.${ext}`
      
      const publicVideoUrl = await storageService.uploadFile(
        'testimonials-videos',
        generatedPath,
        file
      )

      const tempVideoUrl = URL.createObjectURL(file)
      const videoElement = document.createElement('video')
      videoElement.src = tempVideoUrl
      videoElement.crossOrigin = 'anonymous'
      videoElement.muted = true
      videoElement.currentTime = 1 
      
      videoElement.onloadeddata = async () => {
        const canvas = document.createElement('canvas')
        canvas.width = videoElement.videoWidth || 640
        canvas.height = videoElement.videoHeight || 360
        const ctx = canvas.getContext('2d')
        let publicThumbUrl = ''

        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.7)
          
          const res = await fetch(thumbnailDataUrl)
          const blob = await res.blob()
          const thumbFile = new File([blob], `thumb_${crypto.randomUUID()}.jpg`, { type: 'image/jpeg' })

          publicThumbUrl = await storageService.uploadFile(
            'testimonials-thumbnails',
            `thumbnails/${crypto.randomUUID()}.jpg`,
            thumbFile
          )
        }
        
        addMedia({
          id: crypto.randomUUID(),
          name: file.name,
          url: publicVideoUrl,
          type: 'video',
          folder: 'Testimonials',
          size: file.size,
          usageIndicator: ['ReviewManager']
        })

        setEditingVideo(prev => prev ? { ...prev, videoUrl: publicVideoUrl, thumbnail: publicThumbUrl } : null)
        URL.revokeObjectURL(tempVideoUrl)
        setIsUploading(false)
        setUploadProgress(0)
      }

      videoElement.onerror = () => {
        addMedia({
          id: crypto.randomUUID(),
          name: file.name,
          url: publicVideoUrl,
          type: 'video',
          folder: 'Testimonials',
          size: file.size,
          usageIndicator: ['ReviewManager']
        })
        setEditingVideo(prev => prev ? { ...prev, videoUrl: publicVideoUrl } : null)
        URL.revokeObjectURL(tempVideoUrl)
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (err) {
      console.error('Video upload failed', err)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadFilename(file.name)
    setIsUploading(true)
    setUploadProgress(0)

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        finishVideoUpload(file)
      }
    }, 200)
  }

  const handleCustomThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const generatedPath = `thumbnails/${crypto.randomUUID()}.${ext}`
      const publicThumbUrl = await storageService.uploadFile(
        'testimonials-thumbnails',
        generatedPath,
        file
      )

      setEditingVideo(prev => prev ? { ...prev, thumbnail: publicThumbUrl } : null)
      
      addMedia({
        id: crypto.randomUUID(),
        name: file.name,
        url: publicThumbUrl,
        type: 'image',
        folder: 'Testimonials',
        size: file.size,
        usageIndicator: ['ReviewManager']
      })
    } catch (err) {
      console.error('Custom thumbnail upload failed', err)
    }
  }

  const saveWritten = async () => {
    if (!editingWritten?.customerName || !editingWritten?.body) return
    
    setError(null)
    try {
      const reviewPayload = {
        customerName: editingWritten.customerName || '',
        country: editingWritten.country || '',
        platformPurchased: editingWritten.platformPurchased || 'Upwork',
        rating: editingWritten.rating || 5,
        title: editingWritten.title || '',
        body: editingWritten.body || '',
        avatar: editingWritten.avatar || '',
        verified: editingWritten.verified ?? true,
        isFeatured: editingWritten.isFeatured ?? false,
        showOnHomepage: editingWritten.showOnHomepage ?? true,
        showOnMarketplace: editingWritten.showOnMarketplace ?? true,
        showOnCommunity: editingWritten.showOnCommunity ?? true,
        showOnAbout: editingWritten.showOnAbout ?? true,
        showOnSellerProfile: editingWritten.showOnSellerProfile ?? true
      }

      if (editingWritten.id) {
        await cmsReviewsService.updateWrittenReview(editingWritten.id, reviewPayload)
      } else {
        await cmsReviewsService.createWrittenReview(reviewPayload)
      }
      
      await fetchData()
      setEditingWritten(null)
    } catch (err: any) {
      console.error('Save written review failed:', err)
      setError(`code: ${err?.code}\nmessage: ${err?.message}\ndetails: ${err?.details}\nhint: ${err?.hint}`)
    }
  }

  const deleteWritten = async (id: string) => {
    setError(null)
    try {
      await cmsReviewsService.deleteWrittenReview(id)
      await fetchData()
    } catch (err: any) {
      console.error('Delete written review failed:', err)
      setError(`code: ${err?.code}\nmessage: ${err?.message}\ndetails: ${err?.details}\nhint: ${err?.hint}`)
    }
  }

  const toggleWrittenProp = async (id: string, prop: keyof CMSWrittenReview) => {
    const review = writtenReviews.find(r => r.id === id)
    if (!review) return
    setError(null)
    try {
      await cmsReviewsService.updateWrittenReview(id, { [prop]: !review[prop] })
      await fetchData()
    } catch (err: any) {
      console.error('Toggle property failed:', err)
      setError(`code: ${err?.code}\nmessage: ${err?.message}\ndetails: ${err?.details}\nhint: ${err?.hint}`)
    }
  }

  const saveVideo = async () => {
    if (!editingVideo?.customerName || !editingVideo?.videoUrl) return
    setError(null)
    
    try {
      const videoPayload = {
        videoUrl: editingVideo.videoUrl || '',
        thumbnail: editingVideo.thumbnail || '',
        customerName: editingVideo.customerName || '',
        country: editingVideo.country || '',
        rating: editingVideo.rating || 5,
        summary: editingVideo.summary || '',
        duration: editingVideo.duration || '1m',
        displayOrder: editingVideo.displayOrder || 0,
        isFeatured: editingVideo.isFeatured ?? false,
        showOnHomepage: editingVideo.showOnHomepage ?? true,
        showOnMarketplace: editingVideo.showOnMarketplace ?? true,
        showOnCommunity: editingVideo.showOnCommunity ?? true,
        showOnAbout: editingVideo.showOnAbout ?? true,
        showOnSellerProfile: editingVideo.showOnSellerProfile ?? true,
      }

      if (editingVideo.id) {
        await cmsReviewsService.updateVideoTestimonial(editingVideo.id, videoPayload)
      } else {
        await cmsReviewsService.createVideoTestimonial(videoPayload)
      }

      await fetchData()
      setEditingVideo(null)
    } catch (err: any) {
      console.error('Save video testimonial failed:', err)
      setError(`code: ${err?.code}\nmessage: ${err?.message}\ndetails: ${err?.details}\nhint: ${err?.hint}`)
    }
  }

  const deleteVideo = async (id: string) => {
    setError(null)
    try {
      await cmsReviewsService.deleteVideoTestimonial(id)
      await fetchData()
    } catch (err: any) {
      console.error('Delete video testimonial failed:', err)
      setError(`code: ${err?.code}\nmessage: ${err?.message}\ndetails: ${err?.details}\nhint: ${err?.hint}`)
    }
  }

  const toggleVideoProp = async (id: string, prop: keyof CMSVideoTestimonial) => {
    const video = videoTestimonials.find(v => v.id === id)
    if (!video) return
    setError(null)
    try {
      await cmsReviewsService.updateVideoTestimonial(id, { [prop]: !video[prop] })
      await fetchData()
    } catch (err: any) {
      console.error('Toggle video property failed:', err)
      setError(`code: ${err?.code}\nmessage: ${err?.message}\ndetails: ${err?.details}\nhint: ${err?.hint}`)
    }
  }

  const filteredWritten = writtenReviews.filter(r => 
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.body.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredVideos = videoTestimonials.filter(v => 
    v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col relative">
      {/* Header Tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab('written')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${
            activeTab === 'written' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Written Reviews
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${
            activeTab === 'video' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50'
          }`}
        >
          <Video className="h-4 w-4" />
          Video Testimonials
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-background">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-900">
            <h4 className="font-bold mb-1">Operation Failed</h4>
            <pre className="text-xs whitespace-pre-wrap font-mono">{error}</pre>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => activeTab === 'written' ? setEditingWritten({}) : setEditingVideo({})}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add {activeTab === 'written' ? 'Review' : 'Video'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* WRITTEN REVIEWS */}
            {activeTab === 'written' && (
              <div className="space-y-4">
                {filteredWritten.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                    No written reviews found. Click 'Add Review' to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredWritten.map(review => (
                      <div key={review.id} className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                                {review.avatar ? <img src={review.avatar} alt={review.customerName} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-primary/10 text-primary flex items-center justify-center font-bold">{review.customerName.charAt(0)}</div>}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm flex items-center gap-1">
                                  {review.customerName} {review.verified && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                                </h4>
                                <p className="text-xs text-muted-foreground">{review.country} • {review.platformPurchased}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 text-yellow-500">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-bold text-sm">{review.title}</h5>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{review.body}</p>
                          </div>
                        </div>
                        
                        <div className="pt-2 flex items-center justify-between border-t border-border mt-3">
                          <div className="flex gap-2">
                            <button onClick={() => toggleWrittenProp(review.id, 'isFeatured')} className={`p-1.5 rounded-md ${review.isFeatured ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Toggle Featured">
                              <Star className={`h-4 w-4 ${review.isFeatured ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={() => toggleWrittenProp(review.id, 'showOnHomepage')} className={`p-1.5 rounded-md ${review.showOnHomepage ? 'text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Show on Homepage">
                              {review.showOnHomepage ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button onClick={() => toggleWrittenProp(review.id, 'showOnMarketplace')} className={`p-1.5 rounded-md text-xs font-bold ${review.showOnMarketplace ? 'text-indigo-500' : 'text-slate-400'}`} title="Show on Marketplace">MP</button>
                            <button onClick={() => toggleWrittenProp(review.id, 'showOnCommunity')} className={`p-1.5 rounded-md text-xs font-bold ${review.showOnCommunity ? 'text-violet-500' : 'text-slate-400'}`} title="Show on Community">CO</button>
                            <button onClick={() => toggleWrittenProp(review.id, 'showOnAbout')} className={`p-1.5 rounded-md text-xs font-bold ${review.showOnAbout ? 'text-emerald-500' : 'text-slate-400'}`} title="Show on About">AB</button>
                            <button onClick={() => toggleWrittenProp(review.id, 'showOnSellerProfile')} className={`p-1.5 rounded-md text-xs font-bold ${review.showOnSellerProfile ? 'text-pink-500' : 'text-slate-400'}`} title="Show on Seller Profile">SP</button>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingWritten(review)} className="p-1.5 text-slate-400 hover:text-primary">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteWritten(review.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIDEO TESTIMONIALS */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                {filteredVideos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                    No video testimonials found. Click 'Add Video' to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVideos.map(video => (
                      <div key={video.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
                        <div className="relative h-48 bg-slate-200">
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.customerName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400"><Video className="h-10 w-10" /></div>
                          )}
                          <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs font-bold text-white">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-sm">{video.customerName}</h4>
                                <p className="text-xs text-muted-foreground">{video.country}</p>
                              </div>
                              <div className="flex gap-1 text-yellow-500">
                                {Array.from({ length: video.rating }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{video.summary}</p>
                          </div>
                          
                          <div className="pt-3 border-t border-border flex items-center justify-between">
                            <div className="flex gap-2">
                              <button onClick={() => toggleVideoProp(video.id, 'isFeatured')} className={`p-1.5 rounded-md ${video.isFeatured ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'text-slate-400 hover:bg-slate-100'}`} title="Toggle Featured">
                                <Star className={`h-4 w-4 ${video.isFeatured ? 'fill-current' : ''}`} />
                              </button>
                              <button onClick={() => toggleVideoProp(video.id, 'showOnHomepage')} className={`p-1.5 rounded-md ${video.showOnHomepage ? 'text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Show on Homepage">
                                {video.showOnHomepage ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button onClick={() => toggleVideoProp(video.id, 'showOnMarketplace')} className={`p-1.5 rounded-md text-xs font-bold ${video.showOnMarketplace ? 'text-indigo-500' : 'text-slate-400'}`} title="Show on Marketplace">MP</button>
                              <button onClick={() => toggleVideoProp(video.id, 'showOnCommunity')} className={`p-1.5 rounded-md text-xs font-bold ${video.showOnCommunity ? 'text-violet-500' : 'text-slate-400'}`} title="Show on Community">CO</button>
                              <button onClick={() => toggleVideoProp(video.id, 'showOnAbout')} className={`p-1.5 rounded-md text-xs font-bold ${video.showOnAbout ? 'text-emerald-500' : 'text-slate-400'}`} title="Show on About">AB</button>
                              <button onClick={() => toggleVideoProp(video.id, 'showOnSellerProfile')} className={`p-1.5 rounded-md text-xs font-bold ${video.showOnSellerProfile ? 'text-pink-500' : 'text-slate-400'}`} title="Show on Seller Profile">SP</button>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingVideo(video)} className="p-1.5 text-slate-400 hover:text-primary">
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteVideo(video.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Editor Modal for Written */}
      {editingWritten && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-bold">{editingWritten.id ? 'Edit Review' : 'Add Review'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Customer Name</label>
                  <input type="text" value={editingWritten.customerName || ''} onChange={e => setEditingWritten({...editingWritten, customerName: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Country</label>
                  <input type="text" value={editingWritten.country || ''} onChange={e => setEditingWritten({...editingWritten, country: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Platform</label>
                  <input type="text" value={editingWritten.platformPurchased || ''} onChange={e => setEditingWritten({...editingWritten, platformPurchased: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={editingWritten.rating || 5} onChange={e => setEditingWritten({...editingWritten, rating: parseInt(e.target.value)})} className="w-full rounded-lg border bg-background p-2 mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Review Title</label>
                <input type="text" value={editingWritten.title || ''} onChange={e => setEditingWritten({...editingWritten, title: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm font-semibold">Review Body</label>
                <textarea rows={4} value={editingWritten.body || ''} onChange={e => setEditingWritten({...editingWritten, body: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm font-semibold">Avatar URL</label>
                <input type="text" value={editingWritten.avatar || ''} onChange={e => setEditingWritten({...editingWritten, avatar: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                <button onClick={() => setEditingWritten(null)} className="flex-1 rounded-xl border p-2 text-center font-bold hover:bg-muted">Cancel</button>
                <button onClick={saveWritten} className="flex-1 rounded-xl bg-primary p-2 text-center font-bold text-primary-foreground hover:bg-primary/90">Save Review</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal for Video */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-xl font-bold">{editingVideo.id ? 'Edit Video Testimonial' : 'Add Video Testimonial'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Customer Name</label>
                  <input type="text" value={editingVideo.customerName || ''} onChange={e => setEditingVideo({...editingVideo, customerName: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Country</label>
                  <input type="text" value={editingVideo.country || ''} onChange={e => setEditingVideo({...editingVideo, country: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
                </div>
              </div>
              
              <div className="space-y-4 rounded-xl border border-border bg-slate-50/50 p-4 dark:bg-slate-900/50">
                <div>
                  <label className="text-sm font-semibold">Video File</label>
                  {!editingVideo.videoUrl && !isUploading && (
                    <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-border px-6 py-8 hover:bg-muted/50 transition">
                      <div className="text-center">
                        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                          <label htmlFor="video-upload" className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none hover:text-primary/80">
                            <span>Upload a video</span>
                            <input id="video-upload" type="file" className="sr-only" accept="video/mp4,video/quicktime,video/webm" onChange={handleVideoUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground">MP4, MOV, WebM up to 50MB</p>
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className="mt-2 rounded-xl border border-border bg-card p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{uploadFilename}</span>
                        <span className="text-muted-foreground">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center animate-pulse">Processing and generating thumbnail...</p>
                    </div>
                  )}

                  {editingVideo.videoUrl && !isUploading && (
                    <div className="mt-2 rounded-xl border border-border bg-black overflow-hidden relative group">
                      <video src={editingVideo.videoUrl} className="w-full h-48 object-cover opacity-80" controls />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label htmlFor="video-replace" className="cursor-pointer rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 shadow-sm hover:bg-white">
                          Replace
                          <input id="video-replace" type="file" className="sr-only" accept="video/mp4,video/quicktime,video/webm" onChange={handleVideoUpload} />
                        </label>
                        <button onClick={() => setEditingVideo({...editingVideo, videoUrl: '', thumbnail: ''})} className="rounded-md bg-red-500/90 px-2 py-1 text-xs font-bold text-white shadow-sm hover:bg-red-500">
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {editingVideo.thumbnail && !isUploading && (
                  <div>
                    <label className="text-sm font-semibold flex items-center justify-between">
                      Thumbnail Preview
                      <label htmlFor="thumb-upload" className="cursor-pointer text-xs text-primary flex items-center gap-1 hover:underline">
                        <ImageIcon className="h-3 w-3" /> Custom Thumbnail
                        <input id="thumb-upload" type="file" className="sr-only" accept="image/*" onChange={handleCustomThumbnail} />
                      </label>
                    </label>
                    <div className="mt-2 relative h-32 w-full max-w-[200px] overflow-hidden rounded-lg border border-border bg-slate-200">
                      <img src={editingVideo.thumbnail} alt="Video Thumbnail" className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={editingVideo.rating || 5} onChange={e => setEditingVideo({...editingVideo, rating: parseInt(e.target.value)})} className="w-full rounded-lg border bg-background p-2 mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Duration</label>
                  <select value={editingVideo.duration || '1m'} onChange={e => setEditingVideo({...editingVideo, duration: e.target.value as any})} className="w-full rounded-lg border bg-background p-2 mt-1">
                    <option value="30s">30 sec</option>
                    <option value="45s">45 sec</option>
                    <option value="1m">1 minute</option>
                    <option value="2m">2 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Summary / Quote</label>
                <textarea rows={2} value={editingVideo.summary || ''} onChange={e => setEditingVideo({...editingVideo, summary: e.target.value})} className="w-full rounded-lg border bg-background p-2 mt-1" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
                <button onClick={() => setEditingVideo(null)} className="flex-1 rounded-xl border p-2 text-center font-bold hover:bg-muted">Cancel</button>
                <button onClick={saveVideo} className="flex-1 rounded-xl bg-primary p-2 text-center font-bold text-primary-foreground hover:bg-primary/90">Save Video</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status Bar (Replaces Publish Bar) */}
      <div className="border-t border-border bg-card p-4 flex justify-between items-center text-sm text-muted-foreground">
        <p>Reviews are now saved instantly to the database.</p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${isAuthenticated ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            {isAuthenticated ? 'Connected' : 'Disconnected'}
          </span>
          <button onClick={fetchData} className="text-primary hover:underline">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}
