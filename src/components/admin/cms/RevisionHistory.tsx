import React, { useState, useEffect } from 'react'
import { History, RotateCcw, ArrowLeft, Clock } from 'lucide-react'
import { cmsProService, CMSRevision } from '@/services/cms/cmsPro.service'

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface RevisionHistoryProps {
  entityType: string
  entityId: string
  onRestore: (snapshot: any) => void
  onClose: () => void
}

export const RevisionHistory: React.FC<RevisionHistoryProps> = ({
  entityType,
  entityId,
  onRestore,
  onClose
}) => {
  const [revisions, setRevisions] = useState<CMSRevision[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRevisions = async () => {
      try {
        const data = await cmsProService.getRevisions(entityType, entityId)
        setRevisions(data)
      } catch (err) {
        console.error('Failed to load revisions', err)
      } finally {
        setLoading(false)
      }
    }
    loadRevisions()
  }, [entityType, entityId])

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-heading text-lg font-bold">Revision History</h3>
            <p className="text-sm text-muted-foreground">Restore previous versions</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No revision history found.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-border ml-3 space-y-8 pb-8">
              {revisions.map((rev, index) => (
                <div key={rev.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                  
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm group hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">
                          {index === 0 ? 'Current Version' : 'Previous Revision'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(rev.created_at).toLocaleString()} 
                          ({timeAgo(rev.created_at)})
                        </p>
                      </div>
                      {index !== 0 && (
                        <button
                          onClick={() => onRestore(rev.snapshot)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-all text-xs font-medium flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore
                        </button>
                      )}
                    </div>
                    {rev.restored_from && (
                      <p className="text-xs text-amber-600 bg-amber-500/10 px-2 py-1 rounded w-fit mt-2">
                        Restored from older version
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
