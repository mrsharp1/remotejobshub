import React, { useState } from 'react'
import { Plus, Trash2, Calendar, MapPin, Link as LinkIcon, Image as ImageIcon, Clock } from 'lucide-react'
import { useCMSStore, CommunityPageContent } from '@/services/cms/cms.store'

export const CommunityEventsManager: React.FC = () => {
  const { communityContent, communityDraft, updateCommunityDraft } = useCMSStore()
  const content = communityDraft || communityContent
  const [items, setItems] = useState(content.events)

  const handleAdd = () => {
    const newItem: CommunityPageContent['events'][0] = {
      id: crypto.randomUUID(),
      title: 'New Community Event',
      description: 'Join us for this exciting event.',
      date: new Date().toISOString().split('T')[0],
      time: '12:00 PM UTC',
      location: 'Virtual',
      link: 'https://...',
      status: 'upcoming',
      pinned: false,
      featured: false
    }
    const newItems = [newItem, ...items]
    setItems(newItems)
    updateDraft(newItems)
  }

  const handleDelete = (id: string) => {
    const newItems = items.filter(i => i.id !== id)
    setItems(newItems)
    updateDraft(newItems)
  }

  const handleChange = (id: string, field: keyof CommunityPageContent['events'][0], value: any) => {
    const newItems = items.map(i => i.id === id ? { ...i, [field]: value } : i)
    setItems(newItems)
    updateDraft(newItems)
  }

  const updateDraft = (newEvents: CommunityPageContent['events']) => {
    updateCommunityDraft({
      ...content,
      events: newEvents
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">Community Events</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Create Event
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/50 space-y-4 relative group">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-xs font-bold text-slate-400">Event Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                      className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Calendar className="h-3 w-3" /> Date
                    </label>
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => handleChange(item.id, 'date', e.target.value)}
                      className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock className="h-3 w-3" /> Time
                    </label>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => handleChange(item.id, 'time', e.target.value)}
                      placeholder="e.g. 10:00 AM UTC"
                      className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                      <MapPin className="h-3 w-3" /> Location / Platform
                    </label>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => handleChange(item.id, 'location', e.target.value)}
                      className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                      <LinkIcon className="h-3 w-3" /> Registration Link
                    </label>
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) => handleChange(item.id, 'link', e.target.value)}
                      className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Event Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="md:col-span-4 space-y-3 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <ImageIcon className="h-3 w-3" /> Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={item.banner || ''}
                    onChange={(e) => handleChange(item.id, 'banner', e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Event Status</label>
                  <select
                    value={item.status}
                    onChange={(e) => handleChange(item.id, 'status', e.target.value)}
                    className="w-full rounded-lg border bg-white p-2 text-sm focus:outline-none dark:bg-slate-950"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past Event</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={item.pinned}
                      onChange={(e) => handleChange(item.id, 'pinned', e.target.checked)}
                      className="accent-primary h-4 w-4"
                    />
                    Pinned to Top
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={(e) => handleChange(item.id, 'featured', e.target.checked)}
                      className="accent-primary h-4 w-4"
                    />
                    Featured Style
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-xl border border-dashed py-12 text-center text-slate-500">
            No events scheduled.
          </div>
        )}
      </div>
    </div>
  )
}
