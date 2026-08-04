import React from 'react'

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface AnalyticsSidebarProps {
  items: SidebarItem[]
  activeId: string
  onChange: (id: string) => void
}

export const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({
  items,
  activeId,
  onChange
}) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-24 flex flex-row overflow-x-auto border-b border-border bg-background pb-2 md:flex-col md:overflow-visible md:border-none md:pb-0 scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              activeId === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
