import React from 'react'
import { Flame, Star, FastForward } from 'lucide-react'

export interface MarketplaceMetric {
  id: string
  name: string
  value: string | number
  trend?: number
}

interface MarketplaceAnalyticsProps {
  trendingPlatforms: MarketplaceMetric[]
  fastestSelling: MarketplaceMetric[]
  topSellers: MarketplaceMetric[]
}

const ListCard = ({ title, icon, items }: { title: string, icon: React.ReactNode, items: MarketplaceMetric[] }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-heading text-base font-bold flex items-center gap-2">
        {icon}
        {title}
      </h3>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
              {index + 1}
            </span>
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold">{item.value}</span>
            {item.trend !== undefined && (
              <span className={`text-[10px] font-bold ${item.trend >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                {item.trend > 0 ? '+' : ''}{item.trend}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const MarketplaceAnalytics: React.FC<MarketplaceAnalyticsProps> = ({
  trendingPlatforms,
  fastestSelling,
  topSellers
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <ListCard 
        title="Trending Platforms" 
        icon={<Flame className="h-5 w-5 text-orange-500" />} 
        items={trendingPlatforms} 
      />
      <ListCard 
        title="Fastest Selling Niches" 
        icon={<FastForward className="h-5 w-5 text-blue-500" />} 
        items={fastestSelling} 
      />
      <ListCard 
        title="Top Rated Sellers" 
        icon={<Star className="h-5 w-5 text-amber-500" />} 
        items={topSellers} 
      />
    </div>
  )
}
