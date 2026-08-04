import React, { useState } from 'react'
import { Eye, Save, RotateCcw } from 'lucide-react'
import { useCMSStore, AboutPageContent } from '@/services/cms/cms.store'
import { LivePreview } from './LivePreview'
import { RevisionHistory } from './RevisionHistory'
import { AboutPage } from '@/pages/public/AboutPage' // Assuming we can use the actual component for preview

export const AboutManager: React.FC = () => {
  const { aboutContent, aboutDraft, updateAboutDraft, publishAbout, discardAboutDraft } = useCMSStore()
  
  // Initialize from draft or published content
  const [formData, setFormData] = useState<AboutPageContent>(aboutDraft || aboutContent)
  const [showPreview, setShowPreview] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const isDirty = JSON.stringify(formData) !== JSON.stringify(aboutContent)
  const hasDraft = !!aboutDraft

  const handleSaveDraft = () => {
    updateAboutDraft(formData)
  }

  const handlePublish = () => {
    updateAboutDraft(formData)
    publishAbout()
  }

  const handleDiscard = () => {
    discardAboutDraft()
    setFormData(aboutContent)
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs pb-24 lg:pb-6">
      <div className="lg:col-span-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold font-heading">About Page Manager</h2>
            <p className="text-muted-foreground mt-1">Manage content, images, and layout for the About page.</p>
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
          <h3 className="font-bold text-sm">Hero Section</h3>
          
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Headline</label>
            <input 
              className="premium-input w-full"
              value={formData.hero.headline}
              onChange={e => setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value }})}
            />
          </div>
          
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Subheadline</label>
            <textarea 
              className="premium-input w-full" rows={3}
              value={formData.hero.subheadline}
              onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subheadline: e.target.value }})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">CTA Button Text</label>
              <input 
                className="premium-input w-full"
                value={formData.hero.ctaText}
                onChange={e => setFormData({ ...formData, hero: { ...formData.hero, ctaText: e.target.value }})}
              />
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">Video URL (Optional)</label>
              <input 
                className="premium-input w-full"
                placeholder="https://..."
                value={formData.hero.videoUrl}
                onChange={e => setFormData({ ...formData, hero: { ...formData.hero, videoUrl: e.target.value }})}
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm">Company Story</h3>
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Heading</label>
            <input 
              className="premium-input w-full"
              value={formData.story.heading}
              onChange={e => setFormData({ ...formData, story: { ...formData.story, heading: e.target.value }})}
            />
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Content (Rich Text)</label>
            <textarea 
              className="premium-input w-full" rows={5}
              value={formData.story.content}
              onChange={e => setFormData({ ...formData, story: { ...formData.story, content: e.target.value }})}
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm">Mission & Vision</h3>
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Mission Statement</label>
            <input 
              className="premium-input w-full"
              value={formData.missionVision.mission}
              onChange={e => setFormData({ ...formData, missionVision: { ...formData.missionVision, mission: e.target.value }})}
            />
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Vision Statement</label>
            <input 
              className="premium-input w-full"
              value={formData.missionVision.vision}
              onChange={e => setFormData({ ...formData, missionVision: { ...formData.missionVision, vision: e.target.value }})}
            />
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Why We Exist</label>
            <textarea 
              className="premium-input w-full" rows={3}
              value={formData.missionVision.whyWeExist}
              onChange={e => setFormData({ ...formData, missionVision: { ...formData.missionVision, whyWeExist: e.target.value }})}
            />
          </div>
        </div>

        {/* Founder Message */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm">Founder Message</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">Founder Name</label>
              <input 
                className="premium-input w-full"
                value={formData.founderMessage.name}
                onChange={e => setFormData({ ...formData, founderMessage: { ...formData.founderMessage, name: e.target.value }})}
              />
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">Role</label>
              <input 
                className="premium-input w-full"
                value={formData.founderMessage.role}
                onChange={e => setFormData({ ...formData, founderMessage: { ...formData.founderMessage, role: e.target.value }})}
              />
            </div>
          </div>
          <div>
            <label className="block mb-1.5 font-medium text-slate-500">Message</label>
            <textarea 
              className="premium-input w-full" rows={3}
              value={formData.founderMessage.message}
              onChange={e => setFormData({ ...formData, founderMessage: { ...formData.founderMessage, message: e.target.value }})}
            />
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
          {/* We will pass the formData to the AboutPage somehow, or let AboutPage pull from the store's draft state. */}
          {/* Since AboutPage will pull from useCMSStore(), it will automatically reflect `aboutDraft` if we ensure AboutPage checks draft vs published based on a prop or context. */}
          {/* For now, just render AboutPage. If we saved draft, AboutPage will see it. */}
          <AboutPage />
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
                entityType="about" 
                entityId="about-page" 
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
