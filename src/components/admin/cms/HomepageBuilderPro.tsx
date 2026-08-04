import React, { useState } from 'react'
import { MonitorPlay, Save } from 'lucide-react'
import { BlockEditor, Block } from './BlockEditor'
import { LivePreview } from './LivePreview'
import { toast } from 'sonner'

export const HomepageBuilderPro: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'hero', data: { headline: 'Welcome to Remote Jobs Hub', subheadline: 'Find your next remote gig' } },
    { id: '2', type: 'text', data: { content: '<p>Join thousands of professionals working remotely.</p>' } },
  ])
  const [previewMode, setPreviewMode] = useState(false)

  const handleSave = () => {
    // Save to backend via service
    toast.success('Homepage updated successfully')
  }

  if (previewMode) {
    return (
      <LivePreview onClose={() => setPreviewMode(false)}>
        {/* Render actual blocks as they would appear on the homepage */}
        <div className="bg-background min-h-screen">
          {blocks.map(block => {
            if (block.type === 'hero') {
              return (
                <div key={block.id} className="py-20 text-center bg-slate-50 dark:bg-slate-900/50">
                  <h1 className="text-4xl font-bold font-heading mb-4">{block.data.headline || 'Headline'}</h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{block.data.subheadline || 'Subheadline'}</p>
                </div>
              )
            }
            if (block.type === 'text') {
              return (
                <div key={block.id} className="py-10 max-w-3xl mx-auto px-4 prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: block.data.content || '' }} />
              )
            }
            if (block.type === 'cta') {
              return (
                <div key={block.id} className="py-10 text-center">
                  <a href={block.data.url} className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">{block.data.buttonText || 'Click Here'}</a>
                </div>
              )
            }
            return (
              <div key={block.id} className="py-10 text-center text-muted-foreground border-y border-dashed my-4">
                [{block.type.toUpperCase()} BLOCK PREVIEW]
              </div>
            )
          })}
        </div>
      </LivePreview>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Homepage Builder Pro</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPreviewMode(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted text-sm font-medium"
          >
            <MonitorPlay className="w-4 h-4" /> Live Preview
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-heading font-bold text-lg">Assemble Blocks</h3>
          <p className="text-sm text-muted-foreground">Drag and drop sections to construct your homepage.</p>
        </div>
        
        <BlockEditor initialBlocks={blocks} onChange={setBlocks} />
      </div>
    </div>
  )
}
