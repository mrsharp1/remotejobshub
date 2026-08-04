import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export const EmptyVault: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 ring-4 ring-rose-500/5">
        <ShieldAlert className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-black text-white">Vault Access Denied</h2>
        <p className="max-w-md text-sm text-slate-400">
          We could not find the secure payload for this order, or you do not have permission to access it.
        </p>
      </div>
      <button
        onClick={() => navigate('/dashboard/buyer')}
        className="group flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Return to Command Center
      </button>
    </div>
  )
}
