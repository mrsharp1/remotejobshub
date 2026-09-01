import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  FolderOpen, 
  Loader2 
} from 'lucide-react'
import { disputeService } from '@/services/marketplace/dispute.service'
import { DisputeRoom } from '@/features/disputes/components/DisputeRoom'

export const AdminDisputesPage: React.FC = () => {
  // Tab filter states: 'pending' | 'under_review' | 'resolved' | 'closed' | 'rejected'
  const [activeTab, setActiveTab] = useState<
    'pending' | 'under_review' | 'resolved' | 'closed' | 'rejected'
  >('pending')
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null)

  // Fetch disputes list
  const {
    data: disputes = [],
    isLoading,
  } = useQuery({
    queryKey: ['admin-disputes-list'],
    queryFn: () => disputeService.getDisputes(),
  })

  // Filter disputes by active tab
  const filteredDisputes = disputes.filter((d) => {
    if (activeTab === 'pending') return d.status === 'pending'
    if (activeTab === 'under_review') return d.status === 'under_review'
    if (activeTab === 'closed') return d.status === 'closed'
    if (activeTab === 'rejected') return d.status === 'rejected'
    if (activeTab === 'resolved')
      return d.status === 'resolved_buyer' || d.status === 'resolved_seller'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
          Security Administrator Control Panel
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Dispute Resolution Center
        </h1>
      </div>

      {/* Tabs Menu */}
      <div className="scrollbar-none flex overflow-x-auto whitespace-nowrap border-b border-border text-xs font-semibold">
        {[
          { key: 'pending', label: 'Pending Assignments' },
          { key: 'under_review', label: 'Under Review' },
          { key: 'resolved', label: 'Resolved Cases' },
          { key: 'closed', label: 'Closed' },
          { key: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(
                tab.key as
                  | 'pending'
                  | 'under_review'
                  | 'resolved'
                  | 'closed'
                  | 'rejected'
              )
              setSelectedDisputeId(null)
            }}
            className={`border-b-2 px-4 py-2.5 transition-all ${
              activeTab === tab.key
                ? 'border-destructive font-bold text-destructive'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Disputes List */}
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm lg:col-span-4">
          <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Dispute Logs
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-destructive" />
            </div>
          ) : filteredDisputes.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No disputes in this category.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDisputes.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisputeId(d.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedDisputeId === d.id
                      ? 'bg-destructive/5 border-destructive'
                      : 'hover:bg-muted/30 border-border bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="block max-w-[150px] truncate text-xs font-bold text-foreground">
                      Case #{d.id.slice(0, 8)}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[8px] font-bold capitalize text-muted-foreground">
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                    {d.reason}
                  </p>
                  <span className="mt-2 block text-[8px] text-muted-foreground">
                    Opened: {new Date(d.created_at).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Dispute Inspector Workspace */}
        <div className="space-y-6 lg:col-span-8">
          {selectedDisputeId ? (
            <DisputeRoom disputeId={selectedDisputeId} role="admin" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed bg-card py-20 text-center shadow-sm">
              <FolderOpen className="h-10 w-10 text-muted-foreground animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  No Dispute Selected
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Select a case file from the sidebar to inspect.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default AdminDisputesPage
