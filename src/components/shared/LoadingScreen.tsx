import React from 'react'
import { Spinner } from './Spinner'
export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Spinner />
        <p className="font-heading text-lg font-medium">Loading Remote Jobs Hub...</p>
      </div>
    </div>
  )
}