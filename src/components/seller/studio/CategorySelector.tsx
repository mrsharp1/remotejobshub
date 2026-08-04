import React from 'react'
import { Sparkles, Cpu, Handshake, Briefcase, TrendingUp, Globe, Award, UserCheck, Plus } from 'lucide-react'

export interface CategoryOption {
  key: string
  label: string
  desc: string
  icon: React.ComponentType<any>
}

const CATEGORIES: CategoryOption[] = [
  { key: 'outlier', label: 'Outlier', desc: 'AI training & reinforcement learning profiles', icon: Sparkles },
  { key: 'appen', label: 'Appen', desc: 'Crowdsourced data annotation & evaluation roles', icon: Cpu },
  { key: 'handshake', label: 'Handshake', desc: 'Early career university student profiles', icon: Handshake },
  { key: 'upwork', label: 'Upwork', desc: 'Premium established freelancing credentials', icon: Briefcase },
  { key: 'fiverr', label: 'Fiverr', desc: 'Active level 1/2/TRS gigs & seller levels', icon: TrendingUp },
  { key: 'freelancer', label: 'Freelancer', desc: 'Global outsourcing & bidding platform accounts', icon: Globe },
  { key: 'toptal', label: 'Toptal', desc: 'Vetted top 3% software engineering profiles', icon: Award },
  { key: 'remote_job', label: 'Remote Job Account', desc: 'Deel, Rippling, or general corporate payroll access', icon: UserCheck },
  { key: 'other', label: 'Other', desc: 'Any other platform or custom marketplace asset', icon: Plus },
]

interface CategorySelectorProps {
  selected: string
  onSelect: (key: string) => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-heading text-base font-bold text-slate-900 dark:text-white">Account Category</h4>
        <p className="text-xs text-slate-400">Select the target platform category for this listing asset</p>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {CATEGORIES.map((c) => {
          const Icon = c.icon
          const isSelected = selected.toLowerCase() === c.key
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelect(c.key)}
              className={`flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 shadow-md scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-slate-350 dark:border-white/5 dark:bg-slate-900/60'
              }`}
            >
              <div className={`rounded-xl p-2 shrink-0 ${isSelected ? 'bg-purple-500/10 text-purple-600' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h5 className="font-heading text-xs font-bold text-slate-950 dark:text-white mt-4">{c.label}</h5>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{c.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
