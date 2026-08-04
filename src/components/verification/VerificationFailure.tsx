import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, MessageSquare, ArrowLeft } from 'lucide-react'

export const VerificationFailure: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 px-4 text-center">
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 ring-8 ring-rose-500/10">
        <ShieldAlert className="h-16 w-16" />
      </div>
      
      <div className="space-y-4">
        <h2 className="font-heading text-3xl font-black text-white sm:text-4xl">Dispute Opened</h2>
        <p className="mx-auto max-w-md text-slate-400">
          Escrow funds are now locked. Admin team has been notified and is reviewing your evidence.
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <button 
          onClick={() => navigate('/dashboard/messages')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-4 text-sm font-bold text-white transition-colors hover:bg-slate-700"
        >
          <MessageSquare className="h-5 w-5" /> Message Support
        </button>
        <button 
          onClick={() => navigate('/dashboard/buyer')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 py-4 text-sm font-bold text-white transition-colors hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" /> Return to Command Center
        </button>
      </div>
    </div>
  )
}
