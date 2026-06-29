import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Brain,
  Loader2,
  TrendingUp,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Activity,
} from 'lucide-react'
import { recommendationService } from '@/services/marketplace/recommendation.service'

export const AdminAIInsightsPage: React.FC = () => {
  // Fetch AI Insights
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['admin-ai-insights-records'],
    queryFn: () => recommendationService.getAdminAIInsights(),
  })

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-border/40 border-b pb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          Marketplace Predictive Intelligence Hub
        </span>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          AI Smart Insights
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Review automated fraud predictions, listing quality metrics, and
          growth forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="space-y-3 rounded-xl border bg-card p-5 shadow-sm"
          >
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              {ins.title}
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {ins.description}
            </p>
            <div className="flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-lg font-extrabold text-foreground">
                {ins.metric_value}
              </span>
              <span className="text-[10px] font-semibold text-primary">
                {ins.metric_change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast Graph placeholder using responsive SVG */}
      <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
          <Activity className="h-4.5 w-4.5 animate-pulse text-primary" />{' '}
          12-Month Predictive Volume Growth Curve
        </h3>

        <div className="relative h-48 w-full pt-4">
          <svg
            className="h-full w-full"
            viewBox="0 0 600 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="aiForecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-primary, #6366f1)"
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary, #6366f1)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M 0 90 Q 150 70 300 40 T 600 15 L 600 120 L 0 120 Z"
              fill="url(#aiForecastGrad)"
            />
            <path
              d="M 0 90 Q 150 70 300 40 T 600 15"
              fill="none"
              stroke="var(--color-primary, #6366f1)"
              strokeWidth="3"
              strokeDasharray="4,4"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 font-mono text-[9px] text-muted-foreground">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4 (Predicted Peak)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminAIInsightsPage
