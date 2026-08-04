import React from 'react'
import { Check, X, Circle } from 'lucide-react'

export type ChecklistStatus = 'pending' | 'completed' | 'failed'

export interface ChecklistItemType {
  id: string
  label: string
  status: ChecklistStatus
}

interface ChecklistItemProps {
  item: ChecklistItemType
  onStatusChange: (id: string, status: ChecklistStatus) => void
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onStatusChange }) => {
  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
      item.status === 'completed' 
        ? 'border-emerald-500/20 bg-emerald-500/5' 
        : item.status === 'failed'
          ? 'border-rose-500/20 bg-rose-500/5'
          : 'border-white/5 bg-slate-900/50 hover:bg-slate-800'
    }`}>
      <div className="flex items-center gap-3">
        {item.status === 'completed' && <Check className="h-5 w-5 text-emerald-500" />}
        {item.status === 'failed' && <X className="h-5 w-5 text-rose-500" />}
        {item.status === 'pending' && <Circle className="h-5 w-5 text-slate-600" />}
        
        <span className={`text-sm font-bold ${
          item.status === 'completed' ? 'text-emerald-400' 
          : item.status === 'failed' ? 'text-rose-400' 
          : 'text-slate-300'
        }`}>
          {item.label}
        </span>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onStatusChange(item.id, 'completed')}
          className={`flex h-9 flex-1 items-center justify-center rounded-lg border text-xs font-bold transition-all sm:w-24 ${
            item.status === 'completed'
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'border-white/5 bg-slate-950 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
          }`}
        >
          Pass
        </button>
        <button
          onClick={() => onStatusChange(item.id, 'failed')}
          className={`flex h-9 flex-1 items-center justify-center rounded-lg border text-xs font-bold transition-all sm:w-24 ${
            item.status === 'failed'
              ? 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'border-white/5 bg-slate-950 text-slate-400 hover:border-rose-500/50 hover:text-rose-400'
          }`}
        >
          Fail
        </button>
      </div>
    </div>
  )
}
