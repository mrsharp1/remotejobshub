import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Move, Link as LinkIcon, AlertTriangle } from 'lucide-react'
import { Reorder } from 'framer-motion'

export const NavigationBuilderPro: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', label: 'Marketplace', url: '/marketplace', roles: ['guest', 'buyer', 'seller'] },
    { id: '2', label: 'My Dashboard', url: '/dashboard', roles: ['buyer', 'seller'] },
    { id: '3', label: 'Admin Center', url: '/admin', roles: ['admin'] },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Navigation Builder Pro</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Menu Item
        </button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 px-4 py-3 rounded-xl flex items-start gap-3 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <p>Menu items are filtered automatically based on the user's role (visibility rules). Drag to reorder.</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-muted/50 p-4 border-b border-border flex justify-between font-medium text-muted-foreground text-sm">
          <span className="pl-8">Menu Label</span>
          <span className="w-48 text-right pr-20">Visibility</span>
        </div>
        
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="divide-y divide-border">
          {items.map(item => (
            <Reorder.Item key={item.id} value={item} className="p-4 flex items-center justify-between hover:bg-muted/30 group bg-card">
              <div className="flex items-center gap-4">
                <Move className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <div>
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><LinkIcon className="w-3 h-3" /> {item.url}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-1">
                  {item.roles.map(r => (
                    <span key={r} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {r}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-muted-foreground hover:text-primary rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-2 text-muted-foreground hover:text-destructive rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  )
}
