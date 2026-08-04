import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react'
import type { ConversationViewModel } from '@/types'
import { formatCurrency } from '@/utils/currency'

interface ConversationSidebarProps {
  conversation: ConversationViewModel
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ conversation }) => {
  const listing = conversation.listing

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-heading font-semibold">Workspace Info</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Order / Listing Summary */}
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Summary</h4>
          {listing ? (
            <div>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img src={listing.images?.[0]?.image_url || '/placeholder.png'} alt={listing.title} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="line-clamp-2 text-sm font-semibold">{listing.title}</p>
                  <p className="mt-1 text-sm font-bold text-primary">{formatCurrency(Number(listing.price))}</p>
                </div>
              </div>
              <Link 
                to={`/marketplace/listing/${listing.id}`} 
                className="mt-4 flex w-full items-center justify-between rounded-lg bg-muted px-3 py-2 text-xs font-medium hover:bg-muted/80"
              >
                View Listing <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Support thread. No active order context.</p>
          )}
        </div>

        {/* Escrow Status (Mocking for now unless we fetch it) */}
        {listing && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500">Escrow Status</h4>
            </div>
            <p className="text-sm font-semibold">Funds Secured</p>
            <p className="text-xs text-muted-foreground mt-1">Payment is held securely and will only be released after credential verification.</p>
          </div>
        )}

        {/* Actions */}
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm space-y-2">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</h4>
          
          <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted">
            <span>Request Extension</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted">
            <span>Contact Support</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <span>Open Dispute</span>
            <AlertTriangle className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
