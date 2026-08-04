import React from 'react'

interface AnalyticsHeroProps {
  title: string
  subtitle: string
  action?: React.ReactNode
}

export const AnalyticsHero: React.FC<AnalyticsHeroProps> = ({ title, subtitle, action }) => {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          {subtitle}
        </p>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}
