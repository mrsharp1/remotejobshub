import React, { useState } from 'react'
import { Copy, Check, EyeOff } from 'lucide-react'

interface CredentialFieldProps {
  label: string
  value: string
  isRevealed: boolean
}

export const CredentialField: React.FC<CredentialFieldProps> = ({ label, value, isRevealed }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!isRevealed || !value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-900/50 p-4 transition-colors hover:bg-slate-800">
      <div className="flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className="mt-1 font-mono text-sm sm:text-base text-white">
          {isRevealed ? (
            value || <span className="italic text-slate-600">Not provided</span>
          ) : (
            <div className="flex items-center gap-2 text-slate-600">
              <EyeOff className="h-4 w-4" />
              <span>••••••••••••••••</span>
            </div>
          )}
        </div>
      </div>
      
      {isRevealed && value && (
        <button
          onClick={handleCopy}
          className={`flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-white/5 transition-all sm:w-24 ${
            copied 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span className="text-xs font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-xs font-bold">Copy</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
