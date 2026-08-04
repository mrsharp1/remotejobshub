import React from 'react'
import { DownloadCloud, FileArchive, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface DownloadCenterProps {
  isRevealed: boolean
}

export const DownloadCenter: React.FC<DownloadCenterProps> = ({ isRevealed }) => {
  const handleDownload = (pkgName: string) => {
    if (!isRevealed) {
      toast.error('You must reveal credentials first to decrypt the download packages.')
      return
    }
    toast.success(`${pkgName} downloading securely...`)
  }

  const packages = [
    { id: 'master', title: 'Master Credential Package', desc: 'All credentials, recovery info, and session cookies', icon: FileArchive },
    { id: 'instructions', title: 'Handoff Instructions', desc: 'Seller-provided security transfer steps', icon: Shield },
  ]

  return (
    <div className="rounded-[24px] border border-white/5 bg-slate-900/30 p-6">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300">
        Secure Downloads
      </h3>
      
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => handleDownload(pkg.title)}
            className={`flex flex-1 items-center gap-4 rounded-xl border border-white/5 p-4 text-left transition-all ${
              isRevealed 
                ? 'bg-slate-900/50 hover:bg-slate-800' 
                : 'cursor-not-allowed bg-slate-900/20 opacity-50'
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              isRevealed ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'
            }`}>
              <pkg.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-bold ${isRevealed ? 'text-white' : 'text-slate-500'}`}>
                {pkg.title}
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-500 line-clamp-1">
                {pkg.desc}
              </p>
            </div>
            <DownloadCloud className={`h-5 w-5 shrink-0 ${isRevealed ? 'text-slate-400' : 'text-slate-700'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
