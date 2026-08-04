import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Skeleton } from './Skeleton'
import { ImageIcon } from 'lucide-react'

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackUrl?: string
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackUrl,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={twMerge('relative overflow-hidden', className)}>
      {isLoading && !hasError && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}

      {hasError ? (
        fallbackUrl ? (
          <img
            src={fallbackUrl}
            alt={alt || 'Fallback image'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="bg-muted/50 absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="mb-2 h-8 w-8 opacity-50" />
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        )
      ) : (
        <img
          src={src}
          alt={alt || ''}
          onLoad={handleLoad}
          onError={handleError}
          className={twMerge(
            'h-full w-full transition-opacity duration-500',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  )
}
