import React from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Globe } from 'lucide-react'
import { useAboutContent } from '@/services/cms/cms.store'

export const LeadershipTeam: React.FC = () => {
  const { founderMessage } = useAboutContent()

  // The rest of the team could eventually be migrated to CMS. For now, the Founder is fully CMS-driven.
  const team = [
    {
      isFounder: true,
      name: founderMessage.name,
      role: founderMessage.role,
      desc: founderMessage.message,
      image: founderMessage.image,
      linkedin: founderMessage.linkedin || '#',
      twitter: founderMessage.twitter || '#',
      website: founderMessage.website || '#',
      videoMessage: founderMessage.videoMessage,
      signature: founderMessage.signature
    },
    {
      isFounder: false,
      name: 'Sarah Jenkins',
      role: 'Chief Operating Officer',
      desc: 'Expert in global compliance and marketplace operations. Sarah leads the KYC and dispute resolution teams.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      linkedin: '#'
    },
    {
      isFounder: false,
      name: 'Marcus Thorne',
      role: 'Head of Engineering',
      desc: 'Architect of the proprietary Escrow Engine and AI Risk Intelligence systems that secure millions in transactions.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      linkedin: '#'
    }
  ]

  return (
    <section className="bg-slate-50 py-32 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Executive Leadership
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A team of fintech veterans and cybersecurity experts dedicated to protecting your assets.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`premium-card group overflow-hidden ${member.isFounder ? 'ring-2 ring-primary ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-900' : ''}`}
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {member.isFounder && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Founder
                  </div>
                )}
              </div>
              <div className="relative bg-white p-8 dark:bg-slate-950 flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">{member.name}</h3>
                    <p className="font-medium text-indigo-600 dark:text-indigo-400">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground flex-1 mb-6 italic">"{member.desc}"</p>
                
                <div className="flex items-center justify-between mt-auto">
                  {member.signature ? (
                    <span className="font-mono text-sm font-bold text-slate-400">{member.signature}</span>
                  ) : (
                    <span />
                  )}
                  
                  <div className="flex gap-2">
                    {member.twitter && member.twitter !== '#' && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-sky-50 hover:text-sky-500 dark:bg-slate-800 dark:hover:bg-sky-500/20 dark:hover:text-sky-400">
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.website && member.website !== '#' && (
                      <a href={member.website} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-400">
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
