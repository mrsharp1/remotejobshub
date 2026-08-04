import React, { useEffect, useState } from 'react'
import { Users, Video } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export interface AppEvent {
  title: string
  event_date: string
  event_time: string
  event_type: string
  description: string
}

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<AppEvent[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from('cms_events').select('title, event_date, event_time, event_type, description')
        if (error) throw error
        if (data && data.length > 0) {
          setEvents(data)
        } else {
          setEvents([
            {
              title: 'Scaling Agencies with Remote Hub Accounts',
              event_date: 'July 24, 2026',
              event_time: '18:00 UTC',
              event_type: 'Webinar',
              description: 'Learn how agency owners scale contracts and bypass geographic restrictions safely using verified accounts.'
            },
            {
              title: 'Austin Freelancer Meetup 2026',
              event_date: 'August 12, 2026',
              event_time: '19:00 CST',
              event_type: 'Meetup',
              description: 'Join local remote workers, sellers, and security engineers for a casual networking dinner.'
            }
          ])
        }
      } catch (err) {
        console.error('Failed to load events from Supabase:', err)
        setEvents([
          {
            title: 'Scaling Agencies with Remote Hub Accounts',
            event_date: 'July 24, 2026',
            event_time: '18:00 UTC',
            event_type: 'Webinar',
            description: 'Learn how agency owners scale contracts and bypass geographic restrictions safely using verified accounts.'
          },
          {
            title: 'Austin Freelancer Meetup 2026',
            event_date: 'August 12, 2026',
            event_time: '19:00 CST',
            event_type: 'Meetup',
            description: 'Join local remote workers, sellers, and security engineers for a casual networking dinner.'
          }
        ])
      }
    }
    fetchEvents()
  }, [])

  const getIcon = (type: string) => {
    if (type.toLowerCase() === 'meetup') return Users
    return Video
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Events & Webinars
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Upcoming Webinars & Meetups
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with the remote freelancer community and learn direct compliance hacks from our engineers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, idx) => {
            const Icon = getIcon(event.event_type)
            return (
              <div key={idx} className="bg-card border border-border p-6 md:p-8 rounded-3xl shadow-sm space-y-4 hover:border-primary/50 transition-colors flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <Icon className="w-4 h-4" /> {event.event_type}
                    </div>
                    <span className="text-xs text-muted-foreground font-bold">{event.event_date} • {event.event_time}</span>
                  </div>
                  <h3 className="font-bold font-heading text-2xl leading-tight">{event.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
                <button className="w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-sm rounded-xl transition-all pt-4">
                  Register Free
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
