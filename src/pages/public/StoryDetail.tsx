import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, Download, Share2 } from 'lucide-react'

export const StoryDetail: React.FC = () => {
  useParams<{ slug: string }>()

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/stories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Customer Stories
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-primary">
            <span>Case Study</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 6 min read</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Published May 2026</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            How Oleg Built a ₦15M/mo Design Agency Using US Profiles
          </h1>

          <div className="flex gap-4 items-center py-4 border-y border-border">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Oleg" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-bold text-sm">Oleg D.</div>
                <div className="text-xs text-muted-foreground">Founder, PixelCore Studio</div>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-bold hover:bg-muted/50 transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-bold hover:bg-muted/50 transition-colors">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none pt-4 space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg text-foreground font-semibold">
              Oleg was a UI/UX designer based in Eastern Europe struggling with localized platform algorithm changes and client budget limitations. In this story, he shares his complete journey scaling to ₦15,000,000/month in recurring agency contracts.
            </p>

            <h2 className="text-2xl font-bold font-heading text-foreground pt-4">The Challenge</h2>
            <p>
              "I had the skills and a solid portfolio, but Upwork's client base in Europe was increasingly price-sensitive, and landing premium enterprise clients from US/UK was nearly impossible due to regional ranking filters. I was capped at around ₦3,500,000/month working 60+ hours a week."
            </p>

            <h2 className="text-2xl font-bold font-heading text-foreground pt-4">The Solution: Remote Jobs Hub</h2>
            <p>
              "I purchased a verified US Business Account through Remote Jobs Hub's secure escrow system. The verification documents, KYC checkpoints, and clean VPN setups were handled in under 24 hours. The seller transferred the login credentials, security questions, and verified stripe withdrawal options smoothly."
            </p>

            <h2 className="text-2xl font-bold font-heading text-foreground pt-4">The Results</h2>
            <p>
              "Within the first month, our conversion rate on enterprise proposals increased by 300%. We landed a ₦6,500,000/month recurring product design contract in the first two weeks. I was able to hire two full-time junior designers to offload development and product delivery. Today, we consistently track over ₦15M every month with zero account flagging or compliance restrictions."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
