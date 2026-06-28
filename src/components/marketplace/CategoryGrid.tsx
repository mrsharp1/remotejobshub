import React from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Globe,
  Database,
  Search,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react'

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
    {
      name: 'DataAnnotation',
      icon: Database,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    { name: 'TELUS', icon: Cpu, color: 'text-orange-500 bg-orange-500/10' },
    { name: 'Scale AI', icon: Code, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Appen', icon: Search, color: 'text-pink-500 bg-pink-500/10' },
    { name: 'OneForma', icon: Layers, color: 'text-cyan-500 bg-cyan-500/10' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-bold text-foreground">
        Browse by Platform
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.name
          return (
            <motion.button
              key={cat.name}
              whileHover={{ y: -2 }}
              onClick={() => onSelectCategory(isActive ? '' : cat.name)}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                isActive
                  ? 'bg-primary/5 border-primary shadow-md'
                  : 'hover:bg-muted/30 hover:border-border/80 border-border bg-card'
              }`}
            >
              <div className={`rounded-full p-2.5 ${cat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="line-clamp-1 text-xs font-bold tracking-tight text-foreground">
                {cat.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
