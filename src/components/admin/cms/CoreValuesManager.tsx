import React, { useState } from 'react'
import { Plus, GripVertical, Trash2, Palette, Type, FileText } from 'lucide-react'
import { useCMSStore, AboutPageContent } from '@/services/cms/cms.store'

export const CoreValuesManager: React.FC = () => {
  const { aboutContent, aboutDraft, updateAboutDraft } = useCMSStore()
  const content = aboutDraft || aboutContent
  const [items, setItems] = useState(content.coreValues)

  const handleAdd = () => {
    const newItem = {
      id: crypto.randomUUID(),
      title: 'New Value',
      description: 'Describe this value...',
      icon: 'Star',
      highlightColor: 'blue'
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    updateDraft(newItems)
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

  const updateDraft = (newValues: AboutPageContent['coreValues']) => {
    updateAboutDraft({
      ...content,
      coreValues: newValues
    })
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === items.length - 1) return

    const newItems = [...items]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newItems[index]
    newItems[index] = newItems[swapIndex]
    newItems[swapIndex] = temp
    
    setItems(newItems)
    updateDraft(newItems)
  }

  const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'indigo', label: 'Indigo' },
    { value: 'violet', label: 'Violet' },
    { value: 'emerald', label: 'Emerald' },
    { value: 'amber', label: 'Amber' },
    { value: 'rose', label: 'Rose' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">Core Values</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Value
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/50 relative group">
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="hover:text-primary disabled:opacity-30">
                <GripVertical className="h-4 w-4 rotate-90 md:rotate-0" />
              </button>
              <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="hover:text-primary disabled:opacity-30">
                <GripVertical className="h-4 w-4 rotate-90 md:rotate-0" />
              </button>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Type className="h-3 w-3" /> Value Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                  className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                />
              </div>
              
              <div>
                <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <FileText className="h-3 w-3" /> Description
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                    Lucide Icon Name
                  </label>
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => handleChange(item.id, 'icon', e.target.value)}
                    placeholder="e.g. Shield, Star"
                    className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Palette className="h-3 w-3" /> Color Theme
                  </label>
                  <select
                    value={item.highlightColor}
                    onChange={(e) => handleChange(item.id, 'highlightColor', e.target.value)}
                    className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                  >
                    {colorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-2 rounded-xl border border-dashed py-12 text-center text-slate-500">
            No core values added yet.
          </div>
        )}
      </div>
    </div>
  )
}
