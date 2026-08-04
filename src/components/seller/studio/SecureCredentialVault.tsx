import React, { useState } from 'react'
import { ShieldAlert, ShieldCheck, Eye, EyeOff, Lock } from 'lucide-react'

interface SecureCredentialVaultProps {
  formData: any
  onChange: (data: any) => void
}

export const SecureCredentialVault: React.FC<SecureCredentialVaultProps> = ({ formData, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  const handleUpdate = (field: string, val: any) => {
    onChange({ ...formData, [field]: val })
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Inputs block */}
      <div className="md:col-span-2 space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-4.5 w-4.5 text-purple-600 animate-pulse" />
            <h4 className="font-heading text-base font-bold text-slate-900 dark:text-white">Secure Credential Vault</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Credentials are encrypted with AES-256 and never shown publicly.</p>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Primary Account Email</label>
            <input
              type="email"
              placeholder="e.g. outlier_host@gmail.com"
              value={formData.vaultEmail || ''}
              onChange={(e) => handleUpdate('vaultEmail', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="relative">
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={formData.vaultPassword || ''}
                onChange={(e) => handleUpdate('vaultPassword', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 pr-10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Recovery Email</label>
              <input
                type="email"
                placeholder="e.g. backup_email@gmail.com"
                value={formData.vaultRecoveryEmail || ''}
                onChange={(e) => handleUpdate('vaultRecoveryEmail', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Recovery Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 019-2834"
                value={formData.vaultRecoveryPhone || ''}
                onChange={(e) => handleUpdate('vaultRecoveryPhone', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div className="relative">
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">2FA / Backup Codes</label>
            <div className="relative">
              <input
                type={showBackupCodes ? 'text' : 'password'}
                placeholder="Backup recovery keys..."
                value={formData.vaultBackupCodes || ''}
                onChange={(e) => handleUpdate('vaultBackupCodes', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 pr-10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showBackupCodes ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="hover:bg-slate-50 dark:hover:bg-slate-950/40 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 p-3">
              <input
                type="checkbox"
                checked={formData.vault2faEnabled || false}
                onChange={(e) => handleUpdate('vault2faEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-200 text-purple-600 focus:ring-purple-500"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Active 2FA Configured</p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Two-factor auth has been configured for the credentials supplied.</p>
              </div>
            </label>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Session Cookies (JSON String)</label>
            <textarea
              placeholder="Paste cookies to preserve active session authorization..."
              value={formData.vaultCookies || ''}
              onChange={(e) => handleUpdate('vaultCookies', e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Additional instructions</label>
            <textarea
              placeholder="e.g. VPN instructions, backup device configurations..."
              value={formData.vaultInstructions || ''}
              onChange={(e) => handleUpdate('vaultInstructions', e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>
      </div>

      {/* Security Info Right Panel */}
      <div className="rounded-2xl border border-purple-100 bg-purple-50/20 p-5 space-y-4 dark:border-purple-950/20 dark:bg-purple-950/10">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider">Vault Safeguard Protocol</h4>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <h5 className="font-bold text-slate-800 dark:text-white">AES-256 Encryption</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Your credentials are encrypted immediately upon submission at the client-side boundary.</p>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 dark:text-white">Zero Public Exposure</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Private login information is locked and never indexed or listed in public search indexes.</p>
          </div>
          <div>
            <h5 className="font-bold text-slate-800 dark:text-white">Escrow Release Verification</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">The escrow engine only releases credentials to the buyer after their payment clears in full.</p>
          </div>
        </div>

        {/* Animated Shield Mock */}
        <div className="flex justify-center py-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600">
            <ShieldCheck className="h-8 w-8 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
