import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-background p-8 shadow-md">
        <div className="flex flex-col items-center">
          <Link to="/">
            <Briefcase className="h-8 w-8 text-primary" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Account Center
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  )
}