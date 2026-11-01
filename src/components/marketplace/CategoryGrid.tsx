import React from 'react'
import { motion } from 'framer-motion'
import { Globe, Sparkles } from 'lucide-react'

interface CategoryGridProps {
  onSelectCategory: (platform: string) => void
  activeCategory: string
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  const categories = [
    {
      name: 'Outlier',
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-500/10',
    },
    { name: 'Handshake', icon: Globe, color: 'text-blue-500 bg-blue-500/10' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-center font-heading text-lg font-bold text-foreground">
        Browse by Platform
      </h3>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-lg sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.name
          return (
            <motion.div key={cat.name} whileHover={{ y: -4 }}>
              <button
                onClick={() => onSelectCategory(isActive ? '' : cat.name)}
                className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300 ${
                  isActive
                    ? 'border-primary/50 bg-primary/5 shadow-primary/10 shadow-md'
                    : 'border-border/60 hover:border-primary/20 dark:bg-card/50 bg-white/50 backdrop-blur-sm hover:bg-white hover:shadow-xl dark:hover:bg-card'
                }`}
              >
                <div className={`rounded-full p-2.5 ${cat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="line-clamp-1 text-xs font-bold tracking-tight text-foreground">
                  {cat.name}
                </span>
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
