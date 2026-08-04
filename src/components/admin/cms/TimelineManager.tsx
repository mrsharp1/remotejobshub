import React, { useState } from 'react'
import { Plus, GripVertical, Trash2, Image as ImageIcon } from 'lucide-react'
import { useCMSStore, AboutPageContent } from '@/services/cms/cms.store'

export const TimelineManager: React.FC = () => {
  const { aboutContent, aboutDraft, updateAboutDraft } = useCMSStore()
  const content = aboutDraft || aboutContent
  const [items, setItems] = useState(content.timeline)

  const handleAdd = () => {
    const newItem = {
      id: crypto.randomUUID(),
      year: new Date().getFullYear().toString(),
      title: 'New Milestone',
      description: 'Describe the milestone here...',
      order: items.length
    }
    setItems([...items, newItem])
    updateDraft([...items, newItem])
  }

  const handleDelete = (id: string) => {
    const newItems = items.filter(i => i.id !== id)
    setItems(newItems)
    updateDraft(newItems)
  }

  const handleChange = (id: string, field: string, value: string) => {
    const newItems = items.map(i => i.id === id ? { ...i, [field]: value } : i)
    setItems(newItems)
    updateDraft(newItems)
  }

  const updateDraft = (newTimeline: AboutPageContent['timeline']) => {
    updateAboutDraft({
      ...content,
      timeline: newTimeline
    })
  }

  // Simple move up/down for reordering
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === items.length - 1) return

    const newItems = [...items]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newItems[index]
    newItems[index] = newItems[swapIndex]
    newItems[swapIndex] = temp
    
    // update order field
    newItems.forEach((item, i) => { item.order = i })
    setItems(newItems)
    updateDraft(newItems)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">Company Timeline</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Milestone
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/50">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="hover:text-primary disabled:opacity-30">
                <GripVertical className="h-4 w-4 rotate-90" />
              </button>
              <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="hover:text-primary disabled:opacity-30">
                <GripVertical className="h-4 w-4 rotate-90" />
              </button>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Year / Date</label>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => handleChange(item.id, 'year', e.target.value)}
                    className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-400">Milestone Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                    className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400">Optional Image URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="https://..."
                      value={item.image || ''}
                      onChange={(e) => handleChange(item.id, 'image', e.target.value)}
                      className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm focus:outline-none dark:bg-slate-950"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-xl border border-dashed py-12 text-center text-slate-500">
            No timeline events added yet.
          </div>
        )}
      </div>
    </div>
  )
}
