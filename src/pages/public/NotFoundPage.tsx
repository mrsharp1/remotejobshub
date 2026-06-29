import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Search } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-muted/20 select-none font-heading text-[20rem] font-extrabold leading-none">
          404
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-3xl">
          <Search className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Page Not Found
        </h1>
        <p className="mx-auto max-w-md text-base text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="hover:bg-primary/90 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}
