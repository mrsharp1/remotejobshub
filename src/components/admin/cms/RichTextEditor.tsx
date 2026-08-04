import React, { useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Code
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    // Optional: trigger onChange if needed, usually onInput handles it
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML)
  }

  return (
    <div className={`border rounded-lg bg-card overflow-hidden transition-all ${isFocused ? 'ring-2 ring-primary border-primary' : 'border-border'}`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2 bg-slate-50 dark:bg-slate-900/50">
        <button type="button" onClick={() => handleCommand('bold')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => handleCommand('italic')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => handleCommand('underline')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => handleCommand('formatBlock', 'H1')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <Heading1 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => handleCommand('formatBlock', 'H2')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => handleCommand('insertUnorderedList')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => handleCommand('insertOrderedList')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => {
          const url = prompt('Enter link URL')
          if (url) handleCommand('createLink', url)
        }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <LinkIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => {
          const url = prompt('Enter image URL')
          if (url) handleCommand('insertImage', url)
        }} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <ImageIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => handleCommand('formatBlock', 'BLOCKQUOTE')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <Quote className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => handleCommand('formatBlock', 'PRE')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
          <Code className="w-4 h-4" />
        </button>
      </div>
      
      <div 
        className="p-4 min-h-[200px] outline-none prose prose-sm max-w-none dark:prose-invert"
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    </div>
  )
}
