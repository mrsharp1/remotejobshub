import React, { useState } from 'react'
import { Play, Eye, ThumbsUp, MessageSquare } from 'lucide-react'

export const VideoTestimonialHub: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState('all')

  const videos = [
    {
      id: 1,
      title: 'How I doubled my freelancing rates in 14 days',
      thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
      buyer: 'Sergey M.',
      role: 'Full-stack Dev',
      views: '1.2k',
      likes: 85,
      comments: 12,
      duration: '3:45',
      category: 'buyers',
    },
    {
      id: 2,
      title: 'Safe accounts selling roadmap for agency owners',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      buyer: 'Elena R.',
      role: 'Top Rated Seller',
      views: '940',
      likes: 64,
      comments: 8,
      duration: '4:12',
      category: 'sellers',
    }
  ]

  const filteredVideos = filterCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === filterCategory)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-4">Video Testimonial Hub</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hear directly from verified remote workers who bypassed geographical limits using Remote Jobs Hub.
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-4 mb-8">
          {['all', 'buyers', 'sellers'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${
                filterCategory === cat
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm group">
              <div className="relative aspect-video overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer">
                <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary fill-current ml-1" />
                </div>
                <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
                  {video.duration}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold font-heading text-xl group-hover:text-primary transition-colors leading-tight mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    by <span className="font-bold text-foreground">{video.buyer}</span> • {video.role}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {video.views} views</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {video.likes} likes</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {video.comments} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
