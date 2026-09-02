import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = () => {
    const trimmed = inputValue.trim().toLowerCase()
    if (!trimmed) return

    if (tags.length >= 10) {
      return
    }

    if (tags.includes(trimmed)) {
      setInputValue('')
      return
    }

    onChange([...tags, trimmed])
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-foreground">
          Listing Tags (Max 10)
        </label>
        <span className="text-xs text-muted-foreground">
          {tags.length} / 10 tags
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="premium-input flex-1 px-3 py-2 text-sm text-foreground focus:outline-none dark:bg-gray-800 dark:text-white placeholder-gray-400"
          placeholder="e.g. ad-network (press Enter to add)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={tags.length >= 10}
        />
        <button
          type="button"
          onClick={handleAddTag}
          disabled={tags.length >= 10 || !inputValue.trim()}
          className="hover:bg-secondary/80 inline-flex items-center justify-center rounded-lg bg-secondary px-3.5 text-secondary-foreground disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Removable chips container */}
      <div className="bg-muted/20 flex min-h-[36px] flex-wrap gap-2 rounded-lg border p-1">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              layout
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-primary/10 border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {tags.length === 0 && (
          <span className="self-center px-2 text-xs text-muted-foreground">
            No tags added yet.
          </span>
        )}
      </div>
    </div>
  )
}
