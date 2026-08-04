import React from 'react'
import { twMerge } from 'tailwind-merge'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge('animate-pulse rounded-md bg-slate-800/60', className)}
      {...props}
    />
  )
}

export const SkeletonCard: React.FC<SkeletonProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'rounded-[24px] border border-white/5 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[90%]" />
        <Skeleton className="h-3 w-[80%]" />
      </div>
    </div>
  )
}

export const SkeletonTable: React.FC<{ rows?: number } & SkeletonProps> = ({
  rows = 5,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'w-full overflow-hidden rounded-[24px] border border-white/5 bg-slate-900/40 shadow-xl backdrop-blur-md',
        className
      )}
      {...props}
    >
      <div className="border-b border-white/10 bg-slate-800/30 p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const SkeletonList: React.FC<{ items?: number } & SkeletonProps> = ({
  items = 3,
  className,
  ...props
}) => {
  return (
    <div className={twMerge('space-y-4', className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-[20px] border border-white/5 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  )
}
