import React from 'react'

import { ShieldCheck, Heart, Share2, Flag, ShoppingCart, MessageSquare } from 'lucide-react'
import type { Listing } from '@/types'

interface StickyPurchaseCardProps {
  listing: Listing
  isFavorited: boolean
  isCopied: boolean
  onBuyClick: () => void
  onContactClick: () => void
  onToggleFavorite: () => void
  onShare: () => void
}

export const StickyPurchaseCard: React.FC<StickyPurchaseCardProps> = ({
  listing,
  isFavorited,
  isCopied,
  onBuyClick,
  onContactClick,
  onToggleFavorite,
  onShare
}) => {
  const price = Number(listing.price)
  const commission = price * 0.05 // 5% fee example

  return (
    <>
      {/* Desktop Sticky Panel */}
      <div className="sticky top-24 hidden space-y-6 rounded-[24px] border border-white/10 bg-slate-900 shadow-2xl lg:block">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-heading text-3xl font-black text-white">₦{price.toLocaleString()}</h3>
          </div>

          <button
            onClick={onBuyClick}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-indigo-500 px-8 py-5 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)]"
          >
            <div className="absolute inset-0 translate-y-full bg-indigo-400 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Secure Checkout
            </span>
          </button>

          <button
            onClick={onContactClick}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-slate-800"
          >
            <MessageSquare className="h-4 w-4" />
            Contact Seller
          </button>

          <div className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Listing Price</span>
              <span className="font-mono text-slate-300">₦{price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Escrow Fee (5%)</span>
              <span className="font-mono text-slate-300">₦{commission.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-3 font-bold text-white">
              <span>Total Payment</span>
              <span className="font-mono text-indigo-400">₦{(price + commission).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            100% Escrow Protected
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/5 pt-6">
            <button
              onClick={onToggleFavorite}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isFavorited ? 'bg-rose-500/10 text-rose-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
              {isFavorited ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={onShare}
              className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              {isCopied ? 'Copied' : 'Share'}
            </button>
            <button className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <Flag className="h-4 w-4" />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/90 p-4 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Price</span>
            <span className="font-heading text-xl font-black text-white">₦{(price + commission).toLocaleString()}</span>
          </div>
          <button
            onClick={onBuyClick}
            className="flex-1 rounded-2xl bg-indigo-500 px-6 py-4 text-center text-sm font-bold text-white shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  )
}
