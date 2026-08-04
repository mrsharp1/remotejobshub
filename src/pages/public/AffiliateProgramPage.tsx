import React, { useState } from 'react'

export const AffiliateProgramPage: React.FC = () => {
  const [salesCount, setSalesCount] = useState(10)
  const estimatedEarnings = salesCount * 50000 // Assume ₦50,000 average commission per sale

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Affiliate Program
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading leading-tight">
            Earn Cash on Every Account Referred
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Promote the world's most trusted remote account escrow platform. High conversion rates and lifetime tracking.
          </p>
        </div>

        {/* Commission Calculator */}
        <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl mx-auto space-y-8 shadow-sm">
          <h2 className="text-2xl font-bold font-heading text-center">Earnings Calculator</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between font-bold text-sm">
              <span>Estimated Sales Per Month</span>
              <span className="text-primary">{salesCount} Sales</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={salesCount} 
              onChange={(e) => setSalesCount(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
            />
          </div>

          <div className="bg-muted p-6 rounded-2xl border border-border/50 text-center space-y-2">
            <div className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Estimated Monthly Commission</div>
            <div className="text-4xl md:text-5xl font-black text-emerald-500 font-heading">₦{estimatedEarnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Calculated at an average of ₦50,000 commission per verified account transaction.</div>
          </div>

          <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/20">
            Join Affiliate Program
          </button>
        </div>
      </div>
    </div>
  )
}
