import React from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

interface EmptyStateProps {
  onRetry: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
        <XCircle className="h-12 w-12" />
      </div>
      
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-black text-white">
          Asset Not Found
        </h2>
        <p className="text-base text-slate-400">
          This premium asset may have been recently sold, archived, or is temporarily unavailable. 
          The Escrow vault does not hold listings that are currently under transaction.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-400"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </button>
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </button>
      </div>
    </div>
  )
}
