import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, CheckCircle, Image as ImageIcon, Search, Filter, Star } from 'lucide-react'
import { cmsProService, CMSTestimonial } from '@/services/cms/cmsPro.service'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export const TestimonialManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([])
  const [editingItem, setEditingItem] = useState<Partial<CMSTestimonial> | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await cmsProService.getTestimonials()
      setTestimonials(data)
    } catch (err) {
      toast.error('Failed to load testimonials')
    }
  }

  const handleSave = async () => {
    if (!editingItem?.author_name || !editingItem?.content) {
      toast.error('Name and content are required')
      return
    }

    try {
      if (editingItem.id) {
        const { error } = await supabase.from('cms_testimonials').update(editingItem).eq('id', editingItem.id)
        if (error) throw error
        await cmsProService.logAction('cms_testimonials', editingItem.id, 'UPDATE', null, editingItem)
        toast.success('Testimonial updated')
      } else {
        const { data, error } = await supabase.from('cms_testimonials').insert(editingItem).select().single()
        if (error) throw error
        if (data) {
          await cmsProService.logAction('cms_testimonials', data.id, 'CREATE', null, data)
        }
        toast.success('Testimonial created')
      }
      setEditingItem(null)
      loadData()
    } catch (err) {
      toast.error('Failed to save testimonial')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    try {
      const { error } = await supabase.from('cms_testimonials').delete().eq('id', id)
      if (error) throw error
      await cmsProService.logAction('cms_testimonials', id, 'DELETE')
      toast.success('Testimonial deleted')
      loadData()
    } catch (err) {
      toast.error('Failed to delete testimonial')
    }
  }

  const filtered = testimonials.filter(t => 
    t.author_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (editingItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{editingItem.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <div className="flex gap-2">
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Author Name</label>
              <input 
                className="premium-input w-full px-3 py-2"
                value={editingItem.author_name || ''}
                onChange={e => setEditingItem({...editingItem, author_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author Role/Platform</label>
              <input 
                className="premium-input w-full px-3 py-2"
                value={editingItem.author_role || ''}
                onChange={e => setEditingItem({...editingItem, author_role: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <div className="flex gap-2">
                <input 
                  className="premium-input flex-1 px-3 py-2"
                  value={editingItem.author_avatar_url || ''}
                  onChange={e => setEditingItem({...editingItem, author_avatar_url: e.target.value})}
                />
                <button className="px-3 border rounded-lg hover:bg-muted"><ImageIcon className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL (Optional)</label>
              <input 
                className="premium-input w-full px-3 py-2"
                value={editingItem.video_url || ''}
                onChange={e => setEditingItem({...editingItem, video_url: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status & Display</label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="premium-input w-full px-3 py-2"
                  value={editingItem.status || 'draft'}
                  onChange={e => setEditingItem({...editingItem, status: e.target.value as any})}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
                <div className="flex items-center gap-4 border rounded-lg px-3">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      checked={editingItem.is_featured || false}
                      onChange={e => setEditingItem({...editingItem, is_featured: e.target.checked})}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      checked={editingItem.is_verified_buyer || false}
                      onChange={e => setEditingItem({...editingItem, is_verified_buyer: e.target.checked})}
                    />
                    Verified
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating (1-5)</label>
              <input 
                type="number" min="1" max="5"
                className="premium-input w-full px-3 py-2"
                value={editingItem.rating || 5}
                onChange={e => setEditingItem({...editingItem, rating: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Testimonial Content</label>
              <textarea 
                rows={5}
                className="premium-input w-full px-3 py-2 resize-none"
                value={editingItem.content || ''}
                onChange={e => setEditingItem({...editingItem, content: e.target.value})}
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
        <h2 className="text-xl font-bold">Testimonial Manager</h2>
        <button 
          onClick={() => setEditingItem({ rating: 5, status: 'draft', is_featured: false, is_verified_buyer: false, sort_order: 0 })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            placeholder="Search testimonials..." 
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
              <th className="p-4 font-medium text-muted-foreground">Author</th>
              <th className="p-4 font-medium text-muted-foreground">Rating</th>
              <th className="p-4 font-medium text-muted-foreground">Status</th>
              <th className="p-4 font-medium text-muted-foreground">Featured</th>
              <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {t.author_avatar_url ? (
                      <img src={t.author_avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {t.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {t.author_name}
                        {t.is_verified_buyer && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{t.author_role}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    t.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                    (t.status as any) === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    (t.status as any) === 'rejected' ? 'bg-destructive/10 text-destructive' :
                    'bg-slate-500/10 text-slate-500'
                  }`}>
                    {t.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {t.is_featured ? <span className="text-primary font-medium text-xs">Featured</span> : '-'}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setEditingItem(t)} className="p-2 text-muted-foreground hover:text-primary rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-muted-foreground hover:text-destructive rounded-lg transition-colors ml-1">
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
