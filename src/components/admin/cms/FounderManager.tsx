import React from 'react'
import { User, Briefcase, FileText, Type, Image as ImageIcon, Link as LinkIcon, Video } from 'lucide-react'
import { useCMSStore, AboutPageContent } from '@/services/cms/cms.store'

export const FounderManager: React.FC = () => {
  const { aboutContent, aboutDraft, updateAboutDraft } = useCMSStore()
  const content = aboutDraft || aboutContent
  const founder = content.founderMessage

  const handleChange = (field: keyof AboutPageContent['founderMessage'], value: string) => {
    updateAboutDraft({
      ...content,
      founderMessage: {
        ...founder,
        [field]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">Founder Profile</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <User className="h-3 w-3" /> Founder Name
            </label>
            <input
              type="text"
              value={founder.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Briefcase className="h-3 w-3" /> Position / Role
            </label>
            <input
              type="text"
              value={founder.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <ImageIcon className="h-3 w-3" /> Photograph URL
            </label>
            <input
              type="text"
              value={founder.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Type className="h-3 w-3" /> Signature Text
            </label>
            <input
              type="text"
              value={founder.signature || ''}
              onChange={(e) => handleChange('signature', e.target.value)}
              placeholder="e.g. S. Chen"
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <FileText className="h-3 w-3" /> Founder Biography / Message
            </label>
            <textarea
              value={founder.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={5}
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <LinkIcon className="h-3 w-3" /> LinkedIn Profile
            </label>
            <input
              type="text"
              value={founder.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <LinkIcon className="h-3 w-3" /> Twitter / X Profile
            </label>
            <input
              type="text"
              value={founder.twitter || ''}
              onChange={(e) => handleChange('twitter', e.target.value)}
              placeholder="https://twitter.com/..."
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Video className="h-3 w-3" /> Video Message URL
            </label>
            <input
              type="text"
              value={founder.videoMessage || ''}
              onChange={(e) => handleChange('videoMessage', e.target.value)}
              placeholder="YouTube or Vimeo link..."
              className="w-full rounded-lg border bg-white p-3 text-sm focus:outline-none dark:bg-slate-950"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
