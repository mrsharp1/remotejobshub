import React from 'react'
import { Link } from 'react-router-dom'
export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="font-heading text-6xl font-extrabold text-primary">404</h1>
      <p className="mt-4 text-xl font-medium text-foreground">Page Not Found</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Go Home
      </Link>
    </div>
  )
}
