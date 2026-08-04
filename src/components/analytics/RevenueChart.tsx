import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { EmptyAnalytics } from './EmptyAnalytics'

export interface RevenueDataPoint {
  date: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
  height?: number
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return <EmptyAnalytics title="No Revenue Data" message="No sales data to visualize for this period." />
  }

  // Format Y-axis to k/M
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000000) return `₦${(tickItem / 1000000).toFixed(1)}M`
    if (tickItem >= 1000) return `₦${(tickItem / 1000).toFixed(1)}k`
    return `₦${tickItem}`
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: 'var(--foreground)' }}
            formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Revenue']}
            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
