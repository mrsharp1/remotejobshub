import React from 'react'

export type DateRange = '7d' | '30d' | '90d' | '12m' | 'all'

interface AnalyticsFiltersProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  categories?: string[]
  activeCategory?: string
  onCategoryChange?: (category: string) => void
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  categories,
  activeCategory,
  onCategoryChange
}) => {
  const ranges: { label: string; value: DateRange }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '12 Months', value: '12m' },
    { label: 'All Time', value: 'all' },
  ]

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-6 flex gap-4 overflow-x-auto border-b border-border bg-background/80 px-4 py-3 pb-3 pt-4 backdrop-blur-md md:static md:mx-0 md:px-0 md:pt-0 scrollbar-hide">
      <div className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-muted p-1">
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => onDateRangeChange(r.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              dateRange === r.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {categories && onCategoryChange && (
        <div className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-muted p-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === c
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
