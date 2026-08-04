import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface JobOpening {
  title: string
  department: string
  location: string
}

export const CareersPage: React.FC = () => {
  const [openings, setOpenings] = useState<JobOpening[]>([])

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        const { data, error } = await supabase.from('cms_careers').select('title, department, location')
        if (error) throw error
        if (data && data.length > 0) {
          setOpenings(data)
        } else {
          setOpenings([
            { title: 'Senior Security Operations Engineer', department: 'Engineering', location: 'Remote (US/EU)' },
            { title: 'Support & Escrow Arbitrator', department: 'Operations', location: 'Remote (Global)' },
            { title: 'KYC & Compliance Lead', department: 'Legal & Risk', location: 'Remote (US)' }
          ])
        }
      } catch (err) {
        console.error('Failed to load careers from Supabase:', err)
        setOpenings([
          { title: 'Senior Security Operations Engineer', department: 'Engineering', location: 'Remote (US/EU)' },
          { title: 'Support & Escrow Arbitrator', department: 'Operations', location: 'Remote (Global)' },
          { title: 'KYC & Compliance Lead', department: 'Legal & Risk', location: 'Remote (US)' }
        ])
      }
    }
    fetchOpenings()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Careers
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Build the Future of Remote Commerce
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join a fast-growing, 100% remote team dedicated to removing geographic employment limits globally.
          </p>
        </div>

        {/* Perks */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold font-heading mb-8 text-center">Why Remote Jobs Hub?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-card border border-border p-6 rounded-2xl space-y-2">
              <h3 className="font-bold text-lg">100% Remote</h3>
              <p className="text-sm text-muted-foreground">Work from anywhere in the world. We believe in async-first productivity.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl space-y-2">
              <h3 className="font-bold text-lg">Learning Stipend</h3>
              <p className="text-sm text-muted-foreground">Get ₦1,500,000/year for books, courses, conferences, or specialized tutorials.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl space-y-2">
              <h3 className="font-bold text-lg">Health & Wellness</h3>
              <p className="text-sm text-muted-foreground">Premium health coverage, workspace stipends, and flexible parental leave plans.</p>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold font-heading mb-8">Open Positions</h2>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {openings.map((job, idx) => (
              <div key={idx} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-muted/30 transition-colors gap-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors cursor-pointer">{job.title}</h3>
                  <div className="text-sm text-muted-foreground font-medium mt-1">
                    {job.department} • {job.location}
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/95 transition-all shadow-md self-start sm:self-auto">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
