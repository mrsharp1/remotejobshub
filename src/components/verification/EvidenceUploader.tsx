import React from 'react'
import { UploadCloud, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

export const EvidenceUploader: React.FC = () => {
  const handleUpload = () => {
    toast.success('Evidence uploaded securely to the immutable ledger.')
  }

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6 sm:p-8">
      <h3 className="mb-2 font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Attach Evidence
      </h3>
      <p className="mb-6 text-xs text-slate-500">
        Upload screenshots or recordings. Required if you need to open a dispute.
      </p>

      <button 
        onClick={handleUpload}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 bg-slate-950 p-8 text-slate-400 hover:border-indigo-500/50 hover:bg-slate-900 hover:text-indigo-400"
      >
        <UploadCloud className="h-8 w-8" />
        <span className="text-sm font-bold">Click to upload files</span>
        <span className="text-[10px] uppercase tracking-wider opacity-60">PNG, JPG, MP4 (Max 50MB)</span>
      </button>

      {/* Simulated Uploaded Files */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-lg bg-slate-900 p-3">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-slate-300">login_success.png</span>
          </div>
          <span className="text-[10px] text-slate-500">240 KB</span>
        </div>
      </div>
    </div>
  )
}
