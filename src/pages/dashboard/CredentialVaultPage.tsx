import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { orderService } from '@/services/marketplace/order.service'
import { getPremiumOrderStatus } from '@/utils/OrderStatusMapper'
import { EventEngine } from '@/lib/events/EventEngine'

import { VaultHero } from '@/components/vault/VaultHero'
import { CredentialVault, VaultPayload } from '@/components/vault/CredentialVault'
import { VaultSecurity } from '@/components/vault/VaultSecurity'
import { VaultTimeline } from '@/components/vault/VaultTimeline'
import { DownloadCenter } from '@/components/vault/DownloadCenter'
import { VerificationBanner } from '@/components/vault/VerificationBanner'
import { HelpSection } from '@/components/vault/HelpSection'
import { LoadingVault } from '@/components/vault/LoadingVault'
import { EmptyVault } from '@/components/vault/EmptyVault'
import { ArrowLeft } from 'lucide-react'

export const CredentialVaultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [isRevealed, setIsRevealed] = useState(false)

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['vault-order', id],
    queryFn: () => {
      if (!id) throw new Error('No order ID')
      return orderService.getOrder(id)
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingVault />
  if (isError || !order || (order.buyer_id !== user?.id)) return <EmptyVault />

  const premiumStatus = getPremiumOrderStatus(order.status)
  const isReady = premiumStatus === 'BUYER_VERIFYING' || premiumStatus === 'COMPLETED' || premiumStatus === 'CREDENTIALS_DELIVERED'

  let payload: VaultPayload | null = null
  if (order.listing?.reason_for_sale?.startsWith('VAULT_SECURE_PAYLOAD:')) {
    try {
      const base64Str = order.listing.reason_for_sale.replace('VAULT_SECURE_PAYLOAD:', '')
      const decodedStr = atob(base64Str)
      payload = JSON.parse(decodedStr)
    } catch (err) {
      console.error('Failed to parse escrow payload:', err)
    }
  }

  const handleVerifyClick = () => {
    navigate(`/verification/${order.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard/buyer')}
            className="group flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Command Center
          </button>
          <div className="text-right">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Reference ID
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:space-y-8">
        
        <VerificationBanner order={order} onVerifyClick={handleVerifyClick} />

        <VaultHero order={order} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          
          {/* Main Vault Panel */}
          <div className="space-y-6 lg:col-span-8">
            <CredentialVault 
              isReady={isReady} 
              isRevealed={isRevealed}
              payload={payload}
              onReveal={() => {
                setIsRevealed(true)
                EventEngine.publish('VAULT_OPENED', {
                  orderId: order.id,
                  buyerId: user?.id || ''
                })
              }}
            />
            
            <DownloadCenter isRevealed={isRevealed} />
            
            <VaultSecurity />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            <VaultTimeline order={order} />
            <HelpSection order={order} />
          </div>
          
        </div>
      </div>
    </div>
  )
}
