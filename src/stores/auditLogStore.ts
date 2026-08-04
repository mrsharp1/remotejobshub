import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuditLog {
  id: string
  event: string
  timestamp: string
  details: any
}

interface AuditLogState {
  logs: AuditLog[]
  addLog: (event: string, details: any) => void
  clearLogs: () => void
}

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (event, details) => {
        const newLog: AuditLog = {
          id: Math.random().toString(36).substring(2, 9),
          event,
          timestamp: new Date().toISOString(),
          details,
        }
        set((state) => ({ logs: [newLog, ...state.logs].slice(0, 500) })) // Keep last 500 logs
      },
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'audit-logs-storage',
    }
  )
)
