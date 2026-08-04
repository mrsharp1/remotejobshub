import React from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'

export const AnalyticsExport: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </button>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download Report</span>
      </button>
    </div>
  )
}
