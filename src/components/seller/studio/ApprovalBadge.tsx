import React from 'react'

interface ApprovalBadgeProps {
  status: 'pending' | 'approved' | 'rejected'
}

export const ApprovalBadge: React.FC<ApprovalBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStyles()}`}
    >
      {status === 'pending' ? 'Pending Approval' : status}
    </span>
  )
}
