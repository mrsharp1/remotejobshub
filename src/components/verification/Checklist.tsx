import React from 'react'
import { ChecklistItem, type ChecklistItemType, type ChecklistStatus } from './ChecklistItem'

interface ChecklistProps {
  items: ChecklistItemType[]
  onItemChange: (id: string, status: ChecklistStatus) => void
}

export const Checklist: React.FC<ChecklistProps> = ({ items, onItemChange }) => {
  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-6 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Quality Assurance Checklist
      </h3>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <ChecklistItem key={item.id} item={item} onStatusChange={onItemChange} />
        ))}
      </div>
    </div>
  )
}
