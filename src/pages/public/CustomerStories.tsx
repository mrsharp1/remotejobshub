import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'

export const CustomerStories: React.FC = () => {
  const stories = [
    {
      slug: 'how-oleg-built-a-10k-monthly-agency-with-us-profiles',
      title: 'How Oleg Built a ₦15M/mo Design Agency Using US Profiles',
      excerpt: 'Oleg shares his complete roadmap from buying a verified Upwork account to hiring 4 developers and scaling monthly recurring revenue.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      time: '6 min read',
      category: 'Agency Scale',
    },
    {
      slug: 'from-zero-to-top-rated-plus-on-upwork-in-90-days',
      title: 'From Zero to Top Rated Plus on Upwork in 90 Days',
      excerpt: 'A deep-dive interview with Sarah, a mobile developer who bypassed onboarding limits with our verified business profile.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      time: '4 min read',
      category: 'Freelancing',
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">Customer Case Studies</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deep-dive stories from real remote workers who scaled their freelancing operations instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story, i) => (
            <motion.div 
              key={story.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {story.category}
                </span>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> {story.time}
                  </div>
                  <h3 className="font-bold font-heading text-2xl group-hover:text-primary transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>
                <Link 
                  to={`/stories/${story.slug}`} 
                  className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all pt-4 border-t border-border"
                >
                  Read Full Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
