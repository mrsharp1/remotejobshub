import React, { useState, useEffect } from 'react'
import { Upload, X, Save, Eye, EyeOff, Video, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { videoGuideService, VideoGuide } from '@/services/cms/videoGuide.service'
import { useAuthStore } from '@/stores/authStore'

export const VideoGuideManager: React.FC = () => {
  const { user } = useAuthStore()
  const [guide, setGuide] = useState<VideoGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchGuide()
  }, [])

  const fetchGuide = async () => {
    setIsLoading(true)
    try {
      const data = await videoGuideService.getGuideAdmin()
      setGuide(data)
      if (data) {
        setTitle(data.title)
        setDescription(data.description || '')
      }
    } catch (err) {
      toast.error('Failed to load video guide data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video must be under 100MB')
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    if (!user) return
    if (!selectedFile) {
      toast.error('Please select a video file')
      return
    }
    if (!title) {
      toast.error('Title is required')
      return
    }

    setIsUploading(true)
    try {
      const newGuide = await videoGuideService.uploadGuide(selectedFile, title, description, user.id)
      setGuide(newGuide)
      setSelectedFile(null)
      setPreviewUrl(null)
      toast.success('Video guide uploaded successfully (Saved as Draft)')
    } catch (err) {
      toast.error('Failed to upload video guide')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveMetadata = async () => {
    if (!guide) return
    setIsSaving(true)
    try {
      const updated = await videoGuideService.updateGuide(guide.id, { title, description })
      setGuide(updated)
      toast.success('Metadata updated successfully')
    } catch {
      toast.error('Failed to update metadata')
    } finally {
      setIsSaving(false)
    }
  }

  const togglePublish = async () => {
    if (!guide) return
    setIsSaving(true)
    try {
      const updated = await videoGuideService.updateGuide(guide.id, { is_published: !guide.is_published })
      setGuide(updated)
      toast.success(`Video guide ${updated.is_published ? 'published' : 'unpublished'}`)
    } catch {
      toast.error('Failed to toggle publish state')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!guide) return
    if (!window.confirm('Are you sure you want to permanently delete this video guide?')) return

    setIsSaving(true)
    try {
      await videoGuideService.deleteGuide(guide.id, guide.storage_path)
      setGuide(null)
      setTitle('')
      setDescription('')
      toast.success('Video guide deleted successfully')
    } catch {
      toast.error('Failed to delete video guide')
    } finally {
      setIsSaving(false)
    }
  }

  const cancelSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (guide) {
      setTitle(guide.title)
      setDescription(guide.description || '')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading video guide data...</div>
  }

  const activeVideoUrl = guide ? videoGuideService.getPublicUrl(guide.storage_path) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Video Guide</h2>
          <p className="text-muted-foreground mt-1">Manage the instructional video guide for users.</p>
        </div>
        {guide && (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${guide.is_published ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {guide.is_published ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {guide.is_published ? 'Published' : 'Draft'}
            </span>
            <button
              onClick={togglePublish}
              disabled={isSaving || isUploading}
              className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              {guide.is_published ? (
                <><EyeOff className="h-4 w-4" /> Unpublish</>
              ) : (
                <><Eye className="h-4 w-4" /> Publish</>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isSaving || isUploading}
              className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Form */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Guide Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to use Remote Jobs Hub"
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this guide covers..."
              rows={4}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {!guide || selectedFile ? (
            <div className="space-y-3">
              <label className="text-sm font-medium block">Video File (MP4/WebM, max 100MB)</label>
              <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:bg-muted">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileSelect}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center text-center">
                  <Video className="mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    {selectedFile ? selectedFile.name : 'Click or drag video to upload'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'MP4 or WebM up to 100MB'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-3 pt-4 border-t">
            {selectedFile ? (
              <>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !title}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'Uploading...' : guide ? 'Upload Replacement' : 'Upload Video Guide'}
                </button>
                <button
                  onClick={cancelSelection}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
              </>
            ) : guide ? (
              <button
                onClick={handleSaveMetadata}
                disabled={isSaving || (title === guide.title && description === guide.description)}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Metadata'}
              </button>
            ) : null}
          </div>
        </div>

        {/* Video Preview */}
        <div className="overflow-hidden rounded-xl border bg-black shadow-sm flex items-center justify-center aspect-video relative">
          {previewUrl || activeVideoUrl ? (
            <video
              src={previewUrl || activeVideoUrl!}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-500">
              <Video className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm font-medium">No video uploaded</p>
            </div>
          )}
          {previewUrl && (
            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Preview
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
