import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Milestone {
  year: string
  title: string
  description: string
}

export const CompanyTimelinePage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const { data, error } = await supabase.from('cms_timeline_milestones').select('year, title, description')
        if (error) throw error
        if (data && data.length > 0) {
          setMilestones(data)
        } else {
          setMilestones([
            { year: '2024', title: 'Platform Launch', description: 'Remote Jobs Hub launched with our first 10 verified US accounts.' },
            { year: '2025', title: 'Military-Grade Escrow', description: 'Fully transitioned all customer payments to biometric-approved Escrow vaults.' },
            { year: '2026', title: 'Series A Funding', description: 'Raised ₦15B Series A to build the automated KYC & Compliance engine.' },
            { year: 'Future', title: 'Autonomous Auditing', description: 'AI-assisted profile scoring to verify historical earnings instantly.' }
          ])
        }
      } catch (err) {
        console.error('Failed to load milestones from Supabase:', err)
        setMilestones([
          { year: '2024', title: 'Platform Launch', description: 'Remote Jobs Hub launched with our first 10 verified US accounts.' },
          { year: '2025', title: 'Military-Grade Escrow', description: 'Fully transitioned all customer payments to biometric-approved Escrow vaults.' },
          { year: '2026', title: 'Series A Funding', description: 'Raised ₦15B Series A to build the automated KYC & Compliance engine.' },
          { year: 'Future', title: 'Autonomous Auditing', description: 'AI-assisted profile scoring to verify historical earnings instantly.' }
        ])
      }
    }
    fetchMilestones()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Our Journey
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Company Milestone Timeline
          </h1>
          <p className="text-muted-foreground text-lg">
            A look back at how we revolutionized remote employment trust, and where we are heading next.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-border/80 pl-8 space-y-12 ml-4">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="relative space-y-2">
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-primary border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center shadow" />
              <div className="text-sm font-bold text-primary">{milestone.year}</div>
              <h3 className="font-bold text-xl font-heading text-foreground">{milestone.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{milestone.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
