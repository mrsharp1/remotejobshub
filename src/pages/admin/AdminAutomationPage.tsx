import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Play, Loader2, Activity, Terminal } from 'lucide-react'
import { automationService } from '@/services/marketplace/automation.service'
import { useAuthStore } from '@/stores/authStore'
import { AutomationJob, AutomationAuditLog } from '@/types'

export const AdminAutomationPage: React.FC = () => {
  const { user } = useAuthStore()
  const [runningJobId, setRunningJobId] = useState<string | null>(null)

  // Fetch Jobs List
  const {
    data: jobs = [],
    isLoading: loadingJobs,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['admin-automation-jobs'],
    queryFn: () => automationService.getJobs(),
  })

  // Fetch Audit Logs List
  const {
    data: auditLogs = [],
    isLoading: loadingLogs,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ['admin-automation-audit-logs'],
    queryFn: () => automationService.getAuditLogs(),
  })

  // Trigger manual job run
  const handleTriggerJob = async (jobId: string) => {
    if (!user?.id) return
    setRunningJobId(jobId)

    try {
      await automationService.runJob(jobId, user.id)
      alert('Job executed successfully!')
      refetchJobs()
      refetchLogs()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Execution failed.')
    } finally {
      setRunningJobId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Marketplace Cron & Task Schedulers Desk
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Platform Automation Console
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Monitor scheduled cron tasks execution cycles, audit wallet balances
          integrity logs, and trigger manual tasks runs.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Scheduled Tasks List */}
        <div className="rounded-xl border bg-card shadow-sm lg:col-span-8">
          <div className="border-b p-4">
            <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              <Activity className="h-4.5 w-4.5 text-primary" /> Active Scheduled
              Platform Jobs
            </h3>
          </div>

          <div className="overflow-x-auto text-left text-xs">
            {loadingJobs ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-10 text-center italic text-muted-foreground">
                No automation jobs found on system registry.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900/50">
                  <tr>
                    <th className="p-3">Task Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Next Schedule</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y bg-white dark:bg-card">
                  {jobs.map((job: AutomationJob) => (
                    <tr
                      key={job.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="p-3 font-semibold text-foreground">
                        {job.name}
                      </td>
                      <td className="max-w-xs p-3 leading-normal text-muted-foreground">
                        {job.description}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-muted-foreground">
                        {job.next_run
                          ? new Date(job.next_run).toLocaleString()
                          : 'N/A'}
                      </td>
                      <td className="p-3 font-bold capitalize">
                        <span
                          className={`${
                            job.status === 'success'
                              ? 'text-green-500'
                              : job.status === 'failed'
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleTriggerJob(job.id)}
                          disabled={runningJobId !== null}
                          className="hover:bg-primary/95 inline-flex items-center gap-1 rounded bg-primary px-2.5 py-1 text-[10px] font-bold text-white transition-colors disabled:opacity-60"
                        >
                          {runningJobId === job.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Play className="h-3 w-3" /> Run
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Execution Audit stream logs */}
        <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm lg:col-span-4">
          <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            <Terminal className="h-4.5 w-4.5 text-primary" /> Execution Audit
            Logs
          </h3>

          {loadingLogs ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="py-2 text-center text-xs italic text-muted-foreground">
              No executions logged yet.
            </div>
          ) : (
            <div className="max-h-[450px] space-y-3 overflow-y-auto pr-1">
              {auditLogs.map((log: AutomationAuditLog) => (
                <div
                  key={log.id}
                  className="bg-muted/20 space-y-1 rounded-lg border p-3 text-[11px]"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="uppercase text-foreground">
                      {log.job_name}
                    </span>
                    <span
                      className={`rounded px-1.5 text-[9px] uppercase ${
                        log.status === 'success'
                          ? 'bg-green-500/15 text-green-500'
                          : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    {log.log_message}
                  </p>
                  <div className="pt-1 font-mono text-[9px] text-muted-foreground">
                    Time: {new Date(log.created_at).toLocaleString()}
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
export default AdminAutomationPage
