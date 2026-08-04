import React from 'react'
import { Save, RotateCcw, AlertOctagon, XCircle, CheckCircle2 } from 'lucide-react'
import { useCMSStore } from '@/services/cms/cms.store'

export const PublishCenter: React.FC = () => {
  const { 
    aboutContent, aboutDraft, 
    communityContent, communityDraft, 
    contactContent, contactDraft, 
    globalStats, globalStatsDraft,
    homepageContent, homepageDraft,
    reviewsContent, reviewsDraft,
    hasUnpublishedChanges,
    lastSavedDraft,
    publishAll,
    discardAll,
    activityLog
  } = useCMSStore()

  const pendingModules = [
    { name: 'About Page', draft: aboutDraft, live: aboutContent },
    { name: 'Community Page', draft: communityDraft, live: communityContent },
    { name: 'Contact Page', draft: contactDraft, live: contactContent },
    { name: 'Global Statistics', draft: globalStatsDraft, live: globalStats },
    { name: 'Homepage', draft: homepageDraft, live: homepageContent },
    { name: 'Reviews & Testimonials', draft: reviewsDraft, live: reviewsContent },
  ].filter(m => m.draft)

  const draftCount = pendingModules.length

  const getChangedFields = (draft: any, live: any) => {
    if (!draft || !live) return []
    const changes: string[] = []
    Object.keys(draft).forEach(key => {
      // Very basic shallow/stringified comparison
      if (JSON.stringify(draft[key]) !== JSON.stringify(live[key])) {
        changes.push(key)
      }
    })
    return changes
  }

  return (
    <div className="p-6 space-y-8">
      {/* Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <AlertOctagon className={`h-6 w-6 ${hasUnpublishedChanges ? 'text-amber-500' : 'text-slate-400'}`} />
            <h2 className="font-heading text-lg font-bold">Publishing Status</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Unpublished Drafts:</span>
              <span className="font-bold">{draftCount} modules</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Auto-saved:</span>
              <span className="font-bold">{lastSavedDraft ? new Date(lastSavedDraft).toLocaleTimeString() : 'No drafts'}</span>
            </div>
            {hasUnpublishedChanges ? (
              <div className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-600 border border-amber-500/20">
                You have unpublished changes. Review and publish to make them live.
              </div>
            ) : (
              <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 border border-emerald-500/20 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> All changes are live.
              </div>
            )}
          </div>
        </div>

        {/* Global Actions */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold border-b pb-4 mb-4">Master Controls</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Publishing will push all draft changes across all managers to the live website instantly. This action cannot be undone without manually restoring previous versions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if(window.confirm('Are you sure you want to discard all drafts?')) discardAll()
              }}
              disabled={!hasUnpublishedChanges}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 font-bold text-destructive transition hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="h-4 w-4" /> Discard Changes
            </button>
            <button
              onClick={() => {
                publishAll()
                alert('All changes published successfully!')
              }}
              disabled={!hasUnpublishedChanges}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)]"
            >
              <Save className="h-4 w-4" /> Publish Entire Website
            </button>
          </div>
        </div>
      </div>

      {/* Pending Changes Diff */}
      {hasUnpublishedChanges && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-4 text-amber-600">
            <AlertOctagon className="h-5 w-5" /> Pending Changes
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingModules.map(mod => {
              const changedFields = getChangedFields(mod.draft, mod.live)
              return (
                <div key={mod.name} className="bg-card border rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-foreground">{mod.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {changedFields.length > 0 ? (
                      changedFields.map(field => (
                        <span key={field} className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold rounded uppercase tracking-wider">
                          {field}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Complex changes</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4 mb-4">
          <RotateCcw className="h-5 w-5 text-slate-400" />
          <h2 className="font-heading text-lg font-bold">CMS Activity Log</h2>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {activityLog.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">No recent activity.</p>
          ) : (
            activityLog.map((log) => (
              <div key={log.id} className="flex gap-4 border-l-2 border-border pl-4 relative">
                <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold text-foreground">{log.user}</span>{' '}
                    <span className="text-muted-foreground">{log.action}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {log.module}
                    </span>
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {log.status}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      • {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
