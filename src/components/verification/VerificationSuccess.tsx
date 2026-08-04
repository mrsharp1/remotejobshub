import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Star, ShoppingBag } from 'lucide-react'

export const VerificationSuccess: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 px-4 text-center">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
        <CheckCircle2 className="h-16 w-16" />
      </div>
      
      <div className="space-y-4">
        <h2 className="font-heading text-3xl font-black text-white sm:text-4xl">Verification Completed</h2>
        <p className="mx-auto max-w-md text-slate-400">
          Escrow released. Seller paid. Transaction complete. Enjoy your new account!
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <button 
          onClick={() => navigate('/dashboard/buyer')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <Star className="h-5 w-5" /> Rate Seller & Leave Review
        </button>
        <button 
          onClick={() => navigate('/marketplace')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 py-4 text-sm font-bold text-white transition-colors hover:bg-slate-800"
        >
          <ShoppingBag className="h-5 w-5" /> Browse Marketplace
        </button>
      </div>
    </div>
  )
}
