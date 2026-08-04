import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { useCommunityContent } from '@/services/cms/cms.store'

export const UpcomingEvents: React.FC = () => {
  const { events } = useCommunityContent()
  const activeEvents = events.filter(e => e.status === 'upcoming')

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Upcoming Events
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Participate in live webinars, AMAs, and platform announcements with the core team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeEvents.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`premium-card flex flex-col justify-between overflow-hidden ${event.featured ? 'md:col-span-2 lg:col-span-2 ring-2 ring-violet-500' : ''}`}
            >
              {event.banner && (
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    {event.pinned ? 'Pinned' : 'Event'}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {event.date} • {event.time}
                  </div>
                </div>
                
                <h3 className="mb-4 font-heading text-2xl font-bold text-foreground">
                  {event.title}
                </h3>
                <p className="mb-8 text-base leading-relaxed text-muted-foreground flex-1">
                  {event.description}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400"
                    >
                      Register Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {activeEvents.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500">
              No upcoming events at the moment. Check back soon!
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
