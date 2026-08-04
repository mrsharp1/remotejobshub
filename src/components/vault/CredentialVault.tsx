import React, { useState } from 'react'
import { KeyRound, Lock, FileCode2 } from 'lucide-react'
import { CredentialField } from './CredentialField'
import { RevealModal } from './RevealModal'

export interface VaultPayload {
  vaultEmail?: string
  vaultPassword?: string
  vaultRecoveryEmail?: string
  vaultRecoveryPhone?: string
  vaultBackupCodes?: string
  vaultCookies?: string
  vaultInstructions?: string
}

interface CredentialVaultProps {
  isReady: boolean
  isRevealed: boolean
  onReveal: () => void
  payload: VaultPayload | null
}

export const CredentialVault: React.FC<CredentialVaultProps> = ({ isReady, isRevealed, onReveal, payload }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)

  if (!payload) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950 p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-slate-600 mb-4" />
        <h2 className="font-heading text-lg font-bold text-white mb-2">Escrow Payload</h2>
        <p className="text-sm text-slate-400">Credential payload unavailable.</p>
      </div>
    )
  }

  const handleRevealClick = () => {
    if (!isReady) return
    setModalOpen(true)
  }

  const handleConfirmReveal = () => {
    setIsDecrypting(true)
    setTimeout(() => {
      setIsDecrypting(false)
      setModalOpen(false)
      onReveal()
    }, 1500) // Simulate decryption delay
  }


  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950 p-4 sm:p-8">
      {/* Top Banner */}
      <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Escrow Payload</h2>
            <p className="text-xs text-slate-500">AES-256 Encrypted Storage</p>
          </div>
        </div>
        
        {!isRevealed && isReady && (
          <button
            onClick={handleRevealClick}
            className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 sm:flex"
          >
            <KeyRound className="h-4 w-4" /> Reveal Credentials
          </button>
        )}
      </div>

      <div className="space-y-3">
        <CredentialField label="Primary Email / Username" value={payload.vaultEmail || ''} isRevealed={isRevealed} />
        <CredentialField label="Password" value={payload.vaultPassword || ''} isRevealed={isRevealed} />
        <CredentialField label="Recovery Email" value={payload.vaultRecoveryEmail || ''} isRevealed={isRevealed} />
        <CredentialField label="Recovery Phone" value={payload.vaultRecoveryPhone || ''} isRevealed={isRevealed} />
        
        {/* Multiline Fields */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-xl bg-slate-900/50 p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              2FA Backup Codes
            </span>
            <div className="font-mono text-xs text-slate-300">
              {isRevealed ? (
                <pre className="whitespace-pre-wrap">{payload.vaultBackupCodes || 'None provided'}</pre>
              ) : (
                <div className="flex flex-col gap-1 text-slate-600">
                  <span>••••-••••</span>
                  <span>••••-••••</span>
                  <span>••••-••••</span>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl bg-slate-900/50 p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Session Cookies
            </span>
            <div className="font-mono text-xs text-slate-300">
              {isRevealed ? (
                <div className="flex items-start gap-2">
                  <FileCode2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <span className="break-all">{payload.vaultCookies || 'None provided'}</span>
                </div>
              ) : (
                <span>••••••••••••••••••••••••••••••••</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {!isRevealed && isReady && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <button
            onClick={handleRevealClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-2xl"
          >
            <KeyRound className="h-5 w-5" /> Reveal Credentials
          </button>
        </div>
      )}

      <RevealModal 
        isOpen={modalOpen} 
        isLoading={isDecrypting}
        onConfirm={handleConfirmReveal}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  )
}
