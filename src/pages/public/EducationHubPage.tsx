import React, { useEffect } from 'react'
import { GraduationCap, PlayCircle, BookOpen, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export const EducationHubPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const courses = [
    { title: 'Remote Freelancing 101', type: 'Course', duration: '2 Hours', icon: BookOpen },
    { title: 'Mastering Upwork Proposals', type: 'Video Series', duration: '45 Mins', icon: PlayCircle },
    { title: 'Scaling Your Agency', type: 'Advanced Guide', duration: 'Read', icon: TrendingUp },
    { title: 'Building Client Trust', type: 'Workshop', duration: '1.5 Hours', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      <section className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6 tracking-tight">Success Academy</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto mb-10">
            Learn the strategies, tools, and mindsets required to thrive in the remote work economy.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">New courses added weekly</span>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold font-heading">Featured Learning Paths</h2>
            <Link to="/knowledge" className="text-primary font-medium hover:underline">View All Knowledge Base</Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-card border rounded-3xl p-8 hover:border-primary/50 transition-colors shadow-sm group cursor-pointer">
                <div className="flex items-start justify-between mb-12">
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <course.icon className="w-7 h-7" />
                  </div>
                  <div className="px-3 py-1 bg-muted rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {course.type}
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <div className="text-muted-foreground font-medium flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> {course.duration}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-card border rounded-3xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <h3 className="text-3xl font-bold font-heading mb-4 relative z-10">Want to contribute?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10">
              Are you an experienced remote worker? Share your knowledge and earn money by creating courses for the Success Academy.
            </p>
            <button className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors relative z-10 shadow-lg shadow-primary/25">
              Become an Instructor
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
