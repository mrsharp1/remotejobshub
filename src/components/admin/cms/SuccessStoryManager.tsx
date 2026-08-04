import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, CheckCircle, Search, Filter } from 'lucide-react'
import { cmsProService, CMSSuccessStory } from '@/services/cms/cmsPro.service'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { RichTextEditor } from './RichTextEditor'
import { formatCurrency } from '@/utils/currency'

export const SuccessStoryManager: React.FC = () => {
  const [stories, setStories] = useState<CMSSuccessStory[]>([])
  const [editingItem, setEditingItem] = useState<Partial<CMSSuccessStory> | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await cmsProService.getSuccessStories()
      setStories(data)
    } catch (err) {
      toast.error('Failed to load success stories')
    }
  }

  const handleSave = async () => {
    if (!editingItem?.title || !editingItem?.slug || !editingItem?.content) {
      toast.error('Title, Slug, and Content are required')
      return
    }

    try {
      if (editingItem.id) {
        const { error } = await supabase.from('cms_success_stories').update(editingItem).eq('id', editingItem.id)
        if (error) throw error
        await cmsProService.logAction('cms_success_stories', editingItem.id, 'UPDATE', null, editingItem)
        toast.success('Story updated')
      } else {
        const { data, error } = await supabase.from('cms_success_stories').insert(editingItem).select().single()
        if (error) throw error
        if (data) {
          await cmsProService.logAction('cms_success_stories', data.id, 'CREATE', null, data)
        }
        toast.success('Story created')
      }
      setEditingItem(null)
      loadData()
    } catch (err) {
      toast.error('Failed to save story')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return
    try {
      const { error } = await supabase.from('cms_success_stories').delete().eq('id', id)
      if (error) throw error
      await cmsProService.logAction('cms_success_stories', id, 'DELETE')
      toast.success('Story deleted')
      loadData()
    } catch (err) {
      toast.error('Failed to delete story')
    }
  }

  const filtered = stories.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (editingItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{editingItem.id ? 'Edit Story' : 'New Story'}</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input 
                  className="premium-input w-full px-3 py-2"
                  value={editingItem.title || ''}
                  onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <input 
                  className="premium-input w-full px-3 py-2"
                  value={editingItem.slug || ''}
                  onChange={e => setEditingItem({...editingItem, slug: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt (Short Summary)</label>
              <textarea 
                rows={2}
                className="premium-input w-full px-3 py-2 resize-none"
                value={editingItem.excerpt || ''}
                onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Story Content</label>
              <RichTextEditor 
                value={editingItem.content || ''}
                onChange={val => setEditingItem({...editingItem, content: val})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status & Display</label>
              <select 
                className="premium-input w-full px-3 py-2 mb-2"
                value={editingItem.status || 'draft'}
                onChange={e => setEditingItem({...editingItem, status: e.target.value as any})}
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer text-sm border rounded-lg px-3 py-2 bg-card">
                <input 
                  type="checkbox" 
                  checked={editingItem.is_featured || false}
                  onChange={e => setEditingItem({...editingItem, is_featured: e.target.checked})}
                />
                Featured Story
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Seller Info</label>
              <input 
                placeholder="Seller Name"
                className="premium-input w-full px-3 py-2 mb-2"
                value={editingItem.seller_name || ''}
                onChange={e => setEditingItem({...editingItem, seller_name: e.target.value})}
              />
              <input 
                placeholder="Country (e.g. US)"
                className="premium-input w-full px-3 py-2"
                value={editingItem.country || ''}
                onChange={e => setEditingItem({...editingItem, country: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Metrics</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number"
                  placeholder="Income Gen."
                  className="premium-input w-full px-3 py-2"
                  value={editingItem.income_generated || ''}
                  onChange={e => setEditingItem({...editingItem, income_generated: parseInt(e.target.value)})}
                />
                <input 
                  type="number"
                  placeholder="Timeline (mo)"
                  className="premium-input w-full px-3 py-2"
                  value={editingItem.timeline_months || ''}
                  onChange={e => setEditingItem({...editingItem, timeline_months: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Media URLs</label>
              <input 
                placeholder="Featured Image URL"
                className="premium-input w-full px-3 py-2 mb-2"
                value={editingItem.featured_image_url || ''}
                onChange={e => setEditingItem({...editingItem, featured_image_url: e.target.value})}
              />
              <input 
                placeholder="Video URL"
                className="premium-input w-full px-3 py-2"
                value={editingItem.video_url || ''}
                onChange={e => setEditingItem({...editingItem, video_url: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Success Stories</h2>
        <button 
          onClick={() => setEditingItem({ status: 'draft', is_featured: false, seller_name: '', excerpt: '' })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Story
        </button>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            placeholder="Search stories..." 
            className="premium-input w-full pl-9 pr-4 py-2"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted text-sm font-medium">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-muted-foreground">Story</th>
              <th className="p-4 font-medium text-muted-foreground">Seller</th>
              <th className="p-4 font-medium text-muted-foreground">Status</th>
              <th className="p-4 font-medium text-muted-foreground">Metrics</th>
              <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <div className="font-medium text-foreground">{s.title}</div>
                  <div className="text-xs text-muted-foreground truncate w-48">{s.excerpt}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{s.seller_name}</div>
                  <div className="text-xs text-muted-foreground">{s.country || 'N/A'}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    s.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                    (s.status as any) === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-slate-500/10 text-slate-500'
                  }`}>
                    {s.status.toUpperCase()}
                  </span>
                  {s.is_featured && <div className="text-xs text-primary mt-1 font-medium">FEATURED</div>}
                </td>
                <td className="p-4 text-xs">
                  {s.income_generated ? <div>{formatCurrency(Number(s.income_generated))} Gen.</div> : null}
                  {s.timeline_months ? <div>{s.timeline_months} Months</div> : null}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setEditingItem(s)} className="p-2 text-muted-foreground hover:text-primary rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-muted-foreground hover:text-destructive rounded-lg transition-colors ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
