import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react'
import { cmsProService, CMSPolicy } from '@/services/cms/cmsPro.service'
import { RichTextEditor } from './RichTextEditor'

export const PolicyManager: React.FC = () => {
  const [policies, setPolicies] = useState<CMSPolicy[]>([])
  const [editingPolicy, setEditingPolicy] = useState<Partial<CMSPolicy> | null>(null)

  useEffect(() => {
    loadPolicies()
  }, [])

  const loadPolicies = async () => {
    try {
      const data = await cmsProService.getPolicies()
      setPolicies(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async () => {
    // In a real implementation this would call cmsProService to save
    // For now we just reset state
    setEditingPolicy(null)
    loadPolicies()
  }

  if (editingPolicy) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Policy</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setEditingPolicy(null)}
              className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Save Policy
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input 
              className="premium-input w-full px-3 py-2"
              value={editingPolicy.title || ''}
              onChange={(e) => setEditingPolicy({...editingPolicy, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <input 
              className="premium-input w-full px-3 py-2"
              value={editingPolicy.slug || ''}
              onChange={(e) => setEditingPolicy({...editingPolicy, slug: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              className="premium-input w-full px-3 py-2"
              value={editingPolicy.status || 'draft'}
              onChange={(e) => setEditingPolicy({...editingPolicy, status: e.target.value as any})}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Version</label>
            <input 
              className="premium-input w-full px-3 py-2"
              value={editingPolicy.version || '1.0'}
              onChange={(e) => setEditingPolicy({...editingPolicy, version: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content</label>
          <RichTextEditor 
            value={editingPolicy.content || ''}
            onChange={(val) => setEditingPolicy({...editingPolicy, content: val})}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Policy Pages</h2>
        <button 
          onClick={() => setEditingPolicy({ title: '', slug: '', content: '', status: 'draft', version: '1.0' })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Policy
        </button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-muted-foreground">Policy</th>
              <th className="p-4 font-medium text-muted-foreground">Version</th>
              <th className="p-4 font-medium text-muted-foreground">Status</th>
              <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {policies.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No policies found. Create your first legal page.
                </td>
              </tr>
            ) : policies.map(policy => (
              <tr key={policy.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <div className="font-medium text-foreground">{policy.title}</div>
                  <div className="text-xs text-muted-foreground">/{policy.slug}</div>
                </td>
                <td className="p-4">v{policy.version}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    policy.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                    policy.status === 'archived' ? 'bg-slate-500/10 text-slate-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {policy.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setEditingPolicy(policy)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-2">
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
