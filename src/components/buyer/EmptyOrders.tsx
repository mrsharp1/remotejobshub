import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PackageSearch, ArrowRight } from 'lucide-react'

export const EmptyOrders: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-[24px] border border-white/5 bg-slate-900/30 px-4 py-20 text-center backdrop-blur-sm">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
        <PackageSearch className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-black text-white">No purchases yet.</h2>
        <p className="max-w-sm text-sm text-slate-400">
          When you purchase an account, it will appear here protected by our escrow system.
        </p>
      </div>
      <button
        onClick={() => navigate('/marketplace')}
        className="group flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/25 active:scale-95"
      >
        Browse Marketplace
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  )
}
