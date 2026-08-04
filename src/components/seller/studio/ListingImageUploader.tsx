import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react'

interface ListingImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export const ListingImageUploader: React.FC<ListingImageUploaderProps> = ({
  images,
  onChange,
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const addImages = (files: FileList) => {
    if (images.length + files.length > 10) {
      setErrorMsg('You can upload a maximum of 10 images.')
      return
    }

    setErrorMsg(null)
    const newImages = [...images]

    Array.from(files).forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg('Only JPG, PNG and WEBP files are allowed.')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Each image must be smaller than 2MB.')
        return
      }

      const url = URL.createObjectURL(file)
      newImages.push(url)
    })

    onChange(newImages)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addImages(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addImages(e.target.files)
    }
  }

  const removeImage = (idxToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== idxToRemove)
    onChange(updated)
  }

  const moveImage = (idx: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= images.length) return

    const updated = [...images]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-foreground">
          Listing Images (Max 10)
        </label>
        <span className="text-xs text-muted-foreground">
          {images.length} / 10 uploaded
        </span>
      </div>

      {errorMsg && (
        <p className="text-xs font-semibold text-destructive">{errorMsg}</p>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition-colors ${
          dragActive
            ? 'bg-primary/5 border-primary'
            : 'hover:bg-muted/10 border-border bg-card'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="premium-input absolute inset-0 cursor-pointer opacity-0"
          onChange={handleFileSelect}
        />
        <div className="bg-primary/10 rounded-full p-3 text-primary">
          <Upload className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Drag & drop images here, or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Supports JPG, PNG, WEBP (Max 2MB per file)
        </p>
      </div>

      {/* Preview and Reordering list */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((url, idx) => (
            <motion.div
              layout
              key={url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-video overflow-hidden rounded-lg border bg-muted shadow-sm"
            >
              <img
                src={url}
                alt={`Uploaded preview ${idx + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Action overlays */}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveImage(idx, 'left')}
                  disabled={idx === 0}
                  className="bg-background/90 rounded p-1 text-foreground hover:bg-background disabled:opacity-50"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="hover:bg-destructive/95 rounded bg-destructive p-1 text-destructive-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(idx, 'right')}
                  disabled={idx === images.length - 1}
                  className="bg-background/90 rounded p-1 text-foreground hover:bg-background disabled:opacity-50"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Index counter */}
              <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                <ImageIcon className="h-2.5 w-2.5" /> {idx + 1}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
