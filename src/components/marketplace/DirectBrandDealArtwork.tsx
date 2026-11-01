import React from 'react'
import { Briefcase, ShieldCheck } from 'lucide-react'
import { Listing } from '@/types'

export interface DirectBrandDealInfo {
  badgeLabel: string
  artworkUrl: string
}

const DIRECT_BRAND_DEAL_IDS = new Set([
  '78687093-7dc8-488c-a8c3-24da15c89692', // ₦40,000 Official Brand Account
  '6e7d3d52-463f-4c6e-992a-a17d83016e42', // ₦110,000 Official Brand Account
])

export function getDirectBrandDealInfo(
  listing?: Listing | null
): DirectBrandDealInfo | null {
  if (!listing) return null

  const price = Number(listing.price)
  const hasNoUploadedImages = !listing.images || listing.images.length === 0
  const titleLower = (listing.title || '').toLowerCase()
  const mentionsBrandDeal =
    titleLower.includes('direct brand') || titleLower.includes('brand account')

  const isBrandDeal =
    DIRECT_BRAND_DEAL_IDS.has(listing.id) ||
    ((price === 40000 || price === 110000) &&
      (hasNoUploadedImages || mentionsBrandDeal))

  if (!isBrandDeal) return null

  return {
    badgeLabel: 'DIRECT BRAND DEAL',
    artworkUrl:
      price === 110000
        ? '/images/direct-brand-deal-110k.svg'
        : '/images/direct-brand-deal-40k.svg',
  }
}

interface DirectBrandDealArtworkProps {
  info?: DirectBrandDealInfo
}

export const DirectBrandDealArtwork: React.FC<DirectBrandDealArtworkProps> = () => {
  return (
    <div className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#071224] to-slate-950 px-6 pb-8 pt-10 text-center transition-transform duration-700 ease-out group-hover:scale-[1.03]">
      {/* Soft, refined ambient emerald glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl" />

      {/* Subtle architectural grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.35) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Clean, centered Remote Jobs Hub brand identity */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_24px_-4px_rgba(16,185,129,0.3)] backdrop-blur-md">
          <Briefcase className="h-5 w-5 text-emerald-400" strokeWidth={2.25} />
        </div>

        <div className="font-heading text-base font-black tracking-tight text-white sm:text-lg">
          Remote Jobs <span className="text-emerald-400">Hub</span>
        </div>

        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-emerald-300 shadow-sm">
          <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-400" />
          <span>OFFICIAL BRAND ACCOUNT</span>
        </div>
      </div>
    </div>
  )
}
