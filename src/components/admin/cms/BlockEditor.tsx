import React, { useState } from 'react'
import { Reorder } from 'framer-motion'
import { Plus, GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

export interface Block {
  id: string
  type: 'hero' | 'text' | 'gallery' | 'cta' | 'faq'
  data: any
}

interface BlockEditorProps {
  initialBlocks: Block[]
  onChange: (blocks: Block[]) => void
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ initialBlocks, onChange }) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  const handleReorder = (newOrder: Block[]) => {
    setBlocks(newOrder)
    onChange(newOrder)
  }

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data: {}
    }
    const updated = [...blocks, newBlock]
    setBlocks(updated)
    onChange(updated)
  }

  const removeBlock = (id: string) => {
    const updated = blocks.filter(b => b.id !== id)
    setBlocks(updated)
    onChange(updated)
  }

  const updateBlockData = (id: string, data: any) => {
    const updated = blocks.map(b => b.id === id ? { ...b, data } : b)
    setBlocks(updated)
    onChange(updated)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...blocks]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    setBlocks(updated)
    onChange(updated)
  }

  const moveDown = (index: number) => {
    if (index === blocks.length - 1) return
    const updated = [...blocks]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    setBlocks(updated)
    onChange(updated)
  }

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <input 
              placeholder="Headline" 
              className="premium-input w-full px-3 py-2 rounded"
              value={block.data.headline || ''}
              onChange={e => updateBlockData(block.id, { ...block.data, headline: e.target.value })}
            />
            <input 
              placeholder="Subheadline" 
              className="premium-input w-full px-3 py-2 rounded"
              value={block.data.subheadline || ''}
              onChange={e => updateBlockData(block.id, { ...block.data, subheadline: e.target.value })}
            />
          </div>
        )
      case 'text':
        return (
          <textarea 
            rows={4}
            placeholder="Text Content (HTML allowed)" 
            className="premium-input w-full px-3 py-2 rounded resize-none"
            value={block.data.content || ''}
            onChange={e => updateBlockData(block.id, { ...block.data, content: e.target.value })}
          />
        )
      case 'cta':
        return (
          <div className="flex gap-4">
            <input 
              placeholder="Button Text" 
              className="premium-input flex-1 px-3 py-2 rounded"
              value={block.data.buttonText || ''}
              onChange={e => updateBlockData(block.id, { ...block.data, buttonText: e.target.value })}
            />
            <input 
              placeholder="URL" 
              className="premium-input flex-1 px-3 py-2 rounded"
              value={block.data.url || ''}
              onChange={e => updateBlockData(block.id, { ...block.data, url: e.target.value })}
            />
          </div>
        )
      default:
        return <div className="text-sm text-muted-foreground">Editor not implemented for {block.type}</div>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => addBlock('hero')} className="px-3 py-1.5 border rounded-lg hover:bg-muted text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Hero</button>
        <button onClick={() => addBlock('text')} className="px-3 py-1.5 border rounded-lg hover:bg-muted text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Text</button>
        <button onClick={() => addBlock('gallery')} className="px-3 py-1.5 border rounded-lg hover:bg-muted text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Gallery</button>
        <button onClick={() => addBlock('cta')} className="px-3 py-1.5 border rounded-lg hover:bg-muted text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> CTA</button>
        <button onClick={() => addBlock('faq')} className="px-3 py-1.5 border rounded-lg hover:bg-muted text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> FAQ</button>
      </div>

      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
            No blocks added yet. Start assembling your page!
          </div>
        ) : (
          <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="space-y-4">
            {blocks.map((block, index) => (
              <Reorder.Item key={block.id} value={block} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-bold text-sm uppercase tracking-wider">{block.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveDown(index)} disabled={index === blocks.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button onClick={() => removeBlock(block.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4">
                  {renderBlockEditor(block)}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  )
}
