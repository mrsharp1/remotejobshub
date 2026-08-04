import React, { useState } from 'react'
import { Eye, Save, RotateCcw, Plus, Trash2 } from 'lucide-react'
import { useCMSStore, ContactPageContent } from '@/services/cms/cms.store'
import { LivePreview } from './LivePreview'
import { RevisionHistory } from './RevisionHistory'
import { ContactPage } from '@/pages/public/ContactPage'

export const ContactManager: React.FC = () => {
  const { contactContent, contactDraft, updateContactDraft, publishContact, discardContactDraft } = useCMSStore()
  
  const [formData, setFormData] = useState<ContactPageContent>(contactDraft || contactContent)
  const [showPreview, setShowPreview] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const isDirty = JSON.stringify(formData) !== JSON.stringify(contactContent)
  const hasDraft = !!contactDraft

  const handleSaveDraft = () => {
    updateContactDraft(formData)
  }

  const handlePublish = () => {
    updateContactDraft(formData)
    publishContact()
  }

  const handleDiscard = () => {
    discardContactDraft()
    setFormData(contactContent)
  }

  const updateArrayField = (field: keyof ContactPageContent, newArray: any[]) => {
    setFormData({ ...formData, [field]: newArray })
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs pb-24 lg:pb-6">
      <div className="lg:col-span-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold font-heading">Contact Knowledge Center</h2>
            <p className="text-muted-foreground mt-1">Manage global support protocols, SLAs, and emergency contacts.</p>
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

        {/* Support KPIs & SLA */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-primary border-b pb-2">Support Metrics & SLAs</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-medium text-slate-500">Average Response Time</label>
              <input 
                className="premium-input w-full"
                value={formData.responseTime}
                onChange={e => setFormData({ ...formData, responseTime: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold">Priority Levels</h4>
              <button onClick={() => updateArrayField('priorityLevels', [...formData.priorityLevels, { id: crypto.randomUUID(), label: 'New Priority', sla: '< 24 hours' }])} className="text-xs font-bold text-primary flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
            </div>
            <div className="space-y-3">
              {formData.priorityLevels.map((p, i) => (
                <div key={p.id} className="flex gap-3 items-center">
                  <input className="premium-input flex-1" value={p.label} onChange={(e) => {
                    const newArr = [...formData.priorityLevels]
                    newArr[i].label = e.target.value
                    updateArrayField('priorityLevels', newArr)
                  }} placeholder="Priority Label" />
                  <input className="premium-input flex-1" value={p.sla} onChange={(e) => {
                    const newArr = [...formData.priorityLevels]
                    newArr[i].sla = e.target.value
                    updateArrayField('priorityLevels', newArr)
                  }} placeholder="SLA" />
                  <button onClick={() => updateArrayField('priorityLevels', formData.priorityLevels.filter(x => x.id !== p.id))} className="text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Office Departments */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-sm text-primary">Office Departments</h3>
            <button onClick={() => updateArrayField('officeDepartments', [...formData.officeDepartments, { id: crypto.randomUUID(), name: 'New Dept', email: '', phone: '' }])} className="text-xs font-bold text-primary flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
          </div>
          <div className="space-y-4">
            {formData.officeDepartments.map((dept, i) => (
              <div key={dept.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg relative">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department</label>
                  <input className="premium-input w-full" value={dept.name} onChange={(e) => {
                    const newArr = [...formData.officeDepartments]; newArr[i].name = e.target.value; updateArrayField('officeDepartments', newArr)
                  }} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Email</label>
                  <input className="premium-input w-full" value={dept.email} onChange={(e) => {
                    const newArr = [...formData.officeDepartments]; newArr[i].email = e.target.value; updateArrayField('officeDepartments', newArr)
                  }} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Phone</label>
                    <input className="premium-input w-full" value={dept.phone} onChange={(e) => {
                      const newArr = [...formData.officeDepartments]; newArr[i].phone = e.target.value; updateArrayField('officeDepartments', newArr)
                    }} />
                  </div>
                  <button onClick={() => updateArrayField('officeDepartments', formData.officeDepartments.filter(x => x.id !== dept.id))} className="text-destructive pb-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-card border rounded-xl p-5 space-y-4 border-l-4 border-l-destructive">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-sm text-destructive">Emergency Contacts</h3>
            <button onClick={() => updateArrayField('emergencyContacts', [...formData.emergencyContacts, { id: crypto.randomUUID(), role: 'Ops', email: '', phone: '' }])} className="text-xs font-bold text-primary flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
          </div>
          <div className="space-y-4">
            {formData.emergencyContacts.map((contact, i) => (
              <div key={contact.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-destructive/5 p-3 rounded-lg">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Role</label>
                  <input className="premium-input w-full" value={contact.role} onChange={(e) => {
                    const newArr = [...formData.emergencyContacts]; newArr[i].role = e.target.value; updateArrayField('emergencyContacts', newArr)
                  }} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Phone</label>
                  <input className="premium-input w-full" value={contact.phone} onChange={(e) => {
                    const newArr = [...formData.emergencyContacts]; newArr[i].phone = e.target.value; updateArrayField('emergencyContacts', newArr)
                  }} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Email</label>
                    <input className="premium-input w-full" value={contact.email} onChange={(e) => {
                      const newArr = [...formData.emergencyContacts]; newArr[i].email = e.target.value; updateArrayField('emergencyContacts', newArr)
                    }} />
                  </div>
                  <button onClick={() => updateArrayField('emergencyContacts', formData.emergencyContacts.filter(x => x.id !== contact.id))} className="text-destructive pb-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Questions */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-sm text-primary">Quick Questions (FAQ)</h3>
            <button onClick={() => updateArrayField('quickQuestions', [...formData.quickQuestions, { id: crypto.randomUUID(), question: 'Q', answer: 'A' }])} className="text-xs font-bold text-primary flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
          </div>
          <div className="space-y-4">
            {formData.quickQuestions.map((qq, i) => (
              <div key={qq.id} className="flex gap-3 items-start bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                <div className="flex-1 space-y-2">
                  <input className="premium-input w-full font-bold" value={qq.question} onChange={(e) => {
                    const newArr = [...formData.quickQuestions]; newArr[i].question = e.target.value; updateArrayField('quickQuestions', newArr)
                  }} placeholder="Question" />
                  <textarea className="premium-input w-full text-sm" value={qq.answer} onChange={(e) => {
                    const newArr = [...formData.quickQuestions]; newArr[i].answer = e.target.value; updateArrayField('quickQuestions', newArr)
                  }} placeholder="Answer" rows={2} />
                </div>
                <button onClick={() => updateArrayField('quickQuestions', formData.quickQuestions.filter(x => x.id !== qq.id))} className="text-destructive mt-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Publish Card */}
        <div className="bg-card border rounded-xl p-5 space-y-4 sticky top-6 shadow-sm">
          <h3 className="font-bold text-sm border-b pb-2">Publish Status</h3>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-muted-foreground">Current State</span>
            <span className={`font-bold px-2 py-0.5 rounded ${isDirty || hasDraft ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isDirty ? 'Unsaved Changes' : hasDraft ? 'Draft Saved' : 'Published'}
            </span>
          </div>
          
          <div className="pt-4 space-y-2">
            <button 
              onClick={handlePublish}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-sm"
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
                className="w-full py-2.5 text-destructive hover:bg-destructive/10 rounded-lg font-bold transition mt-4"
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
          <ContactPage />
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
                entityType="contact" 
                entityId="contact-page" 
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
