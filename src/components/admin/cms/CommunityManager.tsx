import React, { useState } from 'react'
import { Eye, Save, RotateCcw } from 'lucide-react'
import { useCMSStore, CommunityPageContent } from '@/services/cms/cms.store'
import { LivePreview } from './LivePreview'
import { RevisionHistory } from './RevisionHistory'
import { CommunityPage } from '@/pages/public/CommunityPage'

export const CommunityManager: React.FC = () => {
  const { communityContent, communityDraft, updateCommunityDraft, publishCommunity, discardCommunityDraft } = useCMSStore()
  
  const [formData, setFormData] = useState<CommunityPageContent>(communityDraft || communityContent)
  const [showPreview, setShowPreview] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const isDirty = JSON.stringify(formData) !== JSON.stringify(communityContent)
  const hasDraft = !!communityDraft

  const handleSaveDraft = () => {
    updateCommunityDraft(formData)
  }

  const handlePublish = () => {
    updateCommunityDraft(formData)
    publishCommunity()
  }

  const handleDiscard = () => {
    discardCommunityDraft()
    setFormData(communityContent)
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs pb-24 lg:pb-6">
      <div className="lg:col-span-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold font-heading">Community Page Manager</h2>
            <p className="text-muted-foreground mt-1">Manage events, stats, and social links for the Community page.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowHistory(true)}
              className="px-3 py-1.5 border rounded-lg hover:bg-muted font-medium transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> History
            </button>
            <button 
              onClick={() => setShowPreview(true)}
              className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm">Hero & Announcements</h3>
          
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Headline</label>
            <input 
              className="premium-input w-full"
              value={formData.hero.headline}
              onChange={e => setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value }})}
            />
          </div>
          
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Description</label>
            <textarea 
              className="premium-input w-full" rows={3}
              value={formData.hero.description}
              onChange={e => setFormData({ ...formData, hero: { ...formData.hero, description: e.target.value }})}
            />
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Pinned Announcement Banner</label>
            <input 
              className="premium-input w-full"
              value={formData.pinnedAnnouncement}
              onChange={e => setFormData({ ...formData, pinnedAnnouncement: e.target.value })}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm">Social Community Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">Discord URL</label>
              <input 
                className="premium-input w-full"
                value={formData.socials.discord}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, discord: e.target.value }})}
              />
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">Telegram URL</label>
              <input 
                className="premium-input w-full"
                value={formData.socials.telegram}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, telegram: e.target.value }})}
              />
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">WhatsApp URL</label>
              <input 
                className="premium-input w-full"
                value={formData.socials.whatsapp}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, whatsapp: e.target.value }})}
              />
            </div>
          </div>
        </div>


      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Publish Card */}
        <div className="bg-card border rounded-xl p-5 space-y-4 sticky top-6">
          <h3 className="font-bold text-sm">Publish Status</h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current State</span>
            <span className={`font-bold px-2 py-0.5 rounded ${isDirty || hasDraft ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isDirty ? 'Unsaved Changes' : hasDraft ? 'Draft Saved' : 'Published'}
            </span>
          </div>
          
          <div className="pt-4 border-t space-y-2">
            <button 
              onClick={handlePublish}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Publish Now
            </button>
            <button 
              onClick={handleSaveDraft}
              disabled={!isDirty}
              className={`w-full py-2.5 border rounded-lg font-bold transition ${isDirty ? 'hover:bg-muted text-foreground' : 'text-muted-foreground opacity-50'}`}
            >
              Save as Draft
            </button>
            {(isDirty || hasDraft) && (
              <button 
                onClick={handleDiscard}
                className="w-full py-2.5 text-destructive hover:bg-destructive/10 rounded-lg font-bold transition"
              >
                Discard Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <LivePreview onClose={() => setShowPreview(false)}>
          <CommunityPage />
        </LivePreview>
      )}
      {/* Revision History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Version History</h3>
              <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-muted rounded">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <RevisionHistory 
                entityType="community" 
                entityId="community-page" 
                onClose={() => setShowHistory(false)}
                onRestore={() => {
                  alert('Restored version')
                  setShowHistory(false)
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
